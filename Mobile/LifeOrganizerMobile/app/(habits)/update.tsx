import { updateHabit } from "@/api/habitsApi";
import { DayOfWeek } from "@/types/days";
import { HabitFrequency } from "@/types/habit";
import { ALL_DAYS, FREQUENCY_OPTIONS } from "@/types/labels";
import { DAY_LABELS, FREQUENCY_LABELS } from "@/utils/habitLabels";
import { formatTimeDisplay, formatTimeSpan, parseTimeSpan } from "@/utils/habitTime";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, useColorScheme, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform, Pressable, Switch } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from "../../src/styles/updateHabit.styles";
import { Blob } from "@/components/ui/Blob";
import { BackButton } from "@/components/ui/BackButton";

export default function UpdateHabitScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;

    const [name, setName] = useState(params.name as string);
    const [frequency, setFrequency] = useState<HabitFrequency>(Number(params.frequency) as HabitFrequency);
    const [scheduledDays, setScheduledDays] = useState<DayOfWeek[]>(params.scheduledDays ? JSON.parse(params.scheduledDays as string) : []);
    const [deadline, setDeadline] = useState<Date | null>(parseTimeSpan(params.completionDeadline as string));
    const [isAutomationEnabled, setIsAutomationEnabled] = useState(params.isAutomationEnabled === "true");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const blobColor = isDark ? "#f2f3f7" : "#13161d";
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

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

    async function handleUpdate() {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        if (frequency !== HabitFrequency.Daily && scheduledDays.length === 0) {
            setError("Select at least one day");
            return;
        }

        setError(null);

        try {
            await updateHabit(
                id,
                name,
                frequency,
                scheduledDays,
                isAutomationEnabled,
                deadline ? formatTimeSpan(deadline) : undefined
            );
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to update habit. Please try again");
        }
    }

    return (
        <View style={[styles.screen, { backgroundColor: screenBackground }]}>
            <Blob variant="top5" color={blobColor} width={430} style={styles.blobTop} />
            <Blob variant="drip3" color={blobColor} width={430} style={styles.blobBottom} />
            <BackButton />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>Update habit</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="#888"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>

                    <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Frequency</Text>
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
                                            backgroundColor: isSelected ? "#408bbc" : isDark ? "#1E1E1E" : "#f5f5f5",
                                            borderColor: isDark ? "#333" : "#ccc",
                                        },
                                    ]}
                                >
                                    <Text style={{ color: isSelected ? "#f5f5f5" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                                        {FREQUENCY_LABELS[option]}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {frequency !== HabitFrequency.Daily && (
                        <>
                            <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Days</Text>
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
                                                    backgroundColor: isSelected ? "#408bbc" : isDark ? "#1E1E1E" : "#f5f5f5",
                                                    borderColor: isDark ? "#333" : "#ccc",
                                                },
                                            ]}
                                        >
                                            <Text style={{ color: isSelected ? "#f5f5f5" : isDark ? "#ccc" : "#333", fontSize: 13, fontWeight: "600" }}>
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
                                { backgroundColor: isDark ? "#1E1E1E" : "#f5f5f5", borderColor: isDark ? "#333" : "#ccc" },
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
                        <Switch value={isAutomationEnabled} onValueChange={setIsAutomationEnabled} trackColor={{ false: "#30678b", true: "#408bbc" }} thumbColor="#bfd8e9" />
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={handleUpdate}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}