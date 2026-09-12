import { getCategories } from "@/api/transactionCategoriesApi";
import { TransactionCategory, TransactionType } from "@/types/transaction";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "@/styles/budgets.styles";
import { createBudget } from "@/api/budgetsApi";
import { router } from "expo-router";
import { Blob } from "@/components/ui/Blob";
import { BackButton } from "@/components/ui/BackButton";

export default function CreateBudgetScreen() {
    const [amount, setAmount] = useState("");
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const blobColor = isDark ? "#f2f3f7" : "#13161d";
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

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
        <View style={[styles.screen, { backgroundColor: screenBackground }]}>
            <Blob variant="top4" color={blobColor} width={430} style={styles.blobTop} />
            <Blob variant="drip3" color={blobColor} width={430} style={styles.blobBottom} />
            <BackButton />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>New budget</Text>

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
                                                backgroundColor: isSelected ? "#408bbc" : isDark ? "#1E1E1E" : "#f5f5f5",
                                                borderColor: isDark ? "#333" : "#ccc",
                                            },
                                        ]}
                                    >
                                        <Text style={{ color: isSelected ? "#f5f5f5" : isDark ? "#ccc" : "#333", fontSize: 13, fontWeight: "600" }}>
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

                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={handleCreate}
                    >
                        <Text style={styles.buttonText}>Create</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}