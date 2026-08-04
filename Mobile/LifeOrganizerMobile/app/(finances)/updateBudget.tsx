import { styles } from "@/styles/budgets.styles";
import { updateBudget } from "@/api/budgetsApi";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Button, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, useColorScheme, View } from "react-native";

export default function UpdateBudgetScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;
    const categoryName = params.categoryName as string;

    const [amount, setAmount] = useState(params.monthlyLimit as string);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleUpdate() {
        const parsedAmount = parseFloat(amount.replace(",", "."));

        if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a valid amount");
            return;
        }

        setError(null);

        try {
            await updateBudget(id, parsedAmount);
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to update budget. Please try again.");
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
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Edit budget</Text>

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Category</Text>
                <View style={[styles.categoryDisplay, { backgroundColor: isDark ? "#1E1E1E" : "#fff", borderColor: isDark ? "#333" : "#ccc" }]}>
                    <Text style={{ color: isDark ? "#fff" : "#000", fontWeight: "600" }}>{categoryName}</Text>
                </View>

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
                    <Button title="Save" onPress={handleUpdate} color="#4F7CFF" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
