import { getCategories } from "@/api/transactionCategoriesApi";
import { updateTransaction } from "@/api/transactionsApi";
import { TransactionCategory, TransactionType } from "@/types/transaction";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "@/styles/updateTransaction.styles";

export default function UpdateTransactionScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;

    const [type, setType] = useState<TransactionType>(Number(params.type) as TransactionType);
    const [amount, setAmount] = useState(params.amount as string);
    const [description, setDescription] = useState((params.description as string) ?? "");
    const [date] = useState(params.date as string);
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [categoryId, setCategoryId] = useState<string | null>(params.categoryId as string);
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
            setCategories(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingCategories(false);
        }
    }

    const filteredCategories = categories.filter(c => c.type === type);

    function handleTypeChange(value: TransactionType) {
        setType(value);
        setCategoryId(null);
    }

    async function handleUpdate() {
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
            await updateTransaction(id, categoryId, parsedAmount, type, date, description || undefined);
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to update transaction. Please try again.");
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
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Edit transaction</Text>

                <View style={styles.segmentedControl}>
                    <Pressable
                        onPress={() => handleTypeChange(TransactionType.Expense)}
                        style={[
                            styles.segment,
                            {
                                backgroundColor: type === TransactionType.Expense ? "#E53935" : isDark ? "#1E1E1E" : "#fff",
                                borderColor: isDark ? "#333" : "#ccc",
                            },
                        ]}
                    >
                        <Text style={{ color: type === TransactionType.Expense ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                            Expense
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => handleTypeChange(TransactionType.Income)}
                        style={[
                            styles.segment,
                            {
                                backgroundColor: type === TransactionType.Income ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                                borderColor: isDark ? "#333" : "#ccc",
                            },
                        ]}
                    >
                        <Text style={{ color: type === TransactionType.Income ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                            Income
                        </Text>
                    </Pressable>
                </View>

                <TextInput
                    placeholder="Amount"
                    placeholderTextColor="#888"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Description (optional)"
                    placeholderTextColor="#888"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                />

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Category</Text>

                {loadingCategories ? (
                    <ActivityIndicator style={{ marginBottom: 20 }} />
                ) : (
                    <View style={styles.categoryRow}>
                        {filteredCategories.map(category => {
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

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.buttonWrapper}>
                    <Button title="Save" onPress={handleUpdate} color="#4F7CFF"/>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}