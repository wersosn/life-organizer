import { TaskSource, Todo } from "@/types/todo";
import { apiClient } from "./apiClient";
import * as Crypto from "expo-crypto";
import { getAllTodosLocally, insertTodoLocally, upsertTodoLocally } from "@/database/repositories/todoRepository";
import { enqueueSyncAction, processSyncQueue } from "@/services/syncQueue";
import { getLocalUserId } from "@/database/repositories/userRepository";

export async function getTodos() {
    /*await processSyncQueue().catch(e => console.log("[Sync] Push failed", e));

    try {
        const response = await apiClient.get<any[]>("/todo");
        const userId = getLocalUserId();
        if (userId) {
            for (const item of response.data) {
                try {
                    upsertTodoLocally({
                        id: item.id,
                        userId,
                        title: item.title,
                        description: item.description,
                        isCompleted: item.isCompleted,
                        source: item.source,
                        sourceId: item.sourceId,
                        createdAt: item.createdAt,
                        completedAt: item.completedAt,
                        updatedAt: item.updatedAt,
                    });
                } catch (upsertError) {
                    console.log("[Sync] Failed to upsert todo", item.id, upsertError);
                }
            }
        }
    } catch (e) {
        console.log("[Sync] Could not fetch from server, using local data", e);
    }

    return getAllTodosLocally();*/
    
    const response = await apiClient.get<Todo[]>("/todo");
    return response.data;
}

export async function createTodo(title: string, description?: string) {
    const id = Crypto.randomUUID();
    /*const now = new Date().toISOString();
    const payload = { id, title, description: description ?? null };

    insertTodoLocally({
        id,
        userId,
        title,
        description: description ?? null,
        isCompleted: false,
        source: TaskSource.Manual,
        sourceId: null,
        createdAt: now,
        completedAt: null,
        updatedAt: now,
    });
    
    enqueueSyncAction("todo", id, "create", payload);
    processSyncQueue().catch(e => console.log("[Sync] Background sync failed", e));
    return { id };*/
    
    const response = await apiClient.post("/todo", {
        id,
        title,
        description,
    });
    return response.data;
}

export async function updateTodo(id: string, title: string, description?: string) {
    const response = await apiClient.put(`/todo/${id}`, {
        title,
        description,
    });
    return response.data;
}

export async function deleteTodo(id: string) {
    const response = await apiClient.delete(`/todo/${id}`);
    return response.data;
}

export async function completeTodo(id: string) {
    await apiClient.patch(`/todo/${id}/complete`);
}