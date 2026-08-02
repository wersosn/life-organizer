import { View, Text, useColorScheme, Pressable, RefreshControl, FlatList } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { styles } from "../../src/styles/finances.styles";
import { useCallback, useState } from "react";
import { MonthlySummary, Transaction } from "@/types/transaction";
import { deleteTransaction, getMonthlySummary, getTransactions } from "@/api/transactionsApi";
import { TransactionCard } from "@/components/TransactionCard";

export default function FinancesScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadData() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        try {
            const [transactionsData, summaryData] = await Promise.all([
                getTransactions(),
                getMonthlySummary(year, month),
            ]);
            setTransactions(transactionsData);
            setSummary(summaryData);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    async function handleRefresh() {
        setRefreshing(true);
        await loadData();
    }

    async function handleDelete(id: string) {
        const previous = transactions;
        setTransactions(prev => prev.filter(t => t.id !== id));

        try {
            await deleteTransaction(id);
            loadData();
        } catch (e) {
            console.log(e);
            setTransactions(previous);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    Finances
                </Text>
            </View>
            {summary && (
                <View style={[styles.summaryCard, { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" }]}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: isDark ? "#888" : "#999" }]}>Income</Text>
                            <Text style={[styles.summaryValue, { color: "#4CAF50" }]}>
                                +{summary.totalIncome.toFixed(2)} zł
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: isDark ? "#888" : "#999" }]}>Expenses</Text>
                            <Text style={[styles.summaryValue, { color: "#E53935" }]}>
                                -{summary.totalExpense.toFixed(2)} zł
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: isDark ? "#888" : "#999" }]}>Balance</Text>
                            <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>
                                {summary.balance.toFixed(2)} zł
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {!loading && transactions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No transactions yet. Tap + to add one.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    renderItem={({ item }) => (
                        <TransactionCard transaction={item} onDelete={handleDelete} />
                    )}
                />
            )}
        </View>
    );
}