import { apiClient } from "./apiClient";

export async function registerPushToken(token: string) {
    await apiClient.post("/pushtoken", { token });
}

export async function sendTestNotification() {
    await apiClient.post("/settings/test-notification");
}