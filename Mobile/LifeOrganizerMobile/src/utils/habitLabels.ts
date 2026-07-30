import { DayOfWeek } from "@/types/days";
import { HabitFrequency } from "@/types/habit";

export const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
    [HabitFrequency.Daily]: "Daily",
    [HabitFrequency.Weekly]: "Weekly",
    [HabitFrequency.Monthly]: "Monthly",
    [HabitFrequency.Custom]: "Custom",
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
    [DayOfWeek.Sunday]: "Sun",
    [DayOfWeek.Monday]: "Mon",
    [DayOfWeek.Tuesday]: "Tue",
    [DayOfWeek.Wednesday]: "Wed",
    [DayOfWeek.Thursday]: "Thu",
    [DayOfWeek.Friday]: "Fri",
    [DayOfWeek.Saturday]: "Sat",
};

export function formatScheduledDays(days: DayOfWeek[]): string {
    if (days.length === 0) {
        return "";
    }

    if (days.length === 7) {
        return "Every day";
    }
    
    return days.map(d => DAY_LABELS[d]).join(", ");
}