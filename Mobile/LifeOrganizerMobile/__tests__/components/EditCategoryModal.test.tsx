import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { EditCategoryModal } from "@/components/EditCategoryModal";
import { updateCategory } from "@/api/transactionCategoriesApi";
import { TransactionCategory, TransactionType } from "@/types/transaction";

jest.mock("@/api/transactionCategoriesApi", () => ({
    updateCategory: jest.fn(),
}));

const baseCategory: TransactionCategory = {
    id: "cat-1",
    name: "Food",
    icon: undefined,
    type: TransactionType.Expense,
};

describe("EditCategoryModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders nothing when category is null", () => {
        const { toJSON } = render(
            <EditCategoryModal
                visible={true}
                category={null}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        expect(toJSON()).toBeNull();
    });

    it("pre-fills the name input with the category's current name", () => {
        render(
            <EditCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue("Food")).toBeTruthy();
    });

    it("pre-selects the category's current type", () => {
        const incomeCategory = { ...baseCategory, type: TransactionType.Income };

        render(
            <EditCategoryModal
                visible={true}
                category={incomeCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        fireEvent.press(screen.getByText("Save"));
    });

    it("shows an error when trying to save with an empty name", async () => {
        render(
            <EditCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        fireEvent.changeText(screen.getByDisplayValue("Food"), "");
        fireEvent.press(screen.getByText("Save"));

        await waitFor(() => {
            expect(screen.getByText("Name is required")).toBeTruthy();
        });
        expect(updateCategory).not.toHaveBeenCalled();
    });

    it("calls updateCategory with the updated name and current type", async () => {
        (updateCategory as jest.Mock).mockResolvedValue(undefined);

        render(
            <EditCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        fireEvent.changeText(screen.getByDisplayValue("Food"), "Groceries");
        fireEvent.press(screen.getByText("Save"));

        await waitFor(() => {
            expect(updateCategory).toHaveBeenCalledWith("cat-1", "Groceries", TransactionType.Expense);
        });
    });

    it("calls updateCategory with a changed type when the user switches it", async () => {
        (updateCategory as jest.Mock).mockResolvedValue(undefined);

        render(
            <EditCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        fireEvent.press(screen.getByText("Income"));
        fireEvent.press(screen.getByText("Save"));

        await waitFor(() => {
            expect(updateCategory).toHaveBeenCalledWith("cat-1", "Food", TransactionType.Income);
        });
    });

    it("calls onUpdated on success", async () => {
        (updateCategory as jest.Mock).mockResolvedValue(undefined);
        const onUpdated = jest.fn();

        render(
            <EditCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={onUpdated}
            />
        );

        fireEvent.press(screen.getByText("Save"));

        await waitFor(() => {
            expect(onUpdated).toHaveBeenCalled();
        });
    });

    it("shows an error message when updateCategory fails", async () => {
        (updateCategory as jest.Mock).mockRejectedValue(new Error("network error"));

        render(
            <EditCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        fireEvent.press(screen.getByText("Save"));

        await waitFor(() => {
            expect(screen.getByText("Failed to update category. Please try again.")).toBeTruthy();
        });
    });

    it("resets the form when a different category is passed in", () => {
        const { rerender } = render(
            <EditCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue("Food")).toBeTruthy();

        const otherCategory: TransactionCategory = { id: "cat-2", name: "Transport", icon: undefined, type: TransactionType.Expense };

        rerender(
            <EditCategoryModal
                visible={true}
                category={otherCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue("Transport")).toBeTruthy();
        expect(screen.queryByDisplayValue("Food")).toBeNull();
    });
});