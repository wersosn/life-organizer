import { TaskSource, Todo } from "@/types/todo";
import { db } from "../database";
import * as Crypto from "expo-crypto";

export type LocalTodo = Todo & {
    userId: string;
    updatedAt: string;
};

function mapTodo(row: any): LocalTodo {
    return {
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description ?? undefined,
        isCompleted: row.is_completed === 1,
        createdAt: row.created_at,
        completedAt: row.completed_at ?? undefined,
        source: row.source as TaskSource,
        updatedAt: row.updated_at,
    };
}

export async function getCachedTodos(
    userId: string
): Promise<LocalTodo[]> {
    const rows = await db.getAllAsync<any>(
        `
        SELECT *
        FROM todos
        WHERE user_id = ?
          AND is_deleted = 0
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return rows.map(mapTodo);
}

export async function saveTodoToCache(
    todo: LocalTodo
): Promise<void> {
    await db.runAsync(
        `
        INSERT OR REPLACE INTO todos (
            id,
            user_id,
            title,
            description,
            is_completed,
            source,
            created_at,
            completed_at,
            updated_at,
            is_deleted
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `,
        [
            todo.id,
            todo.userId,
            todo.title,
            todo.description ?? null,
            todo.isCompleted ? 1 : 0,
            todo.source,
            todo.createdAt,
            todo.completedAt ?? null,
            todo.updatedAt,
        ]
    );
}

export async function cacheTodos(
    todos: Todo[],
    userId: string
): Promise<void> {
    for (const todo of todos) {
        await saveTodoToCache({
            ...todo,
            userId,
            updatedAt: todo.createdAt,
        });
    }
}

export async function createCachedTodo(
    userId: string,
    title: string,
    description?: string
): Promise<LocalTodo> {
    const now = new Date().toISOString();

    const todo: LocalTodo = {
        id: Crypto.randomUUID(),
        userId,
        title,
        description,
        isCompleted: false,
        createdAt: now,
        completedAt: undefined,
        source: TaskSource.Manual,
        updatedAt: now,
    };

    await saveTodoToCache(todo);

    return todo;
}

export async function updateCachedTodo(
    id: string,
    title: string,
    description?: string
): Promise<void> {
    await db.runAsync(
        `
        UPDATE todos
        SET title = ?,
            description = ?,
            updated_at = ?
        WHERE id = ?
        `,
        [
            title,
            description ?? null,
            new Date().toISOString(),
            id,
        ]
    );
}

export async function completeCachedTodo(
    id: string,
    completed: boolean
): Promise<void> {
    await db.runAsync(
        `
        UPDATE todos
        SET is_completed = ?,
            completed_at = ?,
            updated_at = ?
        WHERE id = ?
        `,
        [
            completed ? 1 : 0,
            completed ? new Date().toISOString() : null,
            new Date().toISOString(),
            id,
        ]
    );
}

export async function deleteCachedTodo(
    id: string
): Promise<void> {
    await db.runAsync(
        `
        UPDATE todos
        SET is_deleted = 1,
            updated_at = ?
        WHERE id = ?
        `,
        [new Date().toISOString(), id]
    );
}