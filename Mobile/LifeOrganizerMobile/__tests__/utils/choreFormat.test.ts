import { ChoreFrequency } from "@/types/chore";
import { formatFrequency, formatLastCompleted } from "@/utils/choreFormat";

describe("formatFrequency", () => {
    it("formats singular day correctly", () => {
        expect(formatFrequency(ChoreFrequency.Days, 1)).toBe("Every 1 day");
    });

    it("formats plural days correctly", () => {
        expect(formatFrequency(ChoreFrequency.Days, 3)).toBe("Every 3 days");
    });

    it("formats singular week correctly", () => {
        expect(formatFrequency(ChoreFrequency.Weeks, 1)).toBe("Every 1 week");
    });

    it("formats plural weeks correctly", () => {
        expect(formatFrequency(ChoreFrequency.Weeks, 2)).toBe("Every 2 weeks");
    });

    it("formats plural months correctly", () => {
        expect(formatFrequency(ChoreFrequency.Months, 6)).toBe("Every 6 months");
    });
});

describe("formatLastCompleted", () => {
    it("returns 'Never done' when lastCompletedAt is undefined", () => {
        expect(formatLastCompleted(undefined)).toBe("Never done");
    });

    it("returns 'Done today' when completed today", () => {
        const today = new Date().toISOString();
        expect(formatLastCompleted(today)).toBe("Done today");
    });

    it("returns 'Done yesterday' when completed one day ago", () => {
        const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
        expect(formatLastCompleted(yesterday)).toBe("Done yesterday");
    });

    it("returns 'Done N days ago' for older dates", () => {
        const fiveDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString();
        expect(formatLastCompleted(fiveDaysAgo)).toBe("Done 5 days ago");
    });
});