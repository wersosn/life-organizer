import { getCategories } from "@/api/transactionCategoryApi";
import { createTransaction } from "@/api/transactionsApi";
import { CreateCategoryModal } from "@/components/CreateCategoryModal";
import { styles } from "@/styles/createTransaction.styles";
import { TransactionCategory, TransactionType } from "@/types/transaction";
import { todayIso } from "@/utils/transactionFormat";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Pressable, ScrollView, TextInput, Text, View, useColorScheme, Platform } from "react-native";

export default function CreateTransactionScreen() {
    const [type, setType] = useState<TransactionType>(TransactionType.Expense);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
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

    function handleCategoryCreated(newCategoryId: string) {
        setCategoryModalVisible(false);
        setCategoryId(newCategoryId);
        loadCategories();
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
            await createTransaction(categoryId, parsedAmount, type, todayIso(), description || undefined);
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to create transaction. Please try again.");
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
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>New transaction</Text>

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
                ) : filteredCategories.length === 0 ? (
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No categories for this type yet.
                    </Text>
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

                <Pressable onPress={() => setCategoryModalVisible(true)} style={styles.newCategoryButton}>
                    <Text style={styles.newCategoryText}>+ New category</Text>
                </Pressable>

                <CreateCategoryModal
                    visible={categoryModalVisible}
                    onClose={() => setCategoryModalVisible(false)}
                    onCreated={handleCategoryCreated}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.buttonWrapper}>
                    <Button title="Create" onPress={handleCreate} color="#4F7CFF" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}