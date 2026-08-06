export enum ChoreFrequency {
    Days = 0,
    Weeks = 1,
    Months = 2,
}

export type ChoreCategory = {
    id: string;
    name: string;
    icon?: string;
};

export type Chore = {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
    categoryName: string;
    frequencyUnit: ChoreFrequency;
    frequencyValue: number;
    lastCompletedAt?: string;
    isAutomationEnabled: boolean;
    isOverdue: boolean;
};

export type ChoreCompletion = {
    id: string;
    completedAt: string;
    notes?: string;
};

export type ChoreDetails = Chore & {
    recentCompletions: ChoreCompletion[];
};