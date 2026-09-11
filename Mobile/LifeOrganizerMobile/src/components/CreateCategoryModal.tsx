import { createCategory } from "@/api/transactionCategoriesApi";
import { TransactionType } from "@/types/transaction";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "@/styles/categoryModal.styles";

type Props = {
    visible: boolean;
    onClose: () => void;
    onCreated: (categoryId: string) => void;
};

export function CreateCategoryModal({ visible, onClose, onCreated }: Props) {
    const [name, setName] = useState("");
    const [type, setType] = useState<TransactionType>(TransactionType.Expense);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleCreate() {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        setError(null);

        try {
            const categoryId = await createCategory(name, type);
            setName("");
            onCreated(categoryId);
        } catch (e) {
            console.log(e);
            setError("Failed to create category. Please try again.");
        }
    }

    function handleClose() {
        setName("");
        setError(null);
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={[styles.card, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
                    <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>
                        New {type === TransactionType.Expense ? "expense" : "income"} category
                    </Text>

                    <TextInput
                        placeholder="Category name"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        style={[
                            styles.input,
                            { backgroundColor: isDark ? "#2A2A2A" : "#F5F5F5", color: isDark ? "#f5f5f5" : "#030303" },
                        ]}
                    />

                    <View style={styles.typeRow}>
                        <Pressable
                            onPress={() => setType(TransactionType.Expense)}
                            style={[
                                styles.typeSegment,
                                { backgroundColor: type === TransactionType.Expense ? "#8a3c5c" : isDark ? "#2A2A2A" : "#F5F5F5" },
                            ]}
                        >
                            <Text style={{ color: type === TransactionType.Expense ? "#f5f5f5" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                                Expense
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setType(TransactionType.Income)}
                            style={[
                                styles.typeSegment,
                                { backgroundColor: type === TransactionType.Income ? "#408bbc" : isDark ? "#2A2A2A" : "#F5F5F5" },
                            ]}
                        >
                            <Text style={{ color: type === TransactionType.Income ? "#f5f5f5" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                                Income
                            </Text>
                        </Pressable>
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.buttonRow}>
                        <Pressable onPress={handleClose} style={styles.cancelButton} testID="cancel-button">
                            <Text style={{ color: isDark ? "#ccc" : "#666", fontWeight: "600" }}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={handleCreate} style={styles.createButton} testID="create-button">
                            <Text style={{ color: "#f5f5f5", fontWeight: "600" }}>Create</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}