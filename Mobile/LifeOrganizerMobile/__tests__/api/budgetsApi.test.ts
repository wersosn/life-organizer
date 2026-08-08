import { apiClient } from "@/api/apiClient";
import { createBudget, deleteBudget, getBudgets, getBudgetsWithUsage, updateBudget } from "@/api/budgetsApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

describe("budgetsApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getBudgets calls the correct endpoint and returns data", async () => {
        const mockBudgets = [{ id: "1", categoryName: "Food", monthlyLimit: 500 }];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBudgets });

        const result = await getBudgets();

        expect(apiClient.get).toHaveBeenCalledWith("/budgets");
        expect(result).toEqual(mockBudgets);
    });

    it("getBudgetsWithUsage sends year and month as query params", async () => {
        const mockUsage = [{ id: "1", categoryName: "Food", spent: 150, monthlyLimit: 500 }];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUsage });

        const result = await getBudgetsWithUsage(2026, 7);

        expect(apiClient.get).toHaveBeenCalledWith("/budgets/usage", {
            params: { year: 2026, month: 7 },
        });
        expect(result).toEqual(mockUsage);
    });

    it("createBudget sends categoryId and monthlyLimit in the payload", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createBudget("category-id", 500);

        expect(apiClient.post).toHaveBeenCalledWith("/budgets", {
            categoryId: "category-id",
            monthlyLimit: 500,
        });
    });

    it("updateBudget sends a PUT request to the correct endpoint with only monthlyLimit", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateBudget("budget-id", 750);

        expect(apiClient.put).toHaveBeenCalledWith("/budgets/budget-id", {
            monthlyLimit: 750,
        });
    });

    it("deleteBudget calls DELETE on the correct endpoint", async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

        await deleteBudget("budget-id");

        expect(apiClient.delete).toHaveBeenCalledWith("/budgets/budget-id");
    });
});