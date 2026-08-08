import { apiClient } from "@/api/apiClient";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { getToken, removeToken, saveToken } from "@/auth/tokenStorage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

jest.mock("@/auth/tokenStorage", () => ({
    getToken: jest.fn(),
    saveToken: jest.fn(),
    removeToken: jest.fn(),
}));

jest.mock("@/api/apiClient", () => ({
    apiClient: { get: jest.fn() },
}));

describe("AuthContext", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("initial load (loadToken)", () => {
        it("stays logged out when there is no saved token", async () => {
            (getToken as jest.Mock).mockResolvedValue(null);

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
            expect(apiClient.get).not.toHaveBeenCalled();
        });

        it("restores the session when a saved token is valid", async () => {
            const mockUser = { id: "1", email: "test@test.com", name: "Test User" };
            (getToken as jest.Mock).mockResolvedValue("saved-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUser });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.token).toBe("saved-token");
            expect(result.current.user).toEqual(mockUser);
        });

        it("logs out when the saved token is rejected with 401", async () => {
            (getToken as jest.Mock).mockResolvedValue("expired-token");
            (apiClient.get as jest.Mock).mockRejectedValue({ response: { status: 401 } });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(removeToken).toHaveBeenCalled();
            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
        });

        it("stays logged in on a network error, even though user profile could not be fetched", async () => {
            (getToken as jest.Mock).mockResolvedValue("saved-token");
            (apiClient.get as jest.Mock).mockRejectedValue({ code: "ERR_NETWORK" });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(removeToken).not.toHaveBeenCalled();
            expect(result.current.token).toBe("saved-token");
        });
    });

    describe("login", () => {
        it("saves the token and fetches the user profile", async () => {
            (getToken as jest.Mock).mockResolvedValue(null);
            const mockUser = { id: "1", email: "test@test.com", name: "Test User" };
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUser });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(async () => {
                await result.current.login("new-token");
            });

            expect(saveToken).toHaveBeenCalledWith("new-token");
            expect(result.current.token).toBe("new-token");
            expect(result.current.user).toEqual(mockUser);
        });

        it("keeps the token set even if fetching the user profile fails", async () => {
            (getToken as jest.Mock).mockResolvedValue(null);
            (apiClient.get as jest.Mock).mockRejectedValue(new Error("network error"));

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(async () => {
                await result.current.login("new-token");
            });

            expect(result.current.token).toBe("new-token");
        });
    });

    describe("logout", () => {
        it("clears the token and user", async () => {
            (getToken as jest.Mock).mockResolvedValue("saved-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: { id: "1", email: "a@a.com", name: "A" } });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));
            expect(result.current.token).toBe("saved-token");

            await act(async () => {
                await result.current.logout();
            });

            expect(removeToken).toHaveBeenCalled();
            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
        });
    });

    describe("logout", () => {
        it("clears the token and user", async () => {
            (getToken as jest.Mock).mockResolvedValue("saved-token");
            (apiClient.get as jest.Mock).mockResolvedValue({ data: { id: "1", email: "a@a.com", name: "A" } });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.loading).toBe(false));
            expect(result.current.token).toBe("saved-token");

            await act(async () => {
                await result.current.logout();
            });

            expect(removeToken).toHaveBeenCalled();
            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
        });
    });
});