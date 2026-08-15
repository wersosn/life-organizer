import { HabitCompletionStatus } from "@/types/habit";
import { toPieChartData, toWeeklyCompletionChart } from "@/utils/chartData";

describe("toPieChartData", () => {
    it("maps category breakdown to chart data with assigned colors", () => {
        const breakdown = [
            { categoryId: "1", categoryName: "Food", total: 150 },
            { categoryId: "2", categoryName: "Transport", total: 50 },
        ];

        const result = toPieChartData(breakdown, "#000");

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({ name: "Food", value: 150, legendFontColor: "#000" });
        expect(result[1]).toMatchObject({ name: "Transport", value: 50 });
    });

    it("assigns a color to every entry", () => {
        const breakdown = [{ categoryId: "1", categoryName: "Food", total: 100 }];

        const result = toPieChartData(breakdown, "#000");

        expect(result[0].color).toBeTruthy();
    });

    it("returns an empty array when given no data", () => {
        expect(toPieChartData([], "#000")).toEqual([]);
    });

    it("cycles through the color palette when there are more categories than colors", () => {
        const breakdown = Array.from({ length: 10 }, (_, i) => ({
            categoryId: String(i),
            categoryName: `Category ${i}`,
            total: 10,
        }));

        const result = toPieChartData(breakdown, "#000");
        
        expect(result[8].color).toBe(result[0].color);
    });
});

describe("toWeeklyCompletionChart", () => {
    it("returns exactly 7 labels and 7 data points", () => {
        const result = toWeeklyCompletionChart([]);

        expect(result.labels).toHaveLength(7);
        expect(result.datasets[0].data).toHaveLength(7);
    });

    it("marks today as completed (1) when a matching completion exists", () => {
        const today = new Date().toISOString().split("T")[0];
        const completions = [{ id: "1", date: today, status: HabitCompletionStatus.Completed }];

        const result = toWeeklyCompletionChart(completions);

        expect(result.datasets[0].data[6]).toBe(1);
    });

    it("marks days without a completion as 0", () => {
        const result = toWeeklyCompletionChart([]);

        expect(result.datasets[0].data.every(v => v === 0)).toBe(true);
    });

    it("does not count a Missed completion as completed", () => {
        const today = new Date().toISOString().split("T")[0];
        const completions = [{ id: "1", date: today, status: HabitCompletionStatus.Missed }];

        const result = toWeeklyCompletionChart(completions);

        expect(result.datasets[0].data[6]).toBe(0);
    });
});