import { HabitCompletion, HabitCompletionStatus } from "@/types/habit";

export type DayCell = {
    date: string; // "yyyy-MM-dd"
    dayOfMonth: number;
    status: HabitCompletionStatus | "none";
};

export function buildLast30Days(completions: HabitCompletion[]): DayCell[] {
    const statusByDate = new Map(completions.map(c => [c.date, c.status]));
    const days: DayCell[] = [];

    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().split("T")[0];
        days.push({
            date: iso,
            dayOfMonth: d.getDate(),
            status: statusByDate.get(iso) ?? "none",
        });
    }
    return days;
}

export function calculateStreak(completions: HabitCompletion[]): number {
    const completedDates = new Set(
        completions.filter(c => c.status === HabitCompletionStatus.Completed).map(c => c.date)
    );

    let streak = 0;
    const cursor = new Date();
    while (true) {
        const iso = cursor.toISOString().split("T")[0];
        if (!completedDates.has(iso)) break;
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}