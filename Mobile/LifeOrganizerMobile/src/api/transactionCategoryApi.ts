import { TransactionCategory, TransactionType } from "@/types/transaction";
import { apiClient } from "./apiClient";

export async function getCategories() {
    const response = await apiClient.get<TransactionCategory[]>("/transactioncategories");
    return response.data;
}

export async function createCategory(name: string, type: TransactionType, icon?: string) {
    const response = await apiClient.post("/transactioncategories", { name, type, icon });
    return response.data;
}