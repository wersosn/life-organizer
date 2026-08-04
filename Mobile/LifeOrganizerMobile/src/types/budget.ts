export type Budget = {
    id: string;
    categoryId: string;
    categoryName: string;
    monthlyLimit: number;
};

export type BudgetUsage = {
    id: string;
    categoryId: string;
    categoryName: string;
    monthlyLimit: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    isExceeded: boolean;
};