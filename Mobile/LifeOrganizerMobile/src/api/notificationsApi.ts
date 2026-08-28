import { NotificationSettings } from "@/types/notification";
import { apiClient } from "./apiClient";

export async function registerPushToken(token: string) {
    await apiClient.post("/settings/pushtoken", { token });
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<NotificationSettings>("/settings/notifications");
    return response.data;
}

export async function updateNotificationSettings(settings: NotificationSettings) {
    await apiClient.put("/settings/notifications", settings);
}