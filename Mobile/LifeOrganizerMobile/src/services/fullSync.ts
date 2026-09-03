import { getTodos } from "@/api/todoApi";
import { processSyncQueue } from "./syncService";
import { upsertFromServer } from "@/database/repositories/todoRepository";
import { Alert } from "react-native/Libraries/Alert/Alert";

export async function runFullSync(userId: string) {
    Alert.alert("[Sync] Start", "Synchronization started successfully.");
    await processSyncQueue();
    /*try {
        const todos = await getTodos();
        await upsertFromServer(userId, todos);
    } catch (e) {
        console.log("[Sync] Failed to pull fresh data:", e);
    }*/
    const todos = await getTodos();
    Alert.alert("[Sync] Pulled todos:", todos.length + " items");
    await upsertFromServer(userId, todos);
    Alert.alert("[Sync] Completed", "Synchronization completed successfully.");
}