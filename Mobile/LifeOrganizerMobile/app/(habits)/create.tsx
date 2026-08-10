import { createHabit } from "@/api/habitsApi";
import { DayOfWeek } from "@/types/days";
import { HabitFrequency } from "@/types/habit";
import { ALL_DAYS, FREQUENCY_OPTIONS } from "@/types/labels";
import { DAY_LABELS, FREQUENCY_LABELS } from "@/utils/habitLabels";
import { formatTimeDisplay, formatTimeSpan } from "@/utils/habitTime";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, useColorScheme, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform, Pressable, Switch } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from "../../src/styles/createHabit.styles";

export default function CreateHabitScreen() {
    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.Daily);
    const [scheduledDays, setScheduledDays] = useState<DayOfWeek[]>([]);
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
    const [showTimePicker, setShowTimePicker] = useState(false);
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

    function handleTimeChange(event: any, selectedDate?: Date) {
        setShowTimePicker(Platform.OS === "ios");
        if (selectedDate) {
            setDeadline(selectedDate);
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
            await createHabit(name, frequency, scheduledDays, isAutomationEnabled, deadline ? formatTimeSpan(deadline) : undefined);
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to create habit. Please try again");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>

            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: isDark ? "#121212" : "#F5F5F5" },
                ]}
                keyboardShouldPersistTaps="handled">

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

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>
                    Completion deadline (optional)
                </Text>
                <View style={styles.deadlineRow}>
                    <Pressable
                        onPress={() => setShowTimePicker(true)}
                        style={[
                            styles.deadlineButton,
                            { backgroundColor: isDark ? "#1E1E1E" : "#fff", borderColor: isDark ? "#333" : "#ccc" },
                        ]}
                    >
                        <Text style={{ color: isDark ? "#ccc" : "#333" }}>
                            {deadline ? formatTimeDisplay(deadline) : "No deadline set"}
                        </Text>
                    </Pressable>

                    {deadline && (
                        <Pressable onPress={() => setDeadline(null)} hitSlop={10}>
                            <Text style={styles.clearText}>Clear</Text>
                        </Pressable>
                    )}
                </View>

                {showTimePicker && (
                    <DateTimePicker
                        value={deadline ?? new Date()}
                        mode="time"
                        is24Hour
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleTimeChange}
                    />
                )}

                <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: isDark ? "#ccc" : "#444", marginBottom: 0 }]}>
                        Automation enabled
                    </Text>
                    <Switch value={isAutomationEnabled} onValueChange={setIsAutomationEnabled} />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.buttonWrapper}>
                    <Button title="Create" onPress={handleCreate} color="#4F7CFF" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}