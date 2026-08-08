import { render, screen, fireEvent } from "@testing-library/react-native";
import { TransactionCard } from "@/components/TransactionCard";
import { Transaction, TransactionType } from "@/types/transaction";

const baseTransaction: Transaction = {
    id: "1",
    categoryId: "cat-1",
    categoryName: "Food",
    amount: 49.99,
    type: TransactionType.Expense,
    description: undefined,
    date: "2026-07-25",
};

describe("TransactionCard", () => {
    it("renders the category name and formatted date", () => {
        render(<TransactionCard
            transaction={baseTransaction}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.getByText("Food")).toBeTruthy();
    });

    it("renders the description when provided", () => {
        const withDescription = { ...baseTransaction, description: "Groceries" };

        render(<TransactionCard
            transaction={withDescription}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.getByText("Groceries")).toBeTruthy();
    });

    it("does not render a description when none is provided", () => {
        render(<TransactionCard
            transaction={baseTransaction}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.queryByText("Groceries")).toBeNull();
    });

    it("shows the amount with a minus sign for an expense", () => {
        render(<TransactionCard
            transaction={baseTransaction}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.getByText("-49.99 zł")).toBeTruthy();
    });

    it("shows the amount with a plus sign for income", () => {
        const income: Transaction = { ...baseTransaction, type: TransactionType.Income, amount: 3000 };

        render(<TransactionCard
            transaction={income}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />);

        expect(screen.getByText("+3000.00 zł")).toBeTruthy();
    });

    it("calls onEdit with the full transaction object when the edit icon is pressed", () => {
        const onEdit = jest.fn();

        render(<TransactionCard
            transaction={baseTransaction}
            onEdit={onEdit}
            onDelete={jest.fn()}
        />);

        fireEvent.press(screen.getByTestId("edit-button"));

        expect(onEdit).toHaveBeenCalledWith(baseTransaction);
    });

    it("calls onDelete with the transaction id when the delete icon is pressed", () => {
        const onDelete = jest.fn();

        render(<TransactionCard
            transaction={baseTransaction}
            onEdit={jest.fn()}
            onDelete={onDelete}
        />);

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(onDelete).toHaveBeenCalledWith("1");
    });
});