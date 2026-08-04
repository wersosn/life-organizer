import { Habit, HabitFrequency } from "@/types/habit";
import { formatScheduledDays, FREQUENCY_LABELS } from "@/utils/habitLabels";
import { Pressable, useColorScheme, View, Text, Image } from "react-native";
import { styles } from "../styles/HabitCard.styles";

type Props = {
    habit: Habit;
    onToggleComplete: (id: string) => void;
    onPress: (habit: Habit) => void;
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
};

export function HabitCard({ habit, onToggleComplete, onPress, onEdit, onDelete }: Props) {
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
                testID="toggle-complete-button"
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
            <View style={styles.actions}>
                <Pressable onPress={() => onEdit(habit)} hitSlop={10} style={styles.iconButton} testID="edit-button">
                    <Image
                        source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>

                <Pressable onPress={() => onDelete(habit.id)} hitSlop={10} style={styles.iconButton} testID="delete-button">
                    <Image
                        source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>
            </View>
        </Pressable>
    );
}