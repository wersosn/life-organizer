import { render, screen, fireEvent } from "@testing-library/react-native";
import { HabitFrequency, Habit } from "@/types/habit";
import { HabitCard } from "@/components/HabitCard";

const baseHabit: Habit = {
    id: "1",
    name: "Meditation",
    frequency: HabitFrequency.Daily,
    scheduledDays: [],
    isActive: true,
    createdAt: "2026-01-01",
    isCompletedToday: false,
};

describe("HabitCard", () => {
    it("renders the habit name and frequency label", async () => {
        render(
            <HabitCard
                habit={baseHabit}
                onToggleComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("Meditation")).toBeTruthy();
        expect(screen.getByText("Daily")).toBeTruthy();
    });

    it("calls onToggleComplete with the habit id when checkbox is pressed", () => {
        const onToggleComplete = jest.fn();

        render(
        <HabitCard
            habit={baseHabit}
            onToggleComplete={onToggleComplete}
            onPress={jest.fn()}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
        />
    );

    fireEvent.press(screen.getByTestId("toggle-complete-button"));

    expect(onToggleComplete).toHaveBeenCalledWith("1");
    });

    it("calls onDelete with the habit id when delete icon is pressed", () => {
        const onDelete = jest.fn();

        render(
            <HabitCard
                habit={baseHabit}
                onToggleComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={onDelete}
            />
        );

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(onDelete).toHaveBeenCalledWith("1");
    });
});