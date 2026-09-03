import { completeTodo, createTodo, deleteTodo, updateTodo } from "@/api/todoApi";
import { getPendingSyncItems, recordSyncFailure, removeSyncItem } from "./syncQueue";
import { SyncQueueItem } from "@/database/types";

const MAX_ATTEMPTS = 5;

export async function processSyncQueue() {
    const items = await getPendingSyncItems();

    for (const item of items) {
        if (item.attempts >= MAX_ATTEMPTS) {
            console.log(`[Sync] Skipping ${item.entityType}:${item.entityId} — max attempts reached`);
            continue;
        }

        try {
            await syncSingleItem(item);
            await removeSyncItem(item.id);
        } catch (e: any) {
            console.log(`[Sync] Failed to sync ${item.entityType}:${item.entityId}`, e);
            await recordSyncFailure(item.id, String(e?.message ?? e));

            if (!e?.response) {
                console.log("[Sync] Network error detected, stopping queue processing");
                break;
            }
        }
    }
}

async function syncSingleItem(item: SyncQueueItem) {
    const payload = item.payload ? JSON.parse(item.payload) : null;

    switch (item.entityType) {
        case "todo":
            return syncTodoItem(item.action, item.entityId, payload);
        default:
            throw new Error(`Unknown entity type: ${item.entityType}`);
    }
}

async function syncTodoItem(action: SyncQueueItem["action"], id: string, payload: any) {
    if (action === "create") {
        await createTodo(payload.title, payload.description);
    } else if (action === "update") {
        await updateTodo(id, payload.title, payload.description);
        if (payload.isCompleted) {
            await completeTodo(id);
        }
    } else if (action === "delete") {
        await deleteTodo(id);
    }
}