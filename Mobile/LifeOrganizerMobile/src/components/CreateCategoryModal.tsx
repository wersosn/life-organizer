import { createCategory } from "@/api/transactionCategoryApi";
import { TransactionType } from "@/types/transaction";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "@/styles/CreateCategoryModal.styles";

type Props = {
    visible: boolean;
    type: TransactionType;
    onClose: () => void;
    onCreated: (categoryId: string) => void;
};

export function CreateCategoryModal({ visible, type, onClose, onCreated }: Props) {
    const [name, setName] = useState("");
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
                <View style={[styles.card, { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" }]}>
                    <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
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
                            { backgroundColor: isDark ? "#2A2A2A" : "#F5F5F5", color: isDark ? "#fff" : "#000" },
                        ]}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.buttonRow}>
                        <Pressable onPress={handleClose} style={styles.cancelButton}>
                            <Text style={{ color: isDark ? "#ccc" : "#666", fontWeight: "600" }}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={handleCreate} style={styles.createButton}>
                            <Text style={{ color: "#fff", fontWeight: "600" }}>Create</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}