import { DayOfWeek } from "./days";

export enum HabitFrequency {
    Daily = 0,
    Weekly = 1,
    Monthly = 2,
    Custom = 3,
}

export enum HabitCompletionStatus {
    Completed = 0,
    Missed = 1,
}

export type Habit = {
    id: string;
    name: string;
    frequency: HabitFrequency;
    scheduledDays: DayOfWeek[];
    completionDeadline?: string; // TimeSpan - "HH:mm:ss"
    isActive: boolean;
    createdAt: string;
    isCompletedToday?: boolean;
}

export type HabitCompletion = {
    date: string; // DateOnly - "yyyy-MM-dd"
    status: HabitCompletionStatus;
};

export type HabitDetails = {
    id: string;
    name: string;
    frequency: HabitFrequency;
    scheduledDays: DayOfWeek[];
    completionDeadline?: string;
    recentCompletions: HabitCompletion[];
};