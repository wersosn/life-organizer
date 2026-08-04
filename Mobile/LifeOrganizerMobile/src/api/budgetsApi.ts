import { Budget, BudgetUsage } from "@/types/budget";
import { apiClient } from "./apiClient";

export async function getBudgets() {
    const response = await apiClient.get<Budget[]>("/budgets");
    return response.data;
}

export async function getBudgetsWithUsage(year: number, month: number) {
    const response = await apiClient.get<BudgetUsage[]>("/budgets/usage", {
        params: { year, month },
    });
    return response.data;
}

export async function createBudget(categoryId: string, monthlyLimit: number) {
    const response = await apiClient.post("/budgets", { categoryId, monthlyLimit });
    return response.data;
}

export async function updateBudget(id: string, monthlyLimit: number) {
    const response = await apiClient.put(`/budgets/${id}`, { monthlyLimit });
    return response.data;
}

export async function deleteBudget(id: string) {
    const response = await apiClient.delete(`/budgets/${id}`);
    return response.data;
}