import { deleteBudget, getBudgetsWithUsage } from "@/api/budgetsApi";
import { BudgetUsage } from "@/types/budget";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, useColorScheme, View } from "react-native";
import { BudgetCard } from "./BudgetCard";
import { styles } from "../styles/budgets.styles";

export function BudgetsView() {
    const [budgets, setBudgets] = useState<BudgetUsage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadData() {
        const now = new Date();
        try {
            const data = await getBudgetsWithUsage(now.getFullYear(), now.getMonth() + 1);
            setBudgets(data);
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

    function handleEdit(budget: BudgetUsage) {
        router.push({
            pathname: "../(finances)/updateBudget",
            params: {
                id: budget.id,
                categoryName: budget.categoryName,
                monthlyLimit: String(budget.monthlyLimit),
            },
        });
    }

    async function handleDelete(id: string) {
        const previous = budgets;

        Alert.alert(
            "Delete budget",
            "Are you sure you want to delete this budget?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteBudget(id);
                            setBudgets(prev => prev.filter(b => b.id !== id));
                        } catch (e) {
                            console.log(e);
                            Alert.alert("Error", "Could not delete budget.");
                            setBudgets(previous);
                        }
                    },
                },
            ]
        );
    }

    return (
        <>
            {!loading && budgets.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No budgets yet. Tap + to set one up.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={budgets}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    renderItem={({ item }) => (
                        <BudgetCard budget={item} onEdit={handleEdit} onDelete={handleDelete} />
                    )}
                />
            )}
        </>
    );
}