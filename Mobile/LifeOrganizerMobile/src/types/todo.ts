export type Todo = {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    createdAt: string;
    completedAt?: string;
    source: TaskSource; 
};

export enum TaskSource {
    Manual = 0,
    HabitAutomation = 1,
    FinanceAutomation = 2,
    ChoreAutomation = 3,
}