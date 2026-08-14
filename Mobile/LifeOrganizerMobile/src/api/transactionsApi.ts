import { MonthlySummary, Transaction, TransactionType } from "@/types/transaction";
import { apiClient } from "./apiClient";

export async function getTransactions(from?: string, to?: string) {
    const response = await apiClient.get<Transaction[]>("/transactions", {
        params: { from, to },
    });
    return response.data;
}

export async function getTransactionById(id: string) {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
}

export async function createTransaction(categoryId: string, amount: number, type: TransactionType, date: string, description?: string) {
    const response = await apiClient.post("/transactions", {
        categoryId,
        amount,
        type,
        date,
        description,
    });
    return response.data;
}

export async function updateTransaction(id: string, categoryId: string, amount: number, type: TransactionType, date: string, description?: string) {
    const response = await apiClient.put(`/transactions/${id}`, {
        categoryId,
        amount,
        type,
        date,
        description,
    });
    return response.data;
}

export async function deleteTransaction(id: string) {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
}

export async function getMonthlySummary(year: number, month: number) {
    const response = await apiClient.get<MonthlySummary>("/transactions/summary", {
        params: { year, month },
    });
    return response.data;
}

export async function exportTransactions(from?: string, to?: string): Promise<string> {
    const response = await apiClient.get("/transactions/export", {
        params: { from, to },
        responseType: "text",
    });
    return response.data;
}