export type Todo = {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    createdAt: string;
    completedAt?: string;
    isSynced?: boolean;
    serverId?: string; 
};