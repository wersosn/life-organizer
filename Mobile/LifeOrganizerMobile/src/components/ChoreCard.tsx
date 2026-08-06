import { Chore } from "@/types/chore";
import { formatFrequency, formatLastCompleted } from "@/utils/choreFormat";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { styles } from "@/styles/ChoreCard.styles";

type Props = {
    chore: Chore;
    onComplete: (id: string) => void;
    onPress: (chore: Chore) => void;
    onEdit: (chore: Chore) => void;
    onDelete: (id: string) => void;
};

export function ChoreCard({ chore, onComplete, onPress, onEdit, onDelete }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <Pressable
            onPress={() => onPress(chore)}
            style={[
                styles.card,
                { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" },
                chore.isOverdue && styles.overdueBorder,
            ]}
        >
            <View style={styles.content}>
                <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: isDark ? "#fff" : "#000" }]} numberOfLines={1}>
                        {chore.name}
                    </Text>
                    {chore.isOverdue && (
                        <View style={styles.overdueBadge}>
                            <Text style={styles.overdueBadgeText}>Overdue</Text>
                        </View>
                    )}
                </View>

                <View style={styles.metaRow}>
                    <View style={[styles.badge, { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }]}>
                        <Text style={[styles.badgeText, { color: isDark ? "#AAA" : "#666" }]}>
                            {chore.categoryName}
                        </Text>
                    </View>
                    <Text style={[styles.subtitle, { color: isDark ? "#888" : "#999" }]}>
                        {formatFrequency(chore.frequencyUnit, chore.frequencyValue)}
                    </Text>
                </View>

                <Text style={[styles.lastCompleted, { color: chore.isOverdue ? "#E53935" : isDark ? "#666" : "#aaa" }]}>
                    {formatLastCompleted(chore.lastCompletedAt)}
                </Text>
            </View>

            <View style={styles.actions}>
                <Pressable onPress={() => onComplete(chore.id)} style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>✓</Text>
                </Pressable>
                <Pressable onPress={() => onEdit(chore)} hitSlop={10} style={styles.iconButton}>
                    <Image
                        source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>
                <Pressable onPress={() => onDelete(chore.id)} hitSlop={10} style={styles.iconButton}>
                    <Image
                        source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>
            </View>
        </Pressable>
    );
}