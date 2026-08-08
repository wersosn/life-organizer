import { DayOfWeek } from "@/types/days";
import { HabitFrequency } from "@/types/habit";
import { formatScheduledDays, FREQUENCY_LABELS } from "@/utils/habitLabels";

describe("FREQUENCY_LABELS", () => {
    it("has a label for every HabitFrequency value", () => {
        expect(FREQUENCY_LABELS[HabitFrequency.Daily]).toBe("Daily");
        expect(FREQUENCY_LABELS[HabitFrequency.Weekly]).toBe("Weekly");
        expect(FREQUENCY_LABELS[HabitFrequency.Custom]).toBe("Custom");
    });
});

describe("formatScheduledDays", () => {
    it("returns an empty string when no days are scheduled", () => {
        expect(formatScheduledDays([])).toBe("");
    });

    it("returns 'Every day' when all 7 days are scheduled", () => {
        const allDays = [
            DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
            DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday,
        ];
        expect(formatScheduledDays(allDays)).toBe("Every day");
    });

    it("returns comma-separated abbreviated labels for a subset of days", () => {
        const days = [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday];
        expect(formatScheduledDays(days)).toBe("Mon, Wed, Fri");
    });

    it("preserves the order of the given days rather than sorting them", () => {
        const days = [DayOfWeek.Friday, DayOfWeek.Monday];
        expect(formatScheduledDays(days)).toBe("Fri, Mon");
    });
});