import { Chore, ChoreDetails, ChoreFrequency } from "@/types/chore";
import { apiClient } from "./apiClient";
import * as Crypto from "expo-crypto";

export async function getChores() {
    const response = await apiClient.get<Chore[]>("/chores");
    return response.data;
}

export async function getChoreById(id: string) {
    const response = await apiClient.get<ChoreDetails>(`/chores/${id}`);
    return response.data;
}

export async function createChore(name: string, categoryId: string, frequencyUnit: ChoreFrequency, frequencyValue: number, isAutomationEnabled: boolean, description?: string) {
    const id = Crypto.randomUUID();
    const response = await apiClient.post("/chores", {
        id,
        name,
        description,
        categoryId,
        frequencyUnit,
        frequencyValue,
        isAutomationEnabled,
    });
    return response.data;
}

export async function updateChore(id: string, name: string, categoryId: string, frequencyUnit: ChoreFrequency, frequencyValue: number, isAutomationEnabled: boolean, description?: string
) {
    const response = await apiClient.put(`/chores/${id}`, {
        name,
        description,
        categoryId,
        frequencyUnit,
        frequencyValue,
        isAutomationEnabled,
    });
    return response.data;
}

export async function deleteChore(id: string) {
    const response = await apiClient.delete(`/chores/${id}`);
    return response.data;
}

export async function completeChore(id: string, notes?: string, completedAt?: string) {
    const response = await apiClient.patch(`/chores/${id}/complete`, {
        completedAt,
        notes,
    });
    return response.data;
}

export async function uncompleteChore(id: string) {
    await apiClient.patch(`/chores/${id}/uncomplete`);
}