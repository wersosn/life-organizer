import { createHabit } from "@/api/habitsApi";
import { DayOfWeek } from "@/types/days";
import { HabitFrequency } from "@/types/habit";
import { ALL_DAYS, FREQUENCY_OPTIONS } from "@/types/labels";
import { DAY_LABELS, FREQUENCY_LABELS } from "@/utils/habitLabels";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, useColorScheme, Button, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Pressable } from "react-native";

export default function CreateHabitScreen() {
    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.Daily);
    const [scheduledDays, setScheduledDays] = useState<DayOfWeek[]>([]);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    function toggleDay(day: DayOfWeek) {
        setScheduledDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }

    function handleFrequencyChange(value: HabitFrequency) {
        setFrequency(value);
        if (value === HabitFrequency.Daily) {
            setScheduledDays([]);
        }
    }

    async function handleCreate() {
        if (!name.trim()) {
            console.log("Name is required");
            return;
        }

        if (frequency !== HabitFrequency.Daily && scheduledDays.length === 0) {
            setError("Select at least one day");
            return;
        }

        setError(null);

        try {
            await createHabit(name, frequency, scheduledDays);
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to create habit. Please try again.");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: isDark ? "#121212" : "#F5F5F5" },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
                    New habit
                </Text>

                <TextInput
                    placeholder="Name"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>
                    Frequency
                </Text>
                <View style={styles.segmentedControl}>
                    {FREQUENCY_OPTIONS.map(option => {
                        const isSelected = frequency === option;
                        return (
                            <Pressable
                                key={option}
                                onPress={() => handleFrequencyChange(option)}
                                style={[
                                    styles.segment,
                                    {
                                        backgroundColor: isSelected
                                            ? "#4F7CFF"
                                            : isDark ? "#1E1E1E" : "#fff",
                                        borderColor: isDark ? "#333" : "#ccc",
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: isSelected ? "#fff" : isDark ? "#ccc" : "#333",
                                        fontWeight: "600",
                                    }}
                                >
                                    {FREQUENCY_LABELS[option]}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {frequency !== HabitFrequency.Daily && (
                    <>
                        <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>
                            Days
                        </Text>
                        <View style={styles.daysRow}>
                            {ALL_DAYS.map(day => {
                                const isSelected = scheduledDays.includes(day);
                                return (
                                    <Pressable
                                        key={day}
                                        onPress={() => toggleDay(day)}
                                        style={[
                                            styles.dayChip,
                                            {
                                                backgroundColor: isSelected
                                                    ? "#4F7CFF"
                                                    : isDark ? "#1E1E1E" : "#fff",
                                                borderColor: isDark ? "#333" : "#ccc",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color: isSelected ? "#fff" : isDark ? "#ccc" : "#333",
                                                fontSize: 13,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {DAY_LABELS[day]}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.buttonWrapper}>
                    <Button title="Create" onPress={handleCreate} color="#4F7CFF" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    segmentedControl: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20,
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
    },
    daysRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    dayChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    errorText: {
        color: "#E53935",
        fontSize: 13,
        marginBottom: 12,
        textAlign: "center",
    },
    buttonWrapper: {
        marginTop: 8,
    },
});