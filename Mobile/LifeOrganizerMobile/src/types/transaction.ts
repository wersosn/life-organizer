export enum TransactionType {
    Expense = 0,
    Income = 1,
}

export type TransactionCategory = {
    id: string;
    name: string;
    icon?: string;
    type: TransactionType;
};

export type Transaction = {
    id: string;
    categoryId: string;
    categoryName: string;
    amount: number;
    type: TransactionType;
    description?: string;
    date: string; // "yyyy-MM-dd"
};

export type MonthlySummary = {
    year: number;
    month: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    expensesByCategory: CategoryBreakdown[];
};

export type CategoryBreakdown = {
    categoryId: string;
    categoryName: string;
    total: number;
};