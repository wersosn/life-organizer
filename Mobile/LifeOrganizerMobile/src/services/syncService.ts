import { apiClient } from "@/api/apiClient";
import { getUnsyncedRows, hardDeleteIfTombstoned, markSynced } from "@/database/repositories/todoRepository";

export async function syncTodos() {
    const rows = await getUnsyncedRows();

    for (const row of rows) {
        try {
            if (row.is_deleted) {
                if (row.server_id) {
                    await apiClient.delete(`/todos/${row.server_id}`);
                }
                await hardDeleteIfTombstoned(row.id);
                continue;
            }

            let serverId = row.server_id;
            if (!serverId) {
                const res = await apiClient.post("/todos", {
                    title: row.title,
                    description: row.description ?? null,
                });
                serverId = res.data;
            } else {
                await apiClient.put(`/todos/${serverId}`, {
                    title: row.title,
                    description: row.description ?? null,
                });
            }

            if (row.is_completed) {
                await apiClient.patch(`/todos/${serverId}/complete`);
            }

            await markSynced(row.id, serverId!);
        } catch (error) {
            console.log("Sync error for", row.id, error);
        }
    }
}