import { styles } from "@/styles/budgets.styles";
import { updateBudget } from "@/api/budgetsApi";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, useColorScheme, View } from "react-native";
import { Blob } from "@/components/ui/Blob";
import { BackButton } from "@/components/ui/BackButton";

export default function UpdateBudgetScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;
    const categoryName = params.categoryName as string;

    const [amount, setAmount] = useState(params.monthlyLimit as string);
    const [error, setError] = useState<string | null>(null);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const blobColor = isDark ? "#f2f3f7" : "#13161d";
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

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
                    <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>Edit budget</Text>

                    <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Category</Text>
                    <View style={[styles.categoryDisplay, { backgroundColor: isDark ? "#1E1E1E" : "#f5f5f5", borderColor: isDark ? "#333" : "#ccc" }]}>
                        <Text style={{ color: isDark ? "#f5f5f5" : "#030303", fontWeight: "600" }}>{categoryName}</Text>
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

                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={handleUpdate}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
