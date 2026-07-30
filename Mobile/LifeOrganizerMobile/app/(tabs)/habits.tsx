import { View, Text, StyleSheet, Pressable, useColorScheme, FlatList, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Habit } from "@/types/habit";
import { completeHabit, deleteHabit, getHabits, uncompleteHabit } from "@/api/habitsApi";
import { HabitCard } from "@/components/HabitCard";

export default function HabitsScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
        if (!target) return;

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
        setHabits(prev => prev.filter(h => h.id !== id));

        try {
            await deleteHabit(id);
        } catch (e) {
            console.log(e);
            setHabits(previous);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    Habits
                </Text>
            </View>

            {!loading && habits.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No habits yet. Tap + to create one.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={habits}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#4F7CFF",
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "600",
        lineHeight: 24,
    },
    list: {
        paddingBottom: 40,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 15,
    },
});