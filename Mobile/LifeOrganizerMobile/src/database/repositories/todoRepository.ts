import { Todo } from "@/types/todo";
import { db } from "../database";
import { enqueueSync } from "@/services/syncQueue";
import * as Crypto from "expo-crypto";

export async function getAllTodos(userId: string): Promise<Todo[]> {
    const rows = await db.getAllAsync<any>(
        "SELECT * FROM todos WHERE user_id = ? AND is_deleted = 0 ORDER BY created_at DESC",
        [userId]
    );
    return rows.map(mapRow);
}

export async function createTodoLocal(userId: string, title: string, description?: string): Promise<Todo> {
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    await db.runAsync(
        `INSERT INTO todos (id, user_id, title, description, is_completed, source, source_id, created_at, updated_at, is_deleted)
         VALUES (?, ?, ?, ?, 0, 0, NULL, ?, ?, 0)`,
        [id, userId, title, description ?? null, now, now]
    );

    await enqueueSync("todo", id, "create", { id, title, description });

    return { id, title, description, isCompleted: false, createdAt: now, source: 0 };
}

export async function updateTodoLocal(id: string, changes: { title?: string; description?: string; isCompleted?: boolean }) {
    const now = new Date().toISOString();

    await db.runAsync(
        `UPDATE todos SET
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            is_completed = COALESCE(?, is_completed),
            completed_at = CASE WHEN ? = 1 THEN ? ELSE completed_at END,
            updated_at = ?
         WHERE id = ?`,
        [
            changes.title ?? null,
            changes.description ?? null,
            changes.isCompleted === undefined ? null : changes.isCompleted ? 1 : 0,
            changes.isCompleted ? 1 : 0,
            changes.isCompleted ? now : null,
            now,
            id,
        ]
    );

    const updated = await db.getFirstAsync<any>("SELECT * FROM todos WHERE id = ?", [id]);
    await enqueueSync("todo", id, "update", {
        title: updated.title,
        description: updated.description,
        isCompleted: !!updated.is_completed,
    });
}

export async function deleteTodoLocal(id: string) {
    await db.runAsync("UPDATE todos SET is_deleted = 1, updated_at = ? WHERE id = ?", [new Date().toISOString(), id]);
    await enqueueSync("todo", id, "delete");
}

export async function upsertFromServer(userId: string, serverTodos: Todo[]) {
    for (const todo of serverTodos) {
        await db.runAsync(
            `INSERT INTO todos (id, user_id, title, description, is_completed, source, source_id, created_at, updated_at, is_deleted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
             ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                description = excluded.description,
                is_completed = excluded.is_completed,
                updated_at = excluded.updated_at`,
            [
                todo.id, userId, todo.title, todo.description ?? null,
                todo.isCompleted ? 1 : 0, todo.source ?? 0, null,
                todo.createdAt, (todo as any).updatedAt ?? todo.createdAt,
            ]
        );
    }
}

function mapRow(row: any): Todo {
    return {
        id: row.id,
        title: row.title,
        description: row.description ?? undefined,
        isCompleted: !!row.is_completed,
        createdAt: row.created_at,
        completedAt: row.completed_at ?? undefined,
        source: row.source,
    };
}