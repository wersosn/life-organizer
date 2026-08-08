import { render, fireEvent } from "@testing-library/react-native";
import TodoCard from "@/components/TodoCard";
import { Todo } from "@/types/todo";

const baseTodo: Todo = {
    id: "1",
    title: "Buy milk",
    description: undefined,
    isCompleted: false,
    createdAt: "2026-01-01",
};

describe("TodoCard", () => {
    it("renders the todo title", () => {
        const { getByText } = render(
            <TodoCard
                todo={baseTodo}
                onComplete={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
            />
        );

        expect(getByText("Buy milk")).toBeTruthy();
    });

    it("renders the description when provided", () => {
        const todoWithDescription = { ...baseTodo, description: "2% fat" };

        const { getByText } = render(
            <TodoCard
                todo={todoWithDescription}
                onComplete={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
            />
        );

        expect(getByText("2% fat")).toBeTruthy();
    });

    it("does not render a description when none is provided", () => {
        const { queryByText } = render(
            <TodoCard
                todo={baseTodo}
                onComplete={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
            />
        );

        expect(queryByText("2% fat")).toBeNull();
    });

    it("does not show a checkmark when the todo is not completed", () => {
        const { queryByText } = render(
            <TodoCard
                todo={baseTodo}
                onComplete={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
            />
        );

        expect(queryByText("✓")).toBeNull();
    });

    it("shows a checkmark when the todo is completed", () => {
        const completedTodo = { ...baseTodo, isCompleted: true };

        const { getByText } = render(
            <TodoCard
                todo={completedTodo}
                onComplete={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
            />
        );

        expect(getByText("✓")).toBeTruthy();
    });

    it("calls onComplete with the todo id when the checkbox is pressed", () => {
        const onComplete = jest.fn();

        const { getByTestId } = render(
            <TodoCard
                todo={baseTodo}
                onComplete={onComplete}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
            />
        );

        fireEvent.press(getByTestId("complete-button"));

        expect(onComplete).toHaveBeenCalledWith("1");
    });

    it("calls onEdit with the full todo object when the edit icon is pressed", () => {
        const onEdit = jest.fn();

        const { getByTestId } = render(
            <TodoCard
                todo={baseTodo}
                onComplete={jest.fn()}
                onDelete={jest.fn()}
                onEdit={onEdit}
            />
        );

        fireEvent.press(getByTestId("edit-button"));

        expect(onEdit).toHaveBeenCalledWith(baseTodo);
    });

    it("calls onDelete with the todo id when the delete icon is pressed", () => {
        const onDelete = jest.fn();

        const { getByTestId } = render(
            <TodoCard
                todo={baseTodo}
                onComplete={jest.fn()}
                onDelete={onDelete}
                onEdit={jest.fn()}
            />
        );

        fireEvent.press(getByTestId("delete-button"));

        expect(onDelete).toHaveBeenCalledWith("1");
    });
});