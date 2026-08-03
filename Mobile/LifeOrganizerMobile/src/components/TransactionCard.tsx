import { styles } from "@/styles/TransactionCard.styles";
import { Transaction, TransactionType } from "@/types/transaction";
import { formatAmount, formatDateDisplay } from "@/utils/transactionFormat";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";

type Props = {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
};

export function TransactionCard({ transaction, onEdit, onDelete }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const isExpense = transaction.type === TransactionType.Expense;

    return (
        <View style={[styles.card, { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" }]}>
            <View style={styles.content}>
                <Text style={[styles.category, { color: isDark ? "#FFFFFF" : "#000000" }]} numberOfLines={1}>
                    {transaction.categoryName}
                </Text>
                {transaction.description ? (
                    <Text style={[styles.description, { color: isDark ? "#888" : "#999" }]} numberOfLines={1}>
                        {transaction.description}
                    </Text>
                ) : null}
                <Text style={[styles.date, { color: isDark ? "#666" : "#aaa" }]}>
                    {formatDateDisplay(transaction.date)}
                </Text>
            </View>

            <Text style={[styles.amount, { color: isExpense ? "#E53935" : "#4CAF50" }]}>
                {formatAmount(transaction.amount, transaction.type)}
            </Text>

            <Pressable onPress={() => onEdit(transaction)} hitSlop={10} style={styles.iconButton}>
                <Image
                    source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                    style={styles.icon}
                />
            </Pressable>

            <Pressable onPress={() => onDelete(transaction.id)} hitSlop={10} style={styles.iconButton}>
                <Image
                    source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                    style={styles.icon}
                />
            </Pressable>
        </View>
    );
}