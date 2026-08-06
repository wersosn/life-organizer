import { ChoreCategory } from "@/types/chore";
import { apiClient } from "./apiClient";

export async function getChoreCategories() {
    const response = await apiClient.get<ChoreCategory[]>("/chorecategories");
    return response.data;
}

export async function getChoreCategoryById(id: string) {
    const response = await apiClient.get<ChoreCategory>(`/chorecategories/${id}`);
    return response.data;
}

export async function createChoreCategory(name: string, icon?: string) {
    const response = await apiClient.post("/chorecategories", { name, icon });
    return response.data;
}

export async function updateChoreCategory(id: string, name: string, icon?: string) {
    const response = await apiClient.put(`/chorecategories/${id}`, { name, icon });
    return response.data;
}

export async function deleteChoreCategory(id: string) {
    const response = await apiClient.delete(`/chorecategories/${id}`);
    return response.data;
}