import { Todo } from "@/types/todo";
import { apiClient } from "./apiClient";

export async function getTodos() {
    const response = await apiClient.get<Todo[]>("/todo");
    return response.data;
}

export async function createTodo(title: string, description?: string) {
    const response = await apiClient.post("/todo", {
        title,
        description,
    });

    return response.data;
}