import { View, Text, StyleSheet, Pressable, useColorScheme, FlatList, RefreshControl, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Habit } from "@/types/habit";
import { completeHabit, deleteHabit, getHabits, uncompleteHabit } from "@/api/habitsApi";
import { HabitCard } from "@/components/HabitCard";
import { isScheduledForToday } from "@/utils/habitSchedule";
import { styles } from "../../src/styles/habits.styles";

type ViewMode = "today" | "all";

export default function HabitsScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("today");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const visibleHabits = useMemo(() => {
        if (viewMode === "all") {
            return habits;
        }
        return habits.filter(isScheduledForToday);
    }, [habits, viewMode]);

    async function loadHabits() {
        try {
            const data = await getHabits();
            setHabits(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadHabits();
        }, [])
    );

    async function handleRefresh() {
        setRefreshing(true);
        await loadHabits();
    }

    async function handleToggleComplete(id: string) {
        const target = habits.find(h => h.id === id);
        if (!target) {
            return;
        }

        const newValue = !target.isCompletedToday;

        setHabits(prev =>
            prev.map(h => (h.id === id ? { ...h, isCompletedToday: newValue } : h))
        );

        try {
            if (newValue) {
                await completeHabit(id);
            } else {
                await uncompleteHabit(id);
            }
        } catch (e) {
            console.log(e);
            setHabits(prev =>
                prev.map(h => (h.id === id ? { ...h, isCompletedToday: !newValue } : h))
            );
        }
    }

    function handlePressHabit(habit: Habit) {
        router.push({
            pathname: "../(habits)/details",
            params: { id: habit.id },
        });
    }

    async function handleEdit(habit: Habit) {
        router.push({
            pathname: "../(habits)/update",
            params: {
                id: habit.id,
                name: habit.name,
                frequency: String(habit.frequency),
                scheduledDays: JSON.stringify(habit.scheduledDays),
                completionDeadline: habit.completionDeadline ?? "",
            },
        });
    }

    async function handleDelete(id: string) {
        const previous = habits;

        Alert.alert(
            "Delete habit",
            `Are you sure you want to delete this habit?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteHabit(id);
                            setHabits(prev => prev.filter(h => h.id !== id));
                        } catch (e) {
                            console.log(e);
                            Alert.alert("Error", "Could not delete habit.");
                            setHabits(previous);
                        }
                    },
                },
            ]
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    Habits
                </Text>
            </View>
            <View style={styles.viewToggle}>
                <Pressable
                    onPress={() => setViewMode("today")}
                    style={[
                        styles.toggleButton,
                        {
                            backgroundColor: viewMode === "today" ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                            borderColor: isDark ? "#333" : "#ccc",
                        },
                    ]}
                >
                    <Text style={{ color: viewMode === "today" ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                        Today
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setViewMode("all")}
                    style={[
                        styles.toggleButton,
                        {
                            backgroundColor: viewMode === "all" ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                            borderColor: isDark ? "#333" : "#ccc",
                        },
                    ]}
                >
                    <Text style={{ color: viewMode === "all" ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                        All
                    </Text>
                </Pressable>
            </View>

            {!loading && habits.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No habits yet. Tap + to create one.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={visibleHabits}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    renderItem={({ item }) => (
                        <HabitCard
                            habit={item}
                            onToggleComplete={handleToggleComplete}
                            onPress={handlePressHabit}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />
            )}
        </View>
    );
}