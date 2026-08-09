import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { createChoreCategory } from "@/api/choreCategoriesApi";
import { CreateChoreCategoryModal } from "@/components/CreateChoreCaregoryModal";

jest.mock("@/api/choreCategoriesApi", () => ({
    createChoreCategory: jest.fn(),
}));

describe("CreateChoreCategoryModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("does not render its content when visible is false", () => {
        render(<CreateChoreCategoryModal
            visible={false}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        expect(screen.queryByPlaceholderText("Category name")).toBeNull();
    });

    it("renders the input when visible", () => {
        render(<CreateChoreCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        expect(screen.getByPlaceholderText("Category name")).toBeTruthy();
        expect(screen.getByText("New category")).toBeTruthy();
    });

    it("shows an error when trying to create with an empty name", async () => {
        render(<CreateChoreCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        fireEvent.press(screen.getByText("Create"));

        await waitFor(() => {
            expect(screen.getByText("Name is required")).toBeTruthy();
        });
        expect(createChoreCategory).not.toHaveBeenCalled();
    });

    it("calls createChoreCategory with the entered name", async () => {
        (createChoreCategory as jest.Mock).mockResolvedValue("new-category-id");

        render(<CreateChoreCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Bathroom");
        fireEvent.press(screen.getByText("Create"));

        await waitFor(() => {
            expect(createChoreCategory).toHaveBeenCalledWith("Bathroom");
        });
    });

    it("calls onCreated with the new category id on success", async () => {
        (createChoreCategory as jest.Mock).mockResolvedValue("new-category-id");
        const onCreated = jest.fn();

        render(<CreateChoreCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={onCreated}
        />
        );

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Bathroom");
        fireEvent.press(screen.getByText("Create"));

        await waitFor(() => {
            expect(onCreated).toHaveBeenCalledWith("new-category-id");
        });
    });

    it("shows an error message when createChoreCategory fails", async () => {
        (createChoreCategory as jest.Mock).mockRejectedValue(new Error("network error"));

        render(<CreateChoreCategoryModal
            visible={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
        />
        );

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Bathroom");
        fireEvent.press(screen.getByText("Create"));

        await waitFor(() => {
            expect(screen.getByText("Failed to create category. Please try again.")).toBeTruthy();
        });
    });

    it("calls onClose and clears the name when Cancel is pressed", () => {
        const onClose = jest.fn();

        render(<CreateChoreCategoryModal
            visible={true}
            onClose={onClose}
            onCreated={jest.fn()}
        />
        );

        fireEvent.changeText(screen.getByPlaceholderText("Category name"), "Bathroom");
        fireEvent.press(screen.getByText("Cancel"));

        expect(onClose).toHaveBeenCalled();
    });
});