import { BudgetUsage } from "@/types/budget";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { styles } from "../styles/budgets.styles";

type Props = {
    budget: BudgetUsage;
    onEdit: (budget: BudgetUsage) => void;
    onDelete: (id: string) => void;
};

export function BudgetCard({ budget, onEdit, onDelete }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const barColor = budget.isExceeded ? "#E53935" : "#4F7CFF";
    const clampedPercentage = Math.min(budget.percentageUsed, 100);

    return (
        <View style={[styles.card, { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.categoryName, { color: isDark ? "#fff" : "#000" }]}>
                    {budget.categoryName}
                </Text>
                <View style={styles.actions}>
                    <Pressable onPress={() => onEdit(budget)} hitSlop={10} style={styles.iconButton}>
                        <Image
                            source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPress={() => onDelete(budget.id)} hitSlop={10} style={styles.iconButton}>
                        <Image
                            source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                            style={styles.icon}
                        />
                    </Pressable>
                </View>
            </View>

            <View style={styles.amountsRow}>
                <Text style={[styles.spentText, { color: barColor }]}>
                    {budget.spent.toFixed(2)} zł spent
                </Text>
                <Text style={[styles.limitText, { color: isDark ? "#888" : "#999" }]}>
                    of {budget.monthlyLimit.toFixed(2)} zł
                </Text>
            </View>

            <View style={[styles.barTrack, { backgroundColor: isDark ? "#2A2A2A" : "#EFEFEF" }]}>
                <View style={[styles.barFill, { width: `${clampedPercentage}%`, backgroundColor: barColor }]} />
            </View>

            <Text style={[styles.percentageText, { color: isDark ? "#888" : "#999" }]}>
                {budget.percentageUsed}%{budget.isExceeded ? " — exceeded" : ""}
            </Text>
        </View>
    );
}