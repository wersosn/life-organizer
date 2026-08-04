import { View, Text, useColorScheme, Pressable } from "react-native";
import { router } from "expo-router";
import { styles } from "../../src/styles/finances.styles";
import React, { useState } from "react";
import { SettingsButton } from "@/components/SettingsButton";
import { BudgetsView } from "@/components/BudgetsView";
import { TransactionsView } from "@/components/TransactionView";

type FinanceView = "transactions" | "budgets";

export default function FinancesScreen() {
    const [view, setView] = useState<FinanceView>("transactions");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    Finances
                </Text>
                <View style={styles.headerActions}>
                    <Pressable onPress={() => router.push("../(finances)/monthlySummary")} style={styles.summaryButton}>
                        <Text style={styles.summaryButtonText}>Monthly Summary</Text>
                    </Pressable>
                    <SettingsButton />
                </View>
            </View>

            <View style={styles.segmentedControl}>
                <Pressable
                    onPress={() => setView("transactions")}
                    style={[
                        styles.segment,
                        {
                            backgroundColor: view === "transactions" ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                            borderColor: isDark ? "#333" : "#ccc",
                        },
                    ]}
                >
                    <Text style={{ color: view === "transactions" ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                        Transactions
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setView("budgets")}
                    style={[
                        styles.segment,
                        {
                            backgroundColor: view === "budgets" ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                            borderColor: isDark ? "#333" : "#ccc",
                        },
                    ]}
                >
                    <Text style={{ color: view === "budgets" ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                        Budgets
                    </Text>
                </Pressable>
            </View>

            {view === "transactions" ? <TransactionsView /> : <BudgetsView />}
        </View>
    );
}