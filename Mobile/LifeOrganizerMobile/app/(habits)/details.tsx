import { useCallback, useState } from "react";
import { ScrollView, View, Text, useColorScheme, Alert, ActivityIndicator, Pressable, Image } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { HabitCompletionStatus, HabitDetails, HabitFrequency } from "@/types/habit";
import { completeHabit, deleteHabit, getHabitById, uncompleteHabit } from "@/api/habitsApi";
import { formatTimeDisplay, parseTimeSpan } from "@/utils/habitTime";
import { buildLast30Days, calculateStreak } from "@/utils/habitCalendar";
import { formatScheduledDays, FREQUENCY_LABELS } from "@/utils/habitLabels";
import { styles } from "../../src/styles/detailsHabit.styles";
import { HabitWeeklyChart } from "@/components/HabitWeeklyChart";
import { Blob } from "@/components/ui/Blob";
import { BackButton } from "@/components/ui/BackButton";

export default function HabitDetailsScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;

    const [habit, setHabit] = useState<HabitDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const blobColor = isDark ? "#f2f3f7" : "#13161d";
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

    async function loadHabit() {
        try {
            const data = await getHabitById(id);
            setHabit(data);
        } catch (e) {
            Alert.alert("Error", "Could not get habit details");
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
            Alert.alert("Error", "Could not update completion status");
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
                isAutomationEnabled: String(habit.isAutomationEnabled),
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
                            Alert.alert("Error", "Could not delete habit");
                        }
                    },
                },
            ]
        );
    }

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <ActivityIndicator size="large" color="#408bbc" />
            </View>
        );
    }

    if (!habit) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <Text style={{ color: isDark ? "#f5f5f5" : "#030303" }}>Habit not found</Text>
            </View>
        );
    }

    const deadlineDate = parseTimeSpan(habit.completionDeadline);
    const streak = calculateStreak(habit.recentCompletions);
    const last30Days = buildLast30Days(habit.recentCompletions);

    return (
        <View style={[styles.screen, { backgroundColor: screenBackground }]}>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]} numberOfLines={2}>
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
                    { backgroundColor: isCompletedToday ? "#408bbc" : isDark ? "#1E1E1E" : "#f5f5f5" },
                    { borderColor: isCompletedToday ? "#408bbc" : isDark ? "#333" : "#ccc" },
                ]}>
                    <Text style={[styles.completeButtonText, { color: isCompletedToday ? "#f5f5f5" : isDark ? "#ccc" : "#333" },]}>
                        {isCompletedToday ? "✓ Completed today" : "Mark as done today"}
                    </Text>
                </Pressable>

                <Text style={[styles.sectionTitle, { color: isDark ? "#f5f5f5" : "#030303" }]}>
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
                                            ? "#408bbc"
                                            : day.status === HabitCompletionStatus.Missed
                                                ? "#8a3c5c"
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
                                                ? "#f5f5f5"
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
                        <View style={[styles.legendDot, { backgroundColor: "#408bbc" }]} />
                        <Text style={[styles.legendText, { color: isDark ? "#888" : "#999" }]}>Completed</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: "#8a3c5c" }]} />
                        <Text style={[styles.legendText, { color: isDark ? "#888" : "#999" }]}>Missed</Text>
                    </View>
                </View>

                <View style={styles.barChartContainer}>
                    <HabitWeeklyChart completions={habit.recentCompletions} />
                </View>
            </ScrollView>
        </View>
    );
}