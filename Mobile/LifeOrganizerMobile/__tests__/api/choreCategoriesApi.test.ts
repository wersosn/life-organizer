import { apiClient } from "@/api/apiClient";
import { createChoreCategory, deleteChoreCategory, getChoreCategories, getChoreCategoryById, updateChoreCategory } from "@/api/choreCategoriesApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

describe("choreCategoriesApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getChoreCategories calls the correct endpoint and returns data", async () => {
        const mockCategories = [{ id: "1", name: "Kitchen" }];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCategories });

        const result = await getChoreCategories();

        expect(apiClient.get).toHaveBeenCalledWith("/chorecategories");
        expect(result).toEqual(mockCategories);
    });

    it("getChoreCategoryById calls the correct endpoint", async () => {
        const mockCategory = { id: "1", name: "Kitchen" };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCategory });

        const result = await getChoreCategoryById("category-id");

        expect(apiClient.get).toHaveBeenCalledWith("/chorecategories/category-id");
        expect(result).toEqual(mockCategory);
    });

    it("createChoreCategory sends name and icon in the payload", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createChoreCategory("Bathroom", "bathroom-icon");

        expect(apiClient.post).toHaveBeenCalledWith("/chorecategories", {
            name: "Bathroom",
            icon: "bathroom-icon",
        });
    });

    it("createChoreCategory sends undefined icon when not provided", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createChoreCategory("Bathroom");

        expect(apiClient.post).toHaveBeenCalledWith("/chorecategories", {
            name: "Bathroom",
            icon: undefined,
        });
    });

    it("updateChoreCategory sends a PUT request to the correct endpoint with the payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateChoreCategory("category-id", "Bathroom & Laundry", "new-icon");

        expect(apiClient.put).toHaveBeenCalledWith("/chorecategories/category-id", {
            name: "Bathroom & Laundry",
            icon: "new-icon",
        });
    });

    it("deleteChoreCategory calls DELETE on the correct endpoint", async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

        await deleteChoreCategory("category-id");

        expect(apiClient.delete).toHaveBeenCalledWith("/chorecategories/category-id");
    });
});