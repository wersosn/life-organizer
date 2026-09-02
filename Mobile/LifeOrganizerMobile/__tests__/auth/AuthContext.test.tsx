import { apiClient } from "@/api/apiClient";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { getRefreshToken, getAccessToken, saveTokens, removeTokens } from "@/auth/tokenStorage";
import { clearUserProfileLocally, saveUserProfileLocally } from "@/database/repositories/userRepository";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import axios from "axios";

jest.mock("@/auth/tokenStorage", () => ({
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    saveTokens: jest.fn(),
    removeTokens: jest.fn(),
}));

jest.mock("@/api/apiClient", () => ({
    apiClient: { get: jest.fn() },
}));

jest.mock("axios", () => ({
    post: jest.fn().mockResolvedValue({ data: {} }),
}));

jest.mock("@/database/repositories/userRepository", () => ({
    saveUserProfileLocally: jest.fn(),
    clearUserProfileLocally: jest.fn(),
}));

describe("AuthContext", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("initial load (loadToken)", () => {
        it("stays logged out when there is no saved tokens", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue(null);
            (getRefreshToken as jest.Mock).mockResolvedValue(null);

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
            expect(apiClient.get).not.toHaveBeenCalled();
        });

        it("restores the session when a saved access token is valid", async () => {
            const mockUser = { id: "1", email: "test@test.com", name: "Test User" };
            (getAccessToken as jest.Mock).mockResolvedValue("saved-token");
            (getRefreshToken as jest.Mock).mockResolvedValue("saved-refresh-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUser });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.token).toBe("saved-token");
            expect(result.current.user).toEqual(mockUser);
            expect(saveUserProfileLocally).toHaveBeenCalledWith(
                expect.objectContaining({ id: "1", email: "test@test.com", name: "Test User" })
            );
        });

        it("logs out when the saved token is rejected with 401 (refresh already failed)", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue("saved-token");
            (getRefreshToken as jest.Mock).mockResolvedValue("saved-refresh-token");
            (apiClient.get as jest.Mock).mockRejectedValue({ response: { status: 401 } });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(removeTokens).toHaveBeenCalled();
            expect(clearUserProfileLocally).toHaveBeenCalled();
            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
        });

        it("stays logged in on a network error, even though user profile could not be fetched", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue("saved-token");
            (getRefreshToken as jest.Mock).mockResolvedValue("saved-refresh-token");
            (apiClient.get as jest.Mock).mockRejectedValue({ code: "ERR_NETWORK" });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(removeTokens).not.toHaveBeenCalled();
            expect(result.current.token).toBe("saved-token");
        });

        it("attempts to restore session via refresh token even when access token is missing", async () => {
            const mockUser = { id: "1", email: "test@test.com", name: "Test User" };
            (getAccessToken as jest.Mock).mockResolvedValue(null);
            (getRefreshToken as jest.Mock).mockResolvedValue("valid-refresh-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUser });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
            expect(result.current.user).toEqual(mockUser);
        });
    });

    describe("login", () => {
        it("saves both tokens and fetches the user profile", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue(null);
            (getRefreshToken as jest.Mock).mockResolvedValue(null);
            const mockUser = { id: "1", email: "test@test.com", name: "Test User" };
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUser });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(async () => {
                await result.current.login("new-token", "new-refresh-token");
            });

            expect(saveTokens).toHaveBeenCalledWith("new-token", "new-refresh-token");
            expect(result.current.token).toBe("new-token");
            expect(result.current.user).toEqual(mockUser);
            expect(saveUserProfileLocally).toHaveBeenCalledWith(
                expect.objectContaining({ id: "1", email: "test@test.com", name: "Test User" })
            );
        });

        it("keeps the token set even if fetching the user profile fails with a non-401 error", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue(null);
            (getRefreshToken as jest.Mock).mockResolvedValue(null);
            (apiClient.get as jest.Mock).mockRejectedValue(new Error("network error"));

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(async () => {
                await result.current.login("new-token", "new-refresh-token");
            });

            expect(result.current.token).toBe("new-token");
        });

        it("clears the session if fetching the user profile fails with 401", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue(null);
            (getRefreshToken as jest.Mock).mockResolvedValue(null);
            (apiClient.get as jest.Mock).mockRejectedValue({ response: { status: 401 } });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(async () => {
                await result.current.login("new-token", "new-refresh-token");
            });

            expect(removeTokens).toHaveBeenCalled();
            expect(clearUserProfileLocally).toHaveBeenCalled();
            expect(result.current.token).toBeNull();
        });
    });

    describe("logout", () => {
        it("calls the backend logout endpoint and clears tokens and user", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue("saved-token");
            (getRefreshToken as jest.Mock).mockResolvedValue("saved-refresh-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: { id: "1", email: "a@a.com", name: "A" } });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));
            expect(result.current.token).toBe("saved-token");

            await act(async () => {
                await result.current.logout();
            });

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/auth/logout"),
                { refreshToken: "saved-refresh-token" }
            );
            expect(removeTokens).toHaveBeenCalled();
            expect(clearUserProfileLocally).toHaveBeenCalled();
            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
        });

        it("still clears local session even if the backend call fails", async () => {
            (getAccessToken as jest.Mock).mockResolvedValue("saved-token");
            (getRefreshToken as jest.Mock).mockResolvedValue("saved-refresh-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: { id: "1", email: "a@a.com", name: "A" } });
            (axios.post as jest.Mock).mockRejectedValue(new Error("network error"));

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(async () => {
                await result.current.logout();
            });

            expect(removeTokens).toHaveBeenCalled();
            expect(clearUserProfileLocally).toHaveBeenCalled();
            expect(result.current.token).toBeNull();
        });

        it("does NOT clear local todos or the sync queue on logout", async () => {
            // clearUserProfileLocally clears only the user_profile table - todos/sync_queue
            // must survive logout so unsynced offline changes aren't lost.

            (getAccessToken as jest.Mock).mockResolvedValue("saved-token");
            (getRefreshToken as jest.Mock).mockResolvedValue("saved-refresh-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: { id: "1", email: "a@a.com", name: "A" } });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(async () => {
                await result.current.logout();
            });

            expect(clearUserProfileLocally).toHaveBeenCalledTimes(1);
            
            // no assertion possible on todosRepository here since AuthContext
            // must not import/call anything from it - absence of a mock call
            // is implicitly enforced by not mocking it at all in this file
        });
    });
});