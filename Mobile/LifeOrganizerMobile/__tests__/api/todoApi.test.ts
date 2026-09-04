import { apiClient } from "@/api/apiClient";
import { completeTodo, createTodo, deleteTodo, getTodos, updateTodo } from "@/api/todoApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

jest.mock("expo-crypto", () => ({
    randomUUID: jest.fn(() => "generated-uuid"),
}));

describe("todoApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getTodos", () => {
        it("getTodos calls the correct endpoint and returns data", async () => {
            const mockTodos = [{ id: "1", title: "Buy milk", isCompleted: false }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodos });

            const result = await getTodos();

            expect(apiClient.get).toHaveBeenCalledWith("/todo");
            expect(result).toEqual(mockTodos);
        });


    });

    describe("createTodo", () => {
        it("createTodo sends title and description in the payload", async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

            await createTodo("Buy milk", "2% fat");

            expect(apiClient.post).toHaveBeenCalledWith("/todo", {
                id: "generated-uuid",
                title: "Buy milk",
                description: "2% fat",
            });
        });

        it("createTodo sends undefined description when not provided", async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ data: "new-id" });

            await createTodo("Buy milk");

            expect(apiClient.post).toHaveBeenCalledWith("/todo", {
                id: "generated-uuid",
                title: "Buy milk",
                description: undefined,
            });
        });
    });

    describe("updateTodo", () => {
        it("sends a PUT request to the correct endpoint with the payload", async () => {
            (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

            await updateTodo("todo-1", "Buy bread", "Wholegrain");

            expect(apiClient.put).toHaveBeenCalledWith("/todo/todo-1", {
                title: "Buy bread",
                description: "Wholegrain",
            });
        });
    });

    describe("deleteTodo", () => {
        it("calls DELETE on the correct endpoint", async () => {
            (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

            await deleteTodo("todo-1");

            expect(apiClient.delete).toHaveBeenCalledWith("/todo/todo-1");
        });
    });

    describe("completeTodo", () => {
        it("calls PATCH on the correct endpoint", async () => {
            (apiClient.patch as jest.Mock).mockResolvedValue({ data: undefined });

            await completeTodo("todo-1");

            expect(apiClient.patch).toHaveBeenCalledWith("/todo/todo-1/complete");
        });
    });
});