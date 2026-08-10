import { Habit, HabitDetails, HabitFrequency } from "@/types/habit";
import { apiClient } from "./apiClient";
import { DayOfWeek } from "@/types/days";

export async function getHabits() {
    const response = await apiClient.get<Habit[]>("/habits");
    return response.data;
}

export async function getHabitById(id: string) {
    const response = await apiClient.get<HabitDetails>(`/habits/${id}`);
    return response.data;
}

export async function createHabit(name: string, frequency: HabitFrequency, scheduledDays: DayOfWeek[], isAutomationEnabled: boolean, completionDeadline?: string) {
    const response = await apiClient.post("/habits", {
        name,
        frequency,
        scheduledDays,
        isAutomationEnabled,
        completionDeadline,
    });
    return response.data;
}

export async function updateHabit(id: string, name: string, frequency: HabitFrequency, scheduledDays: DayOfWeek[], isAutomationEnabled: boolean, completionDeadline?: string) {
    const response = await apiClient.put(`/habits/${id}`, {
        name,
        frequency,
        scheduledDays,
        isAutomationEnabled,
        completionDeadline,
    });
    return response.data;
}

export async function deleteHabit(id: string) {
    const response = await apiClient.delete(`/habits/${id}`);
    return response.data;
}

export async function completeHabit(id: string, date?: string) {
    await apiClient.patch(`/habits/${id}/complete`, null, {
        params: date ? { date } : undefined,
    });
}

export async function uncompleteHabit(id: string, date?: string) {
    await apiClient.patch(`/habits/${id}/uncomplete`, null, {
        params: date ? { date } : undefined,
    });
}