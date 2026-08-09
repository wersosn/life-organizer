import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { CreateCategoryModal } from "@/components/CreateCategoryModal";
import { createCategory } from "@/api/transactionCategoriesApi";
import { TransactionType } from "@/types/transaction";

jest.mock("@/api/transactionCategoriesApi", () => ({
    createCategory: jest.fn(),
}));

describe("CreateCategoryModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("does not render its content when visible is false", () => {
        render(<CreateCategoryModal
            visible={false}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        expect(screen.queryByPlaceholderText("Category name")).toBeNull();
    });

    it("renders the input and both type options when visible", () => {
        render(<CreateCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        expect(screen.getByPlaceholderText("Category name")).toBeTruthy();
        expect(screen.getByText("Expense")).toBeTruthy();
        expect(screen.getByText("Income")).toBeTruthy();
    });

    it("defaults the title to 'expense category'", () => {
        render(<CreateCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        expect(screen.getByText("New expense category")).toBeTruthy();
    });

    it("updates the title when switching to Income", () => {
        render(<CreateCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        fireEvent.press(screen.getByText("Income"));

        expect(screen.getByText("New income category")).toBeTruthy();
    });

    it("shows an error when trying to create with an empty name", async () => {
        render(<CreateCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        fireEvent.press(screen.getByTestId("create-button"));

        await waitFor(() => {
            expect(screen.getByText("Name is required")).toBeTruthy();
        });
        expect(createCategory).not.toHaveBeenCalled();
    });

    it("calls createCategory with the entered name and selected type", async () => {
        (createCategory as jest.Mock).mockResolvedValue("new-category-id");

        render(<CreateCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Groceries");
        fireEvent.press(screen.getByText("Income"));
        fireEvent.press(screen.getByTestId("create-button"));

        await waitFor(() => {
            expect(createCategory).toHaveBeenCalledWith("Groceries", TransactionType.Income);
        });
    });

    it("calls onCreated with the new category id on success", async () => {
        (createCategory as jest.Mock).mockResolvedValue("new-category-id");
        const onCreated = jest.fn();

        render(<CreateCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={onCreated}
        />)
            ;

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Groceries");
        fireEvent.press(screen.getByTestId("create-button"));

        await waitFor(() => {
            expect(onCreated).toHaveBeenCalledWith("new-category-id");
        });
    });

    it("shows an error message when createCategory fails", async () => {
        (createCategory as jest.Mock).mockRejectedValue(new Error("network error"));

        render(<CreateCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Groceries");
        fireEvent.press(screen.getByTestId("create-button"));

        await waitFor(() => {
            expect(screen.getByText("Failed to create category. Please try again.")).toBeTruthy();
        });
    });

    it("calls onClose and clears the name when Cancel is pressed", () => {
        const onClose = jest.fn();

        render(<CreateCategoryModal
            visible={true}
            onClose={onClose}
            onCreated={jest.fn()}
        />
        );

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Groceries");
        fireEvent.press(screen.getByTestId("cancel-button"));

        expect(onClose).toHaveBeenCalled();
    });
});