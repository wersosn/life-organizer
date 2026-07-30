import { useCallback, useState } from "react";
import { ScrollView, View, Text, useColorScheme, Alert, ActivityIndicator, Pressable, Image } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { HabitCompletionStatus, HabitDetails, HabitFrequency } from "@/types/habit";
import { completeHabit, deleteHabit, getHabitById, uncompleteHabit } from "@/api/habitsApi";
import { formatTimeDisplay, parseTimeSpan } from "@/utils/habitTime";
import { buildLast30Days, calculateStreak } from "@/utils/habitCalendar";
import { formatScheduledDays, FREQUENCY_LABELS } from "@/utils/habitLabels";
import { styles } from "../../src/styles/detailsHabit.styles";

export default function HabitDetailsScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;

    const [habit, setHabit] = useState<HabitDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadHabit() {
        try {
            const data = await getHabitById(id);
            setHabit(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadHabit();
        }, [id])
    );

    const today = new Date().toISOString().split("T")[0];
    const isCompletedToday = habit?.recentCompletions.some(
        c => c.date === today && c.status === HabitCompletionStatus.Completed
    );

    async function handleToggleToday() {
        if (!habit) return;
        try {
            if (isCompletedToday) {
                await uncompleteHabit(habit.id);
            } else {
                await completeHabit(habit.id);
            }
            await loadHabit();
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not update completion status.");
        }
    }

    function handleEdit() {
        if (!habit) return;
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

    function handleDelete() {
        if (!habit) return;
        Alert.alert(
            "Delete habit",
            `Are you sure you want to delete "${habit.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteHabit(habit.id);
                            router.back();
                        } catch (e) {
                            console.log(e);
                            Alert.alert("Error", "Could not delete habit.");
                        }
                    },
                },
            ]
        );
    }

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <ActivityIndicator size="large" color="#4F7CFF" />
            </View>
        );
    }

    if (!habit) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <Text style={{ color: isDark ? "#fff" : "#000" }}>Habit not found</Text>
            </View>
        );
    }

    const deadlineDate = parseTimeSpan(habit.completionDeadline);
    const streak = calculateStreak(habit.recentCompletions);
    const last30Days = buildLast30Days(habit.recentCompletions);

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]} numberOfLines={2}>
                    {habit.name}
                </Text>
                <View style={styles.headerActions}>
                    <Pressable onPress={handleEdit} hitSlop={10} style={styles.iconButton}>
                        <Image
                            source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPress={handleDelete} hitSlop={10} style={styles.iconButton}>
                        <Image
                            source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                            style={styles.icon}
                        />
                    </Pressable>
                </View>
            </View>

            <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }]}>
                    <Text style={[styles.badgeText, { color: isDark ? "#AAA" : "#666" }]}>
                        {FREQUENCY_LABELS[habit.frequency]}
                    </Text>
                </View>
                {habit.frequency !== HabitFrequency.Daily && habit.scheduledDays.length > 0 && (
                    <Text style={[styles.badgeSubtext, { color: isDark ? "#888" : "#999" }]}>
                        {formatScheduledDays(habit.scheduledDays)}
                    </Text>
                )}
            </View>

            {deadlineDate && (
                <Text style={[styles.deadlineText, { color: isDark ? "#888" : "#999" }]}>
                    Deadline: {formatTimeDisplay(deadlineDate)}
                </Text>
            )}

            <View style={styles.streakCard}>
                <Text style={styles.streakNumber}>{streak}</Text>
                <Text style={styles.streakLabel}>day{streak === 1 ? "" : "s"} streak</Text>
            </View>

            <Pressable onPress={handleToggleToday} style={[
                    styles.completeButton,
                    { backgroundColor: isCompletedToday ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff" },
                    { borderColor: isCompletedToday ? "#4F7CFF" : isDark ? "#333" : "#ccc" },
                ]}>
                <Text style={[styles.completeButtonText, { color: isCompletedToday ? "#fff" : isDark ? "#ccc" : "#333" },]}>
                    {isCompletedToday ? "✓ Completed today" : "Mark as done today"}
                </Text>
            </Pressable>

            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>
                Last 30 days
            </Text>

            <View style={styles.grid}>
                {last30Days.map(day => (
                    <View
                        key={day.date}
                        style={[
                            styles.dayCell,
                            {
                                backgroundColor:
                                    day.status === HabitCompletionStatus.Completed
                                        ? "#4F7CFF"
                                        : day.status === HabitCompletionStatus.Missed
                                            ? "#E5393555"
                                            : isDark
                                                ? "#1E1E1E"
                                                : "#EFEFEF",
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.dayCellText,
                                {
                                    color:
                                        day.status === HabitCompletionStatus.Completed
                                            ? "#fff"
                                            : isDark
                                                ? "#888"
                                                : "#999",
                                },
                            ]}
                        >
                            {day.dayOfMonth}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#4F7CFF" }]} />
                    <Text style={[styles.legendText, { color: isDark ? "#888" : "#999" }]}>Completed</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#E5393555" }]} />
                    <Text style={[styles.legendText, { color: isDark ? "#888" : "#999" }]}>Missed</Text>
                </View>
            </View>
        </ScrollView>
    );
}