import { getTodos } from "@/api/todoApi";
import { processSyncQueue } from "./syncService";
import { upsertFromServer } from "@/database/repositories/todoRepository";

export async function runFullSync(userId: string) {
    await processSyncQueue();
    try {
        const todos = await getTodos();
        await upsertFromServer(userId, todos);
    } catch (e) {
        console.log("[Sync] Failed to pull fresh data:", e);
    }
}