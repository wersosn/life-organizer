import { ChoreFrequency } from "@/types/chore";

export function formatFrequency(unit: ChoreFrequency, value: number): string {
    const unitLabel = unit === ChoreFrequency.Days ? "day" : unit === ChoreFrequency.Weeks ? "week" : "month";
    return `Every ${value} ${unitLabel}${value === 1 ? "" : "s"}`;
}

export function formatLastCompleted(lastCompletedAt?: string): string {
    if (!lastCompletedAt) {
        return "Never done";
    }

    const date = new Date(lastCompletedAt);
    const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) {
        return "Done today";
    }
    if (daysAgo === 1) {
        return "Done yesterday";
    }
    return `Done ${daysAgo} days ago`;
}