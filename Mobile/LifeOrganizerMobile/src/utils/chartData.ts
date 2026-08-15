import { HabitCompletion, HabitCompletionStatus } from "@/types/habit";
import { CategoryBreakdown } from "@/types/transaction";

export type PieChartDatum = {
    name: string;
    value: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
};

export type BarChartData = {
    labels: string[];
    datasets: [{ data: number[] }];
};

const CHART_COLORS = [
    "#4F7CFF", "#E53935", "#4CAF50", "#FF9800",
    "#9C27B0", "#00BCD4", "#FFC107", "#795548",
];

export function toPieChartData(breakdown: CategoryBreakdown[], legendFontColor: string): PieChartDatum[] {
    return breakdown.map((item, index) => ({
        name: item.categoryName,
        value: item.total,
        color: CHART_COLORS[index % CHART_COLORS.length],
        legendFontColor,
        legendFontSize: 13,
    }));
}

export function toWeeklyCompletionChart(completions: HabitCompletion[]): BarChartData {
    const days: { label: string; value: number }[] = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        const iso = d.toISOString().split("T")[0];
        const completion = completions.find(c => c.date === iso);
        const value = completion?.status === HabitCompletionStatus.Completed ? 1 : 0;

        days.push({ label: d.toLocaleDateString("en", { weekday: "short" })[0], value });
    }

    return {
        labels: days.map(d => d.label),
        datasets: [{ data: days.map(d => d.value) }],
    };
}