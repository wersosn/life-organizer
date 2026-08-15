import { ExpenseBreakdownChart } from "@/components/ExpenseBreakdownChart";
import { render, screen } from "@testing-library/react-native";

describe("ExpenseBreakdownChart", () => {
    it("shows an empty state message when there is no data", () => {
        render(<ExpenseBreakdownChart breakdown={[]} />);

        expect(screen.getByText("No expenses to show yet.")).toBeTruthy();
    });

    it("renders the chart when breakdown data is provided", () => {
        const breakdown = [{ categoryId: "1", categoryName: "Food", total: 100 }];

        render(<ExpenseBreakdownChart breakdown={breakdown} />);

        expect(screen.getByTestId("expense-breakdown-chart")).toBeTruthy();
    });
});