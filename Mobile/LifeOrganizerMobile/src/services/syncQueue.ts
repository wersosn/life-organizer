import * as Crypto from "expo-crypto";
import { apiClient } from "../api/apiClient";
import { db } from "@/database/database";
import { EntityType, SyncAction, SyncQueueItem } from "@/database/types";

export async function enqueueSync(entityType: EntityType, entityId: string, action: SyncAction, payload?: object) {
    await db.runAsync(
        `INSERT INTO sync_queue (id, entity_type, entity_id, action, payload, created_at, attempts)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
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
    const rows = await db.getAllAsync<any>("SELECT * FROM sync_queue ORDER BY created_at ASC");
    return rows.map(r => ({
        id: r.id,
        entityType: r.entity_type,
        entityId: r.entity_id,
        action: r.action,
        payload: r.payload,
        createdAt: r.created_at,
        attempts: r.attempts,
        lastError: r.last_error,
    }));
}

export async function removeSyncItem(id: string) {
    await db.runAsync("DELETE FROM sync_queue WHERE id = ?", [id]);
}

export async function recordSyncFailure(id: string, error: string) {
    await db.runAsync(
        "UPDATE sync_queue SET attempts = attempts + 1, last_error = ? WHERE id = ?",
        [error, id]
    );
}