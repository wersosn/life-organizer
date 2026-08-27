import { apiClient } from "./apiClient";

export async function registerPushToken(token: string) {
    await apiClient.post("/settings/pushtoken", { token });
}

export async function sendTestNotification() {
    await apiClient.post("/test/test-notification");
}