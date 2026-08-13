import { apiClient } from "./apiClient";

export async function getRetentionSettings() {
    const response = await apiClient.get<{ taskHistoryRetentionDays: number }>("/settings/retention");
    return response.data;
}

export async function updateRetentionSettings(days: number) {
    await apiClient.put("/settings/retention", { taskHistoryRetentionDays: days });
}