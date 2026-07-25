import { Todo } from "@/types/todo";
import { db } from "../database";
import * as Crypto from "expo-crypto";

type TodoRow = {
    id: string;
    server_id: string | null;
    title: string;
    description: string | null;
    is_completed: number;
    created_at: string;
    completed_at: string | null;
    updated_at: number;
    is_deleted: number;
    is_synced: number;
};

function mapRow(row: TodoRow): Todo {
    return {
        id: row.id,
        title: row.title,
        description: row.description ?? undefined,
        isCompleted: !!row.is_completed,
        createdAt: row.created_at,
        completedAt: row.completed_at ?? undefined,
        isSynced: !!row.is_synced,
    };
}

export async function getAllTodos(): Promise<Todo[]> {
    const rows = await db.getAllAsync<TodoRow>(
        "SELECT * FROM todos WHERE is_deleted = 0 ORDER BY created_at DESC"
    );
    console.log("[DB] SELECT all todos, count =", rows.length, rows);
    return rows.map(mapRow);
}

export async function createTodoLocal(title: string, description?: string): Promise<Todo> {
    const id = Crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const updatedAt = Date.now();

    console.log("[DB] INSERT todo:", { id, title, description });

    await db.runAsync(
        `INSERT INTO todos (id, server_id, title, description, is_completed, created_at, completed_at, updated_at, is_deleted, is_synced)
     VALUES (?, NULL, ?, ?, 0, ?, NULL, ?, 0, 0)`,
        [id, title, description ?? null, createdAt, updatedAt]
    );
    
    console.log("[DB] INSERT OK, id =", id);
    return { id, title, description, isCompleted: false, createdAt, isSynced: false };
}

export async function updateTodoLocal(id: string, changes: Partial<Pick<Todo, "title" | "description" | "isCompleted">>) {
    const updatedAt = Date.now();
    const completedAt = changes.isCompleted ? new Date().toISOString() : null;

    await db.runAsync(
        `UPDATE todos 
         SET
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            is_completed = COALESCE(?, is_completed),
            completed_at = CASE WHEN ? IS NOT NULL THEN ? ELSE completed_at END,
            updated_at = ?,
            is_synced = 0
        WHERE id = ?`,
        [
            changes.title ?? null,
            changes.description ?? null,
            changes.isCompleted === undefined ? null : changes.isCompleted ? 1 : 0,
            changes.isCompleted === undefined ? null : 1,
            completedAt,
            updatedAt,
            id,
        ]
    );
}

export async function deleteTodoLocal(id: string) {
    await db.runAsync(
        "UPDATE todos SET is_deleted = 1, is_synced = 0, updated_at = ? WHERE id = ?",
        [Date.now(), id]
    );
}

export async function getUnsyncedRows(): Promise<TodoRow[]> {
    return db.getAllAsync<TodoRow>("SELECT * FROM todos WHERE is_synced = 0");
}

export async function markSynced(id: string, serverId: string) {
    await db.runAsync("UPDATE todos SET server_id = ?, is_synced = 1 WHERE id = ?", [serverId, id]);
}

export async function hardDeleteIfTombstoned(id: string) {
    await db.runAsync("DELETE FROM todos WHERE id = ? AND is_deleted = 1", [id]);
}