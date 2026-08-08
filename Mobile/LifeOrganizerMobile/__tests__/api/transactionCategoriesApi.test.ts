import { apiClient } from "@/api/apiClient";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "@/api/transactionCategoriesApi";
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

describe("transactionCategoriesApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getCategories calls the correct endpoint and returns data", async () => {
        const mockCategories = [{ id: "1", name: "Food", type: TransactionType.Expense }];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCategories });

        const result = await getCategories();

        expect(apiClient.get).toHaveBeenCalledWith("/transactioncategories");
        expect(result).toEqual(mockCategories);
    });

    it("getCategoryById calls the correct endpoint", async () => {
        const mockCategory = { id: "1", name: "Food", type: TransactionType.Expense };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCategory });

        const result = await getCategoryById("category-id");

        expect(apiClient.get).toHaveBeenCalledWith("/transactioncategories/category-id");
        expect(result).toEqual(mockCategory);
    });

    it("createCategory sends name, type, and icon in the payload", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createCategory("Food", TransactionType.Expense, "food-icon");

        expect(apiClient.post).toHaveBeenCalledWith("/transactioncategories", {
            name: "Food",
            type: TransactionType.Expense,
            icon: "food-icon",
        });
    });

    it("createCategory sends undefined icon when not provided", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createCategory("Salary", TransactionType.Income);

        expect(apiClient.post).toHaveBeenCalledWith("/transactioncategories", {
            name: "Salary",
            type: TransactionType.Income,
            icon: undefined,
        });
    });

    it("updateCategory sends a PUT request to the correct endpoint with the payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateCategory("category-id", "Groceries", TransactionType.Expense, "cart-icon");

        expect(apiClient.put).toHaveBeenCalledWith("/transactioncategories/category-id", {
            name: "Groceries",
            type: TransactionType.Expense,
            icon: "cart-icon",
        });
    });

    it("deleteCategory calls DELETE on the correct endpoint", async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

        await deleteCategory("category-id");

        expect(apiClient.delete).toHaveBeenCalledWith("/transactioncategories/category-id");
    });
});