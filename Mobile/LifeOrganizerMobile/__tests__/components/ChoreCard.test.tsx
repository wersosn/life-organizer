import { render, screen, fireEvent } from "@testing-library/react-native";
import { ChoreCard } from "@/components/ChoreCard";
import { Chore, ChoreFrequency } from "@/types/chore";

const baseChore: Chore = {
    id: "1",
    name: "Wash dishes",
    description: undefined,
    categoryId: "cat-1",
    categoryName: "Kitchen",
    frequencyUnit: ChoreFrequency.Days,
    frequencyValue: 1,
    lastCompletedAt: undefined,
    isAutomationEnabled: true,
    isOverdue: false,
};

describe("ChoreCard", () => {
    it("renders the chore name, category, and frequency", () => {
        render(
            <ChoreCard
                chore={baseChore}
                onComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("Wash dishes")).toBeTruthy();
        expect(screen.getByText("Kitchen")).toBeTruthy();
        expect(screen.getByText("Every 1 day")).toBeTruthy();
    });

    it("does not show the overdue badge when the chore is not overdue", () => {
        render(
            <ChoreCard
                chore={baseChore}
                onComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.queryByText("Overdue")).toBeNull();
    });

    it("shows the overdue badge when the chore is overdue", () => {
        const overdueChore = { ...baseChore, isOverdue: true };

        render(
            <ChoreCard
                chore={overdueChore}
                onComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("Overdue")).toBeTruthy();
    });

    it("shows 'Never done' when the chore has no lastCompletedAt", () => {
        render(
            <ChoreCard
                chore={baseChore}
                onComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("Never done")).toBeTruthy();
    });

    it("shows 'Done today' when the chore was completed today", () => {
        const completedChore = { ...baseChore, lastCompletedAt: new Date().toISOString() };

        render(
            <ChoreCard
                chore={completedChore}
                onComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("Done today")).toBeTruthy();
    });

    it("calls onPress with the full chore object when the card is pressed", () => {
        const onPress = jest.fn();

        render(
            <ChoreCard
                chore={baseChore}
                onComplete={jest.fn()}
                onPress={onPress}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        fireEvent.press(screen.getByText("Wash dishes"));

        expect(onPress).toHaveBeenCalledWith(baseChore);
    });

    it("calls onComplete with the chore id when the complete button is pressed", () => {
        const onComplete = jest.fn();

        render(
            <ChoreCard
                chore={baseChore}
                onComplete={onComplete}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        fireEvent.press(screen.getByTestId("complete-button"));

        expect(onComplete).toHaveBeenCalledWith("1");
    });

    it("calls onEdit with the full chore object when the edit icon is pressed", () => {
        const onEdit = jest.fn();

        render(
            <ChoreCard
                chore={baseChore}
                onComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={onEdit}
                onDelete={jest.fn()}
            />
        );

        fireEvent.press(screen.getByTestId("edit-button"));

        expect(onEdit).toHaveBeenCalledWith(baseChore);
    });

    it("calls onDelete with the chore id when the delete icon is pressed", () => {
        const onDelete = jest.fn();

        render(
            <ChoreCard
                chore={baseChore}
                onComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={onDelete}
            />
        );

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(onDelete).toHaveBeenCalledWith("1");
    });
});