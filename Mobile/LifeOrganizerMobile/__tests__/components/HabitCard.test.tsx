import { render, screen, fireEvent } from "@testing-library/react-native";
import { HabitFrequency, Habit } from "@/types/habit";
import { HabitCard } from "@/components/HabitCard";
import { DayOfWeek } from "@/types/days";

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

    it("shows 'Every day' as the subtitle for a Daily habit", () => {
        render(
            <HabitCard
                habit={baseHabit}
                onToggleComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("Every day")).toBeTruthy();
    });

    it("shows the scheduled days as the subtitle for a Weekly habit", () => {
        const weeklyHabit: Habit = {
            ...baseHabit,
            frequency: HabitFrequency.Weekly,
            scheduledDays: [DayOfWeek.Monday, DayOfWeek.Wednesday],
        };

        render(
            <HabitCard
                habit={weeklyHabit}
                onToggleComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("Weekly")).toBeTruthy();
        expect(screen.getByText("Mon, Wed")).toBeTruthy();
    });

    it("does not show a checkmark when the habit is not completed today", () => {
        render(
            <HabitCard
                habit={baseHabit}
                onToggleComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.queryByText("✓")).toBeNull();
    });

    it("shows a checkmark when the habit is completed today", () => {
        const completedHabit = { ...baseHabit, isCompletedToday: true };

        render(
            <HabitCard
                habit={completedHabit}
                onToggleComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText("✓")).toBeTruthy();
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

    it("calls onPress with the full habit object when the card is pressed", () => {
        const onPress = jest.fn();

        render(
            <HabitCard
                habit={baseHabit}
                onToggleComplete={jest.fn()}
                onPress={onPress}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        fireEvent.press(screen.getByText("Meditation"));

        expect(onPress).toHaveBeenCalledWith(baseHabit);
    });

    it("calls onEdit with the full habit object when the edit icon is pressed", () => {
        const onEdit = jest.fn();

        render(
            <HabitCard
                habit={baseHabit}
                onToggleComplete={jest.fn()}
                onPress={jest.fn()}
                onEdit={onEdit}
                onDelete={jest.fn()}
            />
        );

        fireEvent.press(screen.getByTestId("edit-button"));

        expect(onEdit).toHaveBeenCalledWith(baseHabit);
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