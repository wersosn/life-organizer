import { apiClient } from "@/api/apiClient";
import { completeTodo, createTodo, deleteTodo, getTodos, updateTodo } from "@/api/todoApi";
import { getAllTodosLocally, insertTodoLocally, upsertTodoLocally } from "@/database/repositories/todoRepository";
import { getLocalUserId } from "@/database/repositories/userRepository";
import { enqueueSyncAction, processSyncQueue } from "@/services/syncQueue";
import { TaskSource } from "@/types/todo";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

jest.mock("@/database/repositories/todoRepository", () => ({
    insertTodoLocally: jest.fn(),
    upsertTodoLocally: jest.fn(),
    getAllTodosLocally: jest.fn(),
}));

jest.mock("@/database/repositories/userRepository", () => ({
    getLocalUserId: jest.fn(),
}));

jest.mock("@/services/syncQueue", () => ({
    enqueueSyncAction: jest.fn(),
    processSyncQueue: jest.fn(),
}));

jest.mock("expo-crypto", () => ({
    randomUUID: jest.fn(() => "generated-uuid"),
}));

describe("todoApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getTodos", () => {
        it("pushes pending sync queue before fetching", async () => {
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);
            (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
            (getLocalUserId as jest.Mock).mockReturnValue("user-1");
            (getAllTodosLocally as jest.Mock).mockReturnValue([]);

            await getTodos();

            expect(processSyncQueue).toHaveBeenCalled();
        });

        it("upserts fetched todos locally and returns local data", async () => {
            const serverTodos = [
                { id: "1", title: "Buy milk", description: null, isCompleted: false, source: TaskSource.Manual, sourceId: null, createdAt: "2026-01-01T00:00:00Z", completedAt: null, updatedAt: "2026-01-01T00:00:00Z" },
            ];
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);
            (apiClient.get as jest.Mock).mockResolvedValue({ data: serverTodos });
            (getLocalUserId as jest.Mock).mockReturnValue("user-1");
            const localTodos = [{ id: "1", title: "Buy milk", isCompleted: false }];
            (getAllTodosLocally as jest.Mock).mockReturnValue(localTodos);

            const result = await getTodos();

            expect(apiClient.get).toHaveBeenCalledWith("/todo");
            expect(upsertTodoLocally).toHaveBeenCalledWith(
                expect.objectContaining({ id: "1", userId: "user-1", title: "Buy milk" })
            );
            expect(result).toEqual(localTodos);
        });

        it("does not upsert anything when there is no local user id yet", async () => {
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);
            (apiClient.get as jest.Mock).mockResolvedValue({ data: [{ id: "1", title: "Buy milk" }] });
            (getLocalUserId as jest.Mock).mockReturnValue(null);
            (getAllTodosLocally as jest.Mock).mockReturnValue([]);

            await getTodos();

            expect(upsertTodoLocally).not.toHaveBeenCalled();
        });

        it("falls back to local data when the server request fails", async () => {
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);
            (apiClient.get as jest.Mock).mockRejectedValue(new Error("network error"));
            const localTodos = [{ id: "1", title: "Buy milk", isCompleted: false }];
            (getAllTodosLocally as jest.Mock).mockReturnValue(localTodos);

            const result = await getTodos();

            expect(upsertTodoLocally).not.toHaveBeenCalled();
            expect(result).toEqual(localTodos);
        });
    });

    describe("createTodo", () => {
        it("inserts the todo locally with a generated id before syncing", async () => {
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);

            const result = await createTodo("user-1", "Buy milk", "2% fat");

            expect(insertTodoLocally).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: "generated-uuid",
                    userId: "user-1",
                    title: "Buy milk",
                    description: "2% fat",
                    isCompleted: false,
                    source: TaskSource.Manual,
                    sourceId: null,
                })
            );
            expect(result).toEqual({ id: "generated-uuid" });
        });

        it("enqueues a create sync action with the correct payload", async () => {
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);

            await createTodo("user-1", "Buy milk", "2% fat");

            expect(enqueueSyncAction).toHaveBeenCalledWith("todo", "generated-uuid", "create", {
                id: "generated-uuid",
                title: "Buy milk",
                description: "2% fat",
            });
        });

        it("sends null description when not provided", async () => {
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);

            await createTodo("user-1", "Buy milk");

            expect(enqueueSyncAction).toHaveBeenCalledWith("todo", "generated-uuid", "create", {
                id: "generated-uuid",
                title: "Buy milk",
                description: null,
            });
        });

        it("triggers background sync after creating locally", async () => {
            (processSyncQueue as jest.Mock).mockResolvedValue(undefined);

            await createTodo("user-1", "Buy milk");

            expect(processSyncQueue).toHaveBeenCalled();
        });

        it("does not throw when background sync fails", async () => {
            (processSyncQueue as jest.Mock).mockRejectedValue(new Error("network error"));

            await expect(createTodo("user-1", "Buy milk")).resolves.toEqual({ id: "generated-uuid" });
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