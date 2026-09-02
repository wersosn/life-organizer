import { TaskSource } from "@/types/todo";
import { db } from "../database";
import * as Crypto from "expo-crypto";

export type LocalTodo = {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    source: TaskSource;
    sourceId: string | null;
    createdAt: string;
    completedAt: string | null;
    updatedAt: string;
};

export function insertTodoLocally(todo: LocalTodo) {
    db.runSync(
        `INSERT INTO todos (id, user_id, title, description, is_completed, source, source_id, created_at, completed_at, updated_at, is_deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [
            todo.id,
            todo.userId,
            todo.title,
            todo.description,
            todo.isCompleted ? 1 : 0,
            todo.source,
            todo.sourceId,
            todo.createdAt,
            todo.completedAt,
            todo.updatedAt,
        ]
    );
}

export function getAllTodosLocally(): LocalTodo[] {
    const rows = db.getAllSync<any>(`SELECT * FROM todos WHERE is_deleted = 0 ORDER BY created_at DESC`);
    return rows.map(mapRowToTodo);
}

export function upsertTodoLocally(todo: LocalTodo) {
    db.runSync(
        `INSERT INTO todos (id, user_id, title, description, is_completed, source, source_id, created_at, completed_at, updated_at, is_deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
         ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            is_completed = excluded.is_completed,
            completed_at = excluded.completed_at,
            updated_at = excluded.updated_at`,
        [
            todo.id, todo.userId, todo.title, todo.description,
            todo.isCompleted ? 1 : 0, todo.source, todo.sourceId,
            todo.createdAt, todo.completedAt, todo.updatedAt,
        ]
    );
}

function mapRowToTodo(row: any): LocalTodo {
    return {
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description,
        isCompleted: row.is_completed === 1,
        source: row.source,
        sourceId: row.source_id,
        createdAt: row.created_at,
        completedAt: row.completed_at,
        updatedAt: row.updated_at,
    };
}