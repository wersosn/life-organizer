import { DayOfWeek } from "@/types/days";
import { Habit, HabitFrequency } from "@/types/habit";
import { isScheduledForToday } from "@/utils/habitSchedule";

function makeHabit(overrides: Partial<Habit>): Habit {
    return {
        id: "1",
        name: "Test habit",
        frequency: HabitFrequency.Daily,
        scheduledDays: [],
        isActive: true,
        createdAt: "2026-01-01",
        isCompletedToday: false,
        ...overrides,
    };
}

describe("isScheduledForToday", () => {
    it("always returns true for Daily habits, regardless of scheduledDays", () => {
        const habit = makeHabit({ frequency: HabitFrequency.Daily, scheduledDays: [] });
        expect(isScheduledForToday(habit)).toBe(true);
    });

    it("returns true when today's day of week is in scheduledDays", () => {
        const todayDayOfWeek = new Date().getDay() as DayOfWeek;
        const habit = makeHabit({ frequency: HabitFrequency.Weekly, scheduledDays: [todayDayOfWeek] });

        expect(isScheduledForToday(habit)).toBe(true);
    });

    it("returns false when today's day of week is not in scheduledDays", () => {
        const todayDayOfWeek = new Date().getDay() as DayOfWeek;

        const otherDay = ((todayDayOfWeek + 1) % 7) as DayOfWeek;
        const habit = makeHabit({ frequency: HabitFrequency.Weekly, scheduledDays: [otherDay] });

        expect(isScheduledForToday(habit)).toBe(false);
    });

    it("returns false for Custom frequency with an empty scheduledDays list", () => {
        const habit = makeHabit({ frequency: HabitFrequency.Custom, scheduledDays: [] });
        expect(isScheduledForToday(habit)).toBe(false);
    });
});