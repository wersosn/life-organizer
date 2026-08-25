import { apiClient } from "./apiClient";

export async function confirmEmail(token: string) {
    await apiClient.post("/auth/confirm-email", { token });
}

export async function forgotPassword(email: string) {
    await apiClient.post("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, newPassword: string) {
    await apiClient.post("/auth/reset-password", { token, newPassword });
}