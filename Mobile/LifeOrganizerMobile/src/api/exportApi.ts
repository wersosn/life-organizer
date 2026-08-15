import { apiClient } from "@/api/apiClient";

export async function exportFullData(): Promise<string> {
    const response = await apiClient.get("/settings/fullexport", {
        responseType: "text",
    });
    return response.data;
}