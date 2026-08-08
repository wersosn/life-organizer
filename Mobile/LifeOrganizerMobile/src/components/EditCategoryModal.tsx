import { TransactionCategory, TransactionType } from "@/types/transaction";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "@/styles/categoryModal.styles";
import { updateCategory } from "@/api/transactionCategoriesApi";

type Props = {
    visible: boolean;
    category: TransactionCategory | null;
    onClose: () => void;
    onUpdated: () => void;
};

export function EditCategoryModal({ visible, category, onClose, onUpdated }: Props) {
    const [name, setName] = useState("");
    const [type, setType] = useState<TransactionType>(TransactionType.Expense);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        if (category) {
            setName(category.name);
            setType(category.type);
            setError(null);
        }
    }, [category]);

    async function handleUpdate() {
        if (!category) return;

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        setError(null);

        try {
            await updateCategory(category.id, name, type);
            onUpdated();
        } catch (e: any) {
            console.log(e);
            if (e?.response?.status === 400) {
                Alert.alert("Can't change type", "This category already has transactions and its type can't be changed.");
            } else {
                setError("Failed to update category. Please try again.");
            }
        }
    }

    function handleClose() {
        setError(null);
        onClose();
    }

    if (!category) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={[styles.card, { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" }]}>
                    <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
                        Edit category
                    </Text>

                    <TextInput
                        placeholder="Category name"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        style={[
                            styles.input,
                            { backgroundColor: isDark ? "#2A2A2A" : "#F5F5F5", color: isDark ? "#fff" : "#000" },
                        ]}
                    />

                    <View style={styles.typeRow}>
                        <Pressable
                            onPress={() => setType(TransactionType.Expense)}
                            style={[
                                styles.typeSegment,
                                {
                                    backgroundColor: type === TransactionType.Expense ? "#E53935" : isDark ? "#2A2A2A" : "#F5F5F5",
                                },
                            ]}
                        >
                            <Text style={{ color: type === TransactionType.Expense ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                                Expense
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setType(TransactionType.Income)}
                            style={[
                                styles.typeSegment,
                                {
                                    backgroundColor: type === TransactionType.Income ? "#4CAF50" : isDark ? "#2A2A2A" : "#F5F5F5",
                                },
                            ]}
                        >
                            <Text style={{ color: type === TransactionType.Income ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                                Income
                            </Text>
                        </Pressable>
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.buttonRow}>
                        <Pressable onPress={handleClose} style={styles.cancelButton} testID="cancel-button">
                            <Text style={{ color: isDark ? "#ccc" : "#666", fontWeight: "600" }}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={handleUpdate} style={styles.createButton} testID="save-button">
                            <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}