import { DayOfWeek } from "@/types/days";
import { Habit, HabitFrequency } from "@/types/habit";

export function isScheduledForToday(habit: Habit): boolean {
    if (habit.frequency === HabitFrequency.Daily) {
        return true;
    }

    const todayDayOfWeek = new Date().getDay() as DayOfWeek;
    return habit.scheduledDays.includes(todayDayOfWeek);
}