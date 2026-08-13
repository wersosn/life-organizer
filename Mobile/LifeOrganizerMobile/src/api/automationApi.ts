import { AutomationSettings } from "@/types/automation";
import { apiClient } from "./apiClient";

export async function getAutomationSettings() {
    const response = await apiClient.get<AutomationSettings>("/settings/automation");
    return response.data;
}

export async function updateAutomationSettings(settings: AutomationSettings) {
    await apiClient.put("/settings/automation", settings);
}