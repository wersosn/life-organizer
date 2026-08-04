import { buildLast30Days, calculateStreak } from "@/utils/habitCalendar";
import { HabitCompletionStatus } from "@/types/habit";

function isoDaysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
}

describe("calculateStreak", () => {
    it("returns 0 when there are no completions", () => {
        expect(calculateStreak([])).toBe(0);
    });

    it("counts consecutive completed days ending today", () => {
        const completions = [
            { date: isoDaysAgo(0), status: HabitCompletionStatus.Completed },
            { date: isoDaysAgo(1), status: HabitCompletionStatus.Completed },
            { date: isoDaysAgo(2), status: HabitCompletionStatus.Completed },
        ];
        expect(calculateStreak(completions)).toBe(3);
    });

    it("stops counting at the first missed day", () => {
        const completions = [
            { date: isoDaysAgo(0), status: HabitCompletionStatus.Completed },
            { date: isoDaysAgo(1), status: HabitCompletionStatus.Missed },
            { date: isoDaysAgo(2), status: HabitCompletionStatus.Completed },
        ];
        expect(calculateStreak(completions)).toBe(1);
    });

    it("returns 0 when today is not completed, even with a past streak", () => {
        const completions = [
            { date: isoDaysAgo(1), status: HabitCompletionStatus.Completed },
            { date: isoDaysAgo(2), status: HabitCompletionStatus.Completed },
        ];
        expect(calculateStreak(completions)).toBe(0);
    });
});

describe("buildLast30Days", () => {
    it("returns exactly 30 days ending today", () => {
        const result = buildLast30Days([]);

        expect(result).toHaveLength(30);
        expect(result[result.length - 1].date).toBe(isoDaysAgo(0));
        expect(result[0].date).toBe(isoDaysAgo(29));
    });

    it("marks days without a matching completion as 'none'", () => {
        const result = buildLast30Days([]);

        expect(result.every(day => day.status === "none")).toBe(true);
    });

    it("assigns the correct status to a day with a matching completion", () => {
        const completions = [
            { date: isoDaysAgo(2), status: HabitCompletionStatus.Completed },
            { date: isoDaysAgo(5), status: HabitCompletionStatus.Missed },
        ];

        const result = buildLast30Days(completions);

        const completedDay = result.find(d => d.date === isoDaysAgo(2));
        const missedDay = result.find(d => d.date === isoDaysAgo(5));

        expect(completedDay?.status).toBe(HabitCompletionStatus.Completed);
        expect(missedDay?.status).toBe(HabitCompletionStatus.Missed);
    });
});