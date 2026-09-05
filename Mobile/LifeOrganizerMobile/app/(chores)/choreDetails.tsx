import { ChoreDetails } from "@/types/chore";
import { completeChore, deleteChore, getChoreById, uncompleteChore } from "@/api/choresApi";
import React, { useCallback, useState } from "react";
import { Alert, ActivityIndicator, Image, Pressable, ScrollView, Text, useColorScheme, View, Platform } from "react-native";
import { styles } from "../../src/styles/choreDetails.styles";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { formatFrequency, formatLastCompleted } from "@/utils/choreFormat";
import { addChoreToCalendar } from "@/utils/calendar";
import DateTimePickerimport, { DateTimePickerAndroid, } from "@react-native-community/datetimepicker";

export default function ChoreDetailsScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;

    const [chore, setChore] = useState<ChoreDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [showCalendarPicker, setShowCalendarPicker] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadChore() {
        try {
            const data = await getChoreById(id);
            setChore(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadChore();
        }, [id])
    );

    async function handleComplete() {
        try {
            await completeChore(id);
            await loadChore();
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not mark chore as done.");
        }
    }

    async function handleUncompleteLast() {
        try {
            await uncompleteChore(id);
            await loadChore();
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not undo last completion.");
        }
    }

    function handleEdit() {
        if (!chore) return;
        router.push({
            pathname: "../(chores)/updateChore",
            params: {
                id: chore.id,
                name: chore.name,
                description: chore.description ?? "",
                categoryId: chore.categoryId,
                frequencyUnit: String(chore.frequencyUnit),
                frequencyValue: String(chore.frequencyValue),
                isAutomationEnabled: String(chore.isAutomationEnabled),
            },
        });
    }

    function handleDelete() {
        if (!chore) return;
        Alert.alert("Delete chore", `Are you sure you want to delete "${chore.name}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteChore(chore.id);
                        router.back();
                    } catch (e) {
                        console.log(e);
                        Alert.alert("Error", "Could not delete chore.");
                    }
                },
            },
        ]);
    }

    async function handleCalendarDateSelected(event: any, selectedDate?: Date) {
        if (event.type === "dismissed" || !selectedDate || !chore) {
            return;
        }

        try {
            await addChoreToCalendar(chore.name, chore.description ?? undefined, selectedDate);
            Alert.alert("Added", "Reminder added to your calendar.");
        } catch (e: any) {
            console.log(e);
            Alert.alert("Error", e.message ?? "Could not add to calendar.");
        }
    }

    const handleOpenCalendarPicker = () => {
        if (Platform.OS === "android") {
            DateTimePickerAndroid.open({
                value: new Date(),
                mode: "date",
                is24Hour: true,
                onChange: handleCalendarDateSelected,
            });
            return;
        }
        setShowCalendarPicker(true);
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <ActivityIndicator size="large" color="#4F7CFF" />
            </View>
        );
    }

    if (!chore) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <Text style={{ color: isDark ? "#fff" : "#000" }}>Chore not found</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]} numberOfLines={2}>
                    {chore.name}
                </Text>
                <View style={styles.headerActions}>
                    <Pressable onPress={handleOpenCalendarPicker} hitSlop={10} style={styles.iconButton}>
                        <Image
                            source={isDark ? require("@/assets/images/calendar-light.png") : require("@/assets/images/calendar-dark.png")}
                            style={styles.icon}
                        />
                    </Pressable>
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

           {/*} {showCalendarPicker && (
                <DateTimePicker value={calendarDate} mode="datetime" onChange={handleCalendarDateSelected} />
            )}*/}

            {chore.description ? (
                <Text style={[styles.description, { color: isDark ? "#aaa" : "#666" }]}>{chore.description}</Text>
            ) : null}

            <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }]}>
                    <Text style={[styles.badgeText, { color: isDark ? "#AAA" : "#666" }]}>{chore.categoryName}</Text>
                </View>
                <Text style={[styles.badgeSubtext, { color: isDark ? "#888" : "#999" }]}>
                    {formatFrequency(chore.frequencyUnit, chore.frequencyValue)}
                </Text>
            </View>

            <View
                style={[
                    styles.statusCard,
                    { backgroundColor: chore.isOverdue ? "#E5393515" : "#4CAF5015" },
                ]}
            >
                <Text style={[styles.statusText, { color: chore.isOverdue ? "#E53935" : "#4F7CFF" }]}>
                    {chore.isOverdue ? "Overdue" : "Up to date"}
                </Text>
                <Text style={[styles.statusSubtext, { color: isDark ? "#888" : "#999" }]}>
                    {formatLastCompleted(chore.lastCompletedAt)}
                </Text>
            </View>

            <Pressable onPress={handleComplete} style={styles.completeButton}>
                <Text style={styles.completeButtonText}>Mark as done</Text>
            </Pressable>

            {chore.recentCompletions.length > 0 && (
                <Pressable onPress={handleUncompleteLast} style={styles.undoButton}>
                    <Text style={styles.undoButtonText}>Undo last completion</Text>
                </Pressable>
            )}

            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>History</Text>

            {chore.recentCompletions.length === 0 ? (
                <Text style={{ color: isDark ? "#888" : "#999" }}>No completions logged yet.</Text>
            ) : (
                chore.recentCompletions.map(completion => (
                    <View key={completion.id} style={[styles.historyRow, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                        <Text style={[styles.historyDate, { color: isDark ? "#fff" : "#000" }]}>
                            {new Date(completion.completedAt).toLocaleDateString()}
                        </Text>
                        {completion.notes ? (
                            <Text style={[styles.historyNotes, { color: isDark ? "#888" : "#999" }]} numberOfLines={1}>
                                {completion.notes}
                            </Text>
                        ) : null}
                    </View>
                ))
            )}
        </ScrollView>
    );
}