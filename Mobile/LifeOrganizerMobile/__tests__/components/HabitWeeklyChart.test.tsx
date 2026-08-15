import { HabitWeeklyChart } from "@/components/HabitWeeklyChart";
import { HabitCompletionStatus } from "@/types/habit";
import { render, screen } from "@testing-library/react-native";

describe("HabitWeeklyChart", () => {
    it("renders the chart when completion data is provided", () => {
        const completions = [{ id: "1", date: "2023-01-01", status: HabitCompletionStatus.Completed }];

        render(<HabitWeeklyChart completions={completions} />);

        expect(screen.getByTestId("habit-weekly-chart")).toBeTruthy();
    });
});