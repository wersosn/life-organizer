import { Habit, HabitFrequency } from "@/types/habit";
import { formatScheduledDays, FREQUENCY_LABELS } from "@/utils/habitLabels";
import { Pressable, useColorScheme, View, Text, StyleSheet } from "react-native";

type Props = {
    habit: Habit;
    onToggleComplete: (id: string) => void;
    onPress: (habit: Habit) => void;
};

export function HabitCard({ habit, onToggleComplete, onPress }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const subtitle =
        habit.frequency === HabitFrequency.Daily
            ? "Every day"
            : formatScheduledDays(habit.scheduledDays);

    return (
        <Pressable
            onPress={() => onPress(habit)}
            style={[
                styles.card,
                { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" },
            ]}
        >
            <Pressable
                onPress={() => onToggleComplete(habit.id)}
                hitSlop={8}
                style={[
                    styles.checkbox,
                    {
                        backgroundColor: habit.isCompletedToday
                            ? "#4F7CFF"
                            : "transparent",
                        borderColor: habit.isCompletedToday
                            ? "#4F7CFF"
                            : isDark
                                ? "#555"
                                : "#CCC",
                    },
                ]}
            >
                {habit.isCompletedToday && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>

            <View style={styles.content}>
                <Text
                    style={[
                        styles.name,
                        { color: isDark ? "#FFFFFF" : "#000000" },
                        habit.isCompletedToday && styles.nameCompleted,
                    ]}
                    numberOfLines={1}
                >
                    {habit.name}
                </Text>

                <View style={styles.metaRow}>
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" },
                        ]}
                    >
                        <Text style={[styles.badgeText, { color: isDark ? "#AAA" : "#666" }]}>
                            {FREQUENCY_LABELS[habit.frequency]}
                        </Text>
                    </View>

                    {subtitle ? (
                        <Text style={[styles.subtitle, { color: isDark ? "#888" : "#999" }]}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        gap: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    checkmark: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
    content: {
        flex: 1,
        gap: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
    nameCompleted: {
        opacity: 0.5,
        textDecorationLine: "line-through",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "600",
    },
    subtitle: {
        fontSize: 12,
    },
});