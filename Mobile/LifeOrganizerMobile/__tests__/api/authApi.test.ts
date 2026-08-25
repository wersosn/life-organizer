import { apiClient } from "@/api/apiClient";
import { confirmEmail, forgotPassword, resetPassword } from "@/api/authApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

describe("authApi", () => {
    afterEach(() => jest.clearAllMocks());

    it("confirmEmail sends the token to the correct endpoint", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

        await confirmEmail("test-token");

        expect(apiClient.post).toHaveBeenCalledWith("/auth/confirm-email", { token: "test-token" });
    });

    it("forgotPassword sends the email to the correct endpoint", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

        await forgotPassword("user@test.com");

        expect(apiClient.post).toHaveBeenCalledWith("/auth/forgot-password", { email: "user@test.com" });
    });

    it("resetPassword sends the token and new password to the correct endpoint", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

        await resetPassword("reset-token", "NewPassword123");

        expect(apiClient.post).toHaveBeenCalledWith("/auth/reset-password", {
            token: "reset-token",
            newPassword: "NewPassword123",
        });
    });
});