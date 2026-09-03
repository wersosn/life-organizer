import { db } from "@/database/database";
import * as Crypto from "expo-crypto";

export type SyncAction = "create" | "update" | "delete" | "complete" | "uncomplete";

export type SyncQueueItem = {
    id: string;
    entityType: string;
    entityId: string;
    action: SyncAction;
    payload: string | null;
};

export async function addToSyncQueue(
    entityType: string,
    entityId: string,
    action: SyncAction,
    payload?: object
) {
    await db.runAsync(
        `
        INSERT INTO sync_queue (
            id,
            entity_type,
            entity_id,
            action,
            payload,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            Crypto.randomUUID(),
            entityType,
            entityId,
            action,
            payload ? JSON.stringify(payload) : null,
            new Date().toISOString(),
        ]
    );
}

export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
    return await db.getAllAsync<SyncQueueItem>(
        `
        SELECT *
        FROM sync_queue
        ORDER BY created_at ASC
        `
    );
}

export async function removeSyncItem(id: string) {
    await db.runAsync(
        `
        DELETE FROM sync_queue
        WHERE id = ?
        `,
        [id]
    );
}