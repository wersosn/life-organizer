import { apiClient } from "@/api/apiClient";
import { createTransaction, deleteTransaction, getMonthlySummary, getTransactionById, getTransactions, updateTransaction } from "@/api/transactionsApi";
import { TransactionType } from "@/types/transaction";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

describe("transactionsApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

     it("getTransactions sends from and to as query params", async () => {
        const mockTransactions = [{ id: "1", amount: 50 }];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTransactions });

        const result = await getTransactions("2026-07-01", "2026-07-31");

        expect(apiClient.get).toHaveBeenCalledWith("/transactions", {
            params: { from: "2026-07-01", to: "2026-07-31" },
        });
        expect(result).toEqual(mockTransactions);
    });

    it("getTransactions sends undefined params when called with no arguments", async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

        await getTransactions();

        expect(apiClient.get).toHaveBeenCalledWith("/transactions", {
            params: { from: undefined, to: undefined },
        });
    });

    it("getTransactionById calls the correct endpoint", async () => {
        const mockTransaction = { id: "1", amount: 50 };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTransaction });

        const result = await getTransactionById("transaction-id");

        expect(apiClient.get).toHaveBeenCalledWith("/transactions/transaction-id");
        expect(result).toEqual(mockTransaction);
    });

    it("createTransaction sends the correct payload", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createTransaction("category-id", 49.99, TransactionType.Expense, "2026-07-25", "Groceries");

        expect(apiClient.post).toHaveBeenCalledWith("/transactions", {
            categoryId: "category-id",
            amount: 49.99,
            type: TransactionType.Expense,
            date: "2026-07-25",
            description: "Groceries",
        });
    });

    it("createTransaction sends undefined description when not provided", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createTransaction("category-id", 49.99, TransactionType.Expense, "2026-07-25");

        expect(apiClient.post).toHaveBeenCalledWith("/transactions", {
            categoryId: "category-id",
            amount: 49.99,
            type: TransactionType.Expense,
            date: "2026-07-25",
            description: undefined,
        });
    });

    it("updateTransaction sends a PUT request to the correct endpoint with the full payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateTransaction("transaction-id", "category-id", 75, TransactionType.Income, "2026-07-20", "Freelance work");

        expect(apiClient.put).toHaveBeenCalledWith("/transactions/transaction-id", {
            categoryId: "category-id",
            amount: 75,
            type: TransactionType.Income,
            date: "2026-07-20",
            description: "Freelance work",
        });
    });

    it("deleteTransaction calls DELETE on the correct endpoint", async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

        await deleteTransaction("transaction-id");

        expect(apiClient.delete).toHaveBeenCalledWith("/transactions/transaction-id");
    });

    it("getMonthlySummary sends year and month as query params", async () => {
        const mockSummary = { totalIncome: 3000, totalExpense: 1200, balance: 1800 };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockSummary });

        const result = await getMonthlySummary(2026, 7);

        expect(apiClient.get).toHaveBeenCalledWith("/transactions/summary", {
            params: { year: 2026, month: 7 },
        });
        expect(result).toEqual(mockSummary);
    });
});
