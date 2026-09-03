export type SyncAction = "create" | "update" | "delete";
export type EntityType = "todo" | "habit" | "habitCompletion" | "chore" | "choreCompletion" | "transaction" | "budget" | "transactionCategory" | "choreCategory";

export type SyncQueueItem = {
    id: string;
    entityType: EntityType;
    entityId: string;
    action: SyncAction;
    payload: string | null;
    createdAt: string;
    attempts: number;
    lastError: string | null;
};