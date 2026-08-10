import { TaskSource, Todo } from "@/types/todo";
import { Pressable, View, Text, useColorScheme, Image } from "react-native";
import { styles } from "../styles/TodoCard.styles";

type Props = {
    todo: Todo;
    onComplete: (id: string) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
    onEdit: (todo: Todo) => void;
};

function getAutomationLabel(source: TaskSource): string | null {
    switch (source) {
        case TaskSource.HabitAutomation:
            return "Missed habit";
        case TaskSource.ChoreAutomation:
            return "Overdue chore";
        case TaskSource.FinanceAutomation:
            return "Overdue payment";
        default:
            return null;
    }
}

export default function TodoCard({ todo, onComplete, onDelete, onEdit, }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const automationLabel = getAutomationLabel(todo.source);

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: isDark
                        ? "#1E1E1E"
                        : "#FFFFFF",
                },
            ]}
        >
            <Pressable
                onPress={() => onComplete(todo.id)}
                testID="complete-button"
                style={[
                    styles.checkbox,
                    todo.isCompleted && styles.checked,
                ]}
            >
                {todo.isCompleted && (
                    <Text style={styles.checkmark}>
                        ✓
                    </Text>
                )}
            </Pressable>
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: isDark
                                    ? "#FFFFFF"
                                    : "#000000",
                            },
                            todo.isCompleted &&
                            styles.completedText,
                        ]}
                    >
                        {todo.title}
                    </Text>

                    {automationLabel && (
                        <View style={styles.automationBadge} testID="automation-badge">
                            <Text style={styles.automationBadgeText}>{automationLabel}</Text>
                        </View>
                    )}
                </View>
                {
                    todo.description &&
                    <Text
                        style={[
                            styles.description,
                            {
                                color: isDark
                                    ? "#AAAAAA"
                                    : "#777777",
                            },
                        ]}
                    >
                        {todo.description}
                    </Text>
                }
            </View>

            <View style={styles.actions}>
                <Pressable onPress={() => onEdit(todo)} hitSlop={10} style={styles.iconButton} testID="edit-button">
                    <Image
                        source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>

                <Pressable onPress={() => onDelete(todo.id)} hitSlop={10} style={styles.iconButton} testID="delete-button">
                    <Image
                        source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>
            </View>
        </View>
    );
}