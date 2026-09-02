import * as Crypto from "expo-crypto";
import { apiClient } from "../api/apiClient";
import { db } from "@/database/database";

type SyncAction = "create" | "update" | "delete";
type EntityType = "todo";

type SyncQueueItem = {
    id: string;
    entityType: EntityType;
    entityId: string;
    action: SyncAction;
    payload: string | null;
    attempts: number;
};

export function enqueueSyncAction(entityType: EntityType, entityId: string, action: SyncAction, payload?: object) {
    db.runSync(
        `INSERT INTO sync_queue (id, entity_type, entity_id, action, payload, created_at, attempts)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [Crypto.randomUUID(), entityType, entityId, action, payload ? JSON.stringify(payload) : null, new Date().toISOString()]
    );
}

function getQueuedItems(): SyncQueueItem[] {
    const rows = db.getAllSync<any>(`SELECT * FROM sync_queue ORDER BY created_at ASC`);
    return rows.map(row => ({
        id: row.id,
        entityType: row.entity_type,
        entityId: row.entity_id,
        action: row.action,
        payload: row.payload,
        attempts: row.attempts,
    }));
}

function removeFromQueue(id: string) {
    db.runSync(`DELETE FROM sync_queue WHERE id = ?`, [id]);
}

function markAttemptFailed(id: string, error: string) {
    db.runSync(`UPDATE sync_queue SET attempts = attempts + 1, last_error = ? WHERE id = ?`, [error, id]);
}

async function sendToBackend(item: SyncQueueItem) {
    const payload = item.payload ? JSON.parse(item.payload) : {};

    if (item.entityType === "todo" && item.action === "create") {
        await apiClient.post("/todo", payload);
        return;
    }
    if (item.entityType === "todo" && item.action === "update") {
        await apiClient.put(`/todo/${item.entityId}`, payload);
        return;
    }
    if (item.entityType === "todo" && item.action === "delete") {
        await apiClient.delete(`/todo/${item.entityId}`);
        return;
    }

    throw new Error(`No handler for ${item.entityType}/${item.action}`);
}

let isSyncing = false;
export async function processSyncQueue() {
    if (isSyncing) {
        console.log("[Sync] Already syncing, skipping duplicate call");
        return;
    }

    isSyncing = true;
    try {
        const items = getQueuedItems();

        for (const item of items) {
            try {
                await sendToBackend(item);
                removeFromQueue(item.id);
            } catch (error: any) {
                const isNetworkError = error.code === "ERR_NETWORK" || !error.response;

                if (isNetworkError) {
                    console.log("[Sync] No network, stopping queue processing");
                    return;
                }

                if (error.response?.status === 404 && item.action === "delete") {
                    removeFromQueue(item.id);
                    continue;
                }

                console.log("[Sync] Failed to sync item", item.id, error.message);
                markAttemptFailed(item.id, error.message ?? "Unknown error");
            }
        }
    } finally {
        isSyncing = false;
    }
}