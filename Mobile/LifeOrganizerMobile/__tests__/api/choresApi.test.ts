import { apiClient } from "@/api/apiClient";
import { completeChore, createChore, deleteChore, getChoreById, getChores, uncompleteChore, updateChore } from "@/api/choresApi";
import { ChoreFrequency } from "@/types/chore";

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

    it("getChores calls the correct endpoint and returns data", async () => {
        const mockChores = [{ id: "1", name: "Wash dishes" }];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockChores });

        const result = await getChores();

        expect(apiClient.get).toHaveBeenCalledWith("/chores");
        expect(result).toEqual(mockChores);
    });

    it("getChoreById calls the correct endpoint and returns data", async () => {
        const mockDetails = { id: "1", name: "Wash dishes", recentCompletions: [] };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDetails });

        const result = await getChoreById("chore-id");

        expect(apiClient.get).toHaveBeenCalledWith("/chores/chore-id");
        expect(result).toEqual(mockDetails);
    });

    it("createChore sends the correct payload", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createChore("Wash dishes", "category-id", ChoreFrequency.Days, 1, true, "Kitchen sink");

        expect(apiClient.post).toHaveBeenCalledWith("/chores", {
            name: "Wash dishes",
            description: "Kitchen sink",
            categoryId: "category-id",
            frequencyUnit: ChoreFrequency.Days,
            frequencyValue: 1,
            isAutomationEnabled: true,
        });
    });

    it("createChore sends undefined description when not provided", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createChore("Wash dishes", "category-id", ChoreFrequency.Days, 1, true);

        expect(apiClient.post).toHaveBeenCalledWith("/chores", {
            name: "Wash dishes",
            description: undefined,
            categoryId: "category-id",
            frequencyUnit: ChoreFrequency.Days,
            frequencyValue: 1,
            isAutomationEnabled: true,
        });
    });

    it("updateChore sends a PUT request to the correct endpoint with the full payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateChore("chore-id", "Change bedsheets", "category-id", ChoreFrequency.Weeks, 3, false, "Master bedroom");

        expect(apiClient.put).toHaveBeenCalledWith("/chores/chore-id", {
            name: "Change bedsheets",
            description: "Master bedroom",
            categoryId: "category-id",
            frequencyUnit: ChoreFrequency.Weeks,
            frequencyValue: 3,
            isAutomationEnabled: false,
        });
    });

    it("deleteChore calls DELETE on the correct endpoint", async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

        await deleteChore("chore-id");

        expect(apiClient.delete).toHaveBeenCalledWith("/chores/chore-id");
    });

    it("completeChore sends completedAt and notes in the request body", async () => {
        (apiClient.patch as jest.Mock).mockResolvedValue({ data: "completion-id" });

        await completeChore("chore-id", "Done thoroughly", "2026-07-25T10:00:00.000Z");

        expect(apiClient.patch).toHaveBeenCalledWith("/chores/chore-id/complete", {
            completedAt: "2026-07-25T10:00:00.000Z",
            notes: "Done thoroughly",
        });
    });

    it("completeChore sends undefined fields when called with no arguments", async () => {
        (apiClient.patch as jest.Mock).mockResolvedValue({ data: "completion-id" });

        await completeChore("chore-id");

        expect(apiClient.patch).toHaveBeenCalledWith("/chores/chore-id/complete", {
            completedAt: undefined,
            notes: undefined,
        });
    });

    it("uncompleteChore calls PATCH on the correct endpoint with no body", async () => {
        (apiClient.patch as jest.Mock).mockResolvedValue({ data: undefined });

        await uncompleteChore("chore-id");

        expect(apiClient.patch).toHaveBeenCalledWith("/chores/chore-id/uncomplete");
    });
});