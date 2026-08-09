import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { EditChoreCategoryModal } from "@/components/EditChoreCategoryModal";
import { updateChoreCategory } from "@/api/choreCategoriesApi";
import { ChoreCategory } from "@/types/chore";

jest.mock("@/api/choreCategoriesApi", () => ({
    updateChoreCategory: jest.fn(),
}));

const baseCategory: ChoreCategory = {
    id: "cat-1",
    name: "Kitchen",
    icon: undefined,
};

describe("EditChoreCategoryModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders nothing when category is null", () => {
        const { toJSON } = render(
            <EditChoreCategoryModal
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
            <EditChoreCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue("Kitchen")).toBeTruthy();
    });

    it("shows an error when trying to save with an empty name", async () => {
        render(
            <EditChoreCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        fireEvent.changeText(screen.getByDisplayValue("Kitchen"), "");
        fireEvent.press(screen.getByText("Save"));

        await waitFor(() => {
            expect(screen.getByText("Name is required")).toBeTruthy();
        });
        expect(updateChoreCategory).not.toHaveBeenCalled();
    });

    it("calls updateChoreCategory with the updated name", async () => {
        (updateChoreCategory as jest.Mock).mockResolvedValue(undefined);

        render(
            <EditChoreCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        fireEvent.changeText(screen.getByDisplayValue("Kitchen"), "Kitchen & Dining");
        fireEvent.press(screen.getByText("Save"));

        await waitFor(() => {
            expect(updateChoreCategory).toHaveBeenCalledWith("cat-1", "Kitchen & Dining");
        });
    });

    it("calls onUpdated on success", async () => {
        (updateChoreCategory as jest.Mock).mockResolvedValue(undefined);
        const onUpdated = jest.fn();

        render(
            <EditChoreCategoryModal
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

    it("shows an error message when updateChoreCategory fails", async () => {
        (updateChoreCategory as jest.Mock).mockRejectedValue(new Error("network error"));

        render(
            <EditChoreCategoryModal
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
            <EditChoreCategoryModal
                visible={true}
                category={baseCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue("Kitchen")).toBeTruthy();

        const otherCategory: ChoreCategory = { id: "cat-2", name: "Bathroom", icon: undefined };

        rerender(
            <EditChoreCategoryModal
                visible={true}
                category={otherCategory}
                onClose={jest.fn()}
                onUpdated={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue("Bathroom")).toBeTruthy();
        expect(screen.queryByDisplayValue("Kitchen")).toBeNull();
    });
});