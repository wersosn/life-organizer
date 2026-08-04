import { apiClient } from "@/api/apiClient";
import { completeHabit, getHabits } from "@/api/habitsApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: { get: jest.fn(), patch: jest.fn() },
}));

describe("habitsApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getHabits calls the correct endpoint and returns data", async () => {
        const mockHabits = [{ id: "1", name: "Meditation" }];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockHabits });

        const result = await getHabits();

        expect(apiClient.get).toHaveBeenCalledWith("/habits");
        expect(result).toEqual(mockHabits);
    });

    it("completeHabit sends date as a query param when provided", async () => {
        (apiClient.patch as jest.Mock).mockResolvedValue({ data: undefined });

        await completeHabit("habit-id", "2026-07-25");

        expect(apiClient.patch).toHaveBeenCalledWith("/habits/habit-id/complete", null, {
            params: { date: "2026-07-25" },
        });
    });

    it("completeHabit omits params when no date is given", async () => {
        (apiClient.patch as jest.Mock).mockResolvedValue({ data: undefined });

        await completeHabit("habit-id");

        expect(apiClient.patch).toHaveBeenCalledWith("/habits/habit-id/complete", null, {
            params: undefined,
        });
    });
});