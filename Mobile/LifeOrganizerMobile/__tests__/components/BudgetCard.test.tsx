import { render, screen, fireEvent } from "@testing-library/react-native";
import { BudgetCard } from "@/components/BudgetCard";
import { BudgetUsage } from "@/types/budget";

const baseBudget: BudgetUsage = {
    id: "1",
    categoryId: "cat-1",
    categoryName: "Food",
    monthlyLimit: 500,
    spent: 150,
    remaining: 350,
    percentageUsed: 30,
    isExceeded: false,
};

describe("BudgetCard", () => {
    it("renders the category name and amounts", () => {
        render(<BudgetCard
            budget={baseBudget}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.getByText("Food")).toBeTruthy();
        expect(screen.getByText("150.00 zł spent")).toBeTruthy();
        expect(screen.getByText("of 500.00 zł")).toBeTruthy();
    });

    it("shows the percentage without an 'exceeded' label when under the limit", () => {
        render(<BudgetCard
            budget={baseBudget}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.getByText("30%")).toBeTruthy();
    });

    it("shows the 'exceeded' label when the budget is over the limit", () => {
        const exceededBudget: BudgetUsage = {
            ...baseBudget,
            spent: 600,
            remaining: -100,
            percentageUsed: 120,
            isExceeded: true,
        };

        render(<BudgetCard
            budget={exceededBudget}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.getByText("120% — exceeded")).toBeTruthy();
    });

    it("calls onEdit with the full budget object when the edit icon is pressed", () => {
        const onEdit = jest.fn();

        render(<BudgetCard
            budget={baseBudget}
            onEdit={onEdit}
            onDelete={jest.fn()}
        />);

        fireEvent.press(screen.getByTestId("edit-button"));

        expect(onEdit).toHaveBeenCalledWith(baseBudget);
    });

    it("calls onDelete with the budget id when the delete icon is pressed", () => {
        const onDelete = jest.fn();

        render(<BudgetCard
            budget={baseBudget}
            onEdit={jest.fn()}
            onDelete={onDelete}
        />);

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(onDelete).toHaveBeenCalledWith("1");
    });
});