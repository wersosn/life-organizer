
import { completeTodo, createTodo, deleteTodo, updateTodo } from "@/api/todoApi";
import { getPendingSyncItems, removeSyncItem } from "./syncQueue";

export async function syncOfflineChanges() {
    const items = await getPendingSyncItems();
    for (const item of items) {
        try {
            const payload = item.payload ? JSON.parse(item.payload) : undefined;
            if (item.entityType === "todo") {
                if (item.action === "create") {
                    await createTodo(
                        payload.title,
                        payload.description,
                        payload.id
                    );
                }
                if (item.action === "update") {
                    await updateTodo(
                        item.entityId,
                        payload.title,
                        payload.description
                    );
                }
                if (item.action === "delete") {
                    await deleteTodo(
                        item.entityId
                    );
                }
                if (item.action === "complete") {
                    await completeTodo(
                        item.entityId
                    );
                }
            }
            await removeSyncItem(item.id);
        } catch (error) {
            console.log("[Sync] Failed:", item.entityType, item.entityId, error);
            break;
        }
    }
}