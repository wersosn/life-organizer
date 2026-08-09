import { apiClient } from "@/api/apiClient";
import { completeHabit, createHabit, deleteHabit, getHabitById, getHabits, uncompleteHabit, updateHabit } from "@/api/habitsApi";
import { DayOfWeek } from "@/types/days";
import { HabitFrequency } from "@/types/habit";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
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

    it("getHabitById calls the correct endpoint and returns data", async () => {
        const mockDetails = { id: "1", name: "Meditation", recentCompletions: [] };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDetails });

        const result = await getHabitById("habit-id");

        expect(apiClient.get).toHaveBeenCalledWith("/habits/habit-id");
        expect(result).toEqual(mockDetails);
    });

    it("createHabit sends the correct payload", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createHabit("Meditation", HabitFrequency.Weekly, [DayOfWeek.Monday], "20:00:00");

        expect(apiClient.post).toHaveBeenCalledWith("/habits", {
            name: "Meditation",
            frequency: HabitFrequency.Weekly,
            scheduledDays: [DayOfWeek.Monday],
            completionDeadline: "20:00:00",
        });
    });

    it("createHabit sends undefined completionDeadline when not provided", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

        await createHabit("Meditation", HabitFrequency.Daily, []);

        expect(apiClient.post).toHaveBeenCalledWith("/habits", {
            name: "Meditation",
            frequency: HabitFrequency.Daily,
            scheduledDays: [],
            completionDeadline: undefined,
        });
    });

    it("updateHabit sends a PUT request to the correct endpoint with the payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateHabit("habit-id", "Gym", HabitFrequency.Custom, [DayOfWeek.Tuesday, DayOfWeek.Thursday], true, "07:00:00");

        expect(apiClient.put).toHaveBeenCalledWith("/habits/habit-id", {
            name: "Gym",
            frequency: HabitFrequency.Custom,
            scheduledDays: [DayOfWeek.Tuesday, DayOfWeek.Thursday],
            completionDeadline: "07:00:00",
            isAutomationEnabled: true,
        });
    });

    it("deleteHabit calls DELETE on the correct endpoint", async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

        await deleteHabit("habit-id");

        expect(apiClient.delete).toHaveBeenCalledWith("/habits/habit-id");
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

    it("uncompleteHabit sends date as a query param when provided", async () => {
        (apiClient.patch as jest.Mock).mockResolvedValue({ data: undefined });

        await uncompleteHabit("habit-id", "2026-07-25");

        expect(apiClient.patch).toHaveBeenCalledWith("/habits/habit-id/uncomplete", null, {
            params: { date: "2026-07-25" },
        });
    });

    it("uncompleteHabit omits params when no date is given", async () => {
        (apiClient.patch as jest.Mock).mockResolvedValue({ data: undefined });

        await uncompleteHabit("habit-id");

        expect(apiClient.patch).toHaveBeenCalledWith("/habits/habit-id/uncomplete", null, {
            params: undefined,
        });
    });
});