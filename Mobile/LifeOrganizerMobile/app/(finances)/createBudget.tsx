import { getCategories } from "@/api/transactionCategoriesApi";
import { TransactionCategory, TransactionType } from "@/types/transaction";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "@/styles/budgets.styles";
import { createBudget } from "@/api/budgetsApi";
import { router } from "expo-router";

export default function CreateBudgetScreen() {
    const [amount, setAmount] = useState("");
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await getCategories();
            setCategories(data.filter(c => c.type === TransactionType.Expense));
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingCategories(false);
        }
    }

    async function handleCreate() {
        const parsedAmount = parseFloat(amount.replace(",", "."));

        if (!categoryId) {
            setError("Select a category");
            return;
        }
        if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a valid amount");
            return;
        }

        setError(null);

        try {
            await createBudget(categoryId, parsedAmount);
            router.back();
        } catch (e: any) {
            console.log(e);
            if (e?.response?.status === 400) {
                setError("A budget for this category already exists.");
            } else {
                setError("Failed to create budget. Please try again.");
            }
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>New budget</Text>

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Category</Text>

                {loadingCategories ? (
                    <ActivityIndicator style={{ marginBottom: 20 }} />
                ) : categories.length === 0 ? (
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No expense categories yet. Create one first.
                    </Text>
                ) : (
                    <View style={styles.categoryRow}>
                        {categories.map(category => {
                            const isSelected = categoryId === category.id;
                            return (
                                <Pressable
                                    key={category.id}
                                    onPress={() => setCategoryId(category.id)}
                                    style={[
                                        styles.categoryChip,
                                        {
                                            backgroundColor: isSelected ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                                            borderColor: isDark ? "#333" : "#ccc",
                                        },
                                    ]}
                                >
                                    <Text style={{ color: isSelected ? "#fff" : isDark ? "#ccc" : "#333", fontSize: 13, fontWeight: "600" }}>
                                        {category.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Monthly limit</Text>
                <TextInput
                    placeholder="Amount"
                    placeholderTextColor="#888"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    style={styles.input}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.buttonWrapper}>
                    <Button title="Create" onPress={handleCreate} color="#4F7CFF" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}