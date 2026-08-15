import { getMonthlySummary } from "@/api/transactionsApi";
import { MonthlySummary } from "@/types/transaction";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, useColorScheme, Text, View } from "react-native";
import { styles } from "@/styles/monthlySummary.styles";
import { ExpenseBreakdownChart } from "@/components/ExpenseBreakdownChart";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export default function MonthlySummaryScreen() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadSummary() {
        setLoading(true);
        try {
            const data = await getMonthlySummary(year, month);
            setSummary(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadSummary();
        }, [year, month])
    );

    function goToPreviousMonth() {
        if (month === 1) {
            setMonth(12);
            setYear(y => y - 1);
        } else {
            setMonth(m => m - 1);
        }
    }

    function goToNextMonth() {
        if (month === 12) {
            setMonth(1);
            setYear(y => y + 1);
        } else {
            setMonth(m => m + 1);
        }
    }

    const maxCategoryTotal = summary
        ? Math.max(...summary.expensesByCategory.map(c => c.total), 1)
        : 1;

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}
        >
            <View style={styles.monthSelector}>
                <Pressable onPress={goToPreviousMonth} hitSlop={10}>
                    <Text style={[styles.arrow, { color: isDark ? "#fff" : "#000" }]}>‹</Text>
                </Pressable>
                <Text style={[styles.monthLabel, { color: isDark ? "#fff" : "#000" }]}>
                    {MONTH_NAMES[month - 1]} {year}
                </Text>
                <Pressable onPress={goToNextMonth} hitSlop={10}>
                    <Text style={[styles.arrow, { color: isDark ? "#fff" : "#000" }]}>›</Text>
                </Pressable>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4F7CFF" style={{ marginTop: 40 }} />
            ) : !summary ? (
                <Text style={{ color: isDark ? "#888" : "#999", textAlign: "center", marginTop: 40 }}>
                    No data available
                </Text>
            ) : (
                <>
                    <View style={[styles.totalsCard, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                        <View style={styles.totalsRow}>
                            <View style={styles.totalsItem}>
                                <Text style={[styles.totalsLabel, { color: isDark ? "#888" : "#999" }]}>Income</Text>
                                <Text style={[styles.totalsValue, { color: "#4F7CFF" }]}>
                                    +{summary.totalIncome.toFixed(2)} zł
                                </Text>
                            </View>
                            <View style={styles.totalsItem}>
                                <Text style={[styles.totalsLabel, { color: isDark ? "#888" : "#999" }]}>Expenses</Text>
                                <Text style={[styles.totalsValue, { color: "#E53935" }]}>
                                    -{summary.totalExpense.toFixed(2)} zł
                                </Text>
                            </View>
                        </View>
                        <View style={styles.balanceDivider} />
                        <View style={styles.balanceRow}>
                            <Text style={[styles.balanceLabel, { color: isDark ? "#ccc" : "#444" }]}>Balance</Text>
                            <Text
                                style={[
                                    styles.balanceValue,
                                    { color: summary.balance >= 0 ? "#4F7CFF" : "#E53935" },
                                ]}
                            >
                                {summary.balance.toFixed(2)} zł
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>
                        Expenses by category
                    </Text>

                    <ExpenseBreakdownChart breakdown={summary.expensesByCategory} />

                    {summary.expensesByCategory.length === 0 ? (
                        <Text style={{ color: isDark ? "#888" : "#999" }}>No expenses this month.</Text>
                    ) : (
                        summary.expensesByCategory.map(category => {
                            const percentage = (category.total / maxCategoryTotal) * 100;
                            return (
                                <View key={category.categoryId} style={styles.categoryRow}>
                                    <View style={styles.categoryHeader}>
                                        <Text style={[styles.categoryName, { color: isDark ? "#fff" : "#000" }]}>
                                            {category.categoryName}
                                        </Text>
                                        <Text style={[styles.categoryAmount, { color: isDark ? "#ccc" : "#444" }]}>
                                            {category.total.toFixed(2)} zł
                                        </Text>
                                    </View>
                                    <View style={[styles.barTrack, { backgroundColor: isDark ? "#2A2A2A" : "#EFEFEF" }]}>
                                        <View style={[styles.barFill, { width: `${percentage}%` }]} />
                                    </View>
                                </View>
                            );
                        })
                    )}
                </>
            )}
        </ScrollView>
    );
}