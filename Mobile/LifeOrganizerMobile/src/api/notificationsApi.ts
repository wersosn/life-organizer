import { apiClient } from "./apiClient";

export async function registerPushToken(token: string) {
    await apiClient.post("/pushtoken", { token });
}