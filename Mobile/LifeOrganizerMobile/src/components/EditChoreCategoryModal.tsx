
import { ChoreCategory } from "@/types/chore";
import { updateChoreCategory } from "@/api/choreCategoriesApi";
import { useEffect, useState } from "react";
import { Modal, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "../styles/categoryModal.styles";

type Props = {
    visible: boolean;
    category: ChoreCategory | null;
    onClose: () => void;
    onUpdated: () => void;
};

export function EditChoreCategoryModal({ visible, category, onClose, onUpdated }: Props) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        if (category) {
            setName(category.name);
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
            await updateChoreCategory(category.id, name);
            onUpdated();
        } catch (e) {
            console.log(e);
            setError("Failed to update category. Please try again.");
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
                    <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Edit category</Text>

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
                        <Pressable onPress={handleUpdate} style={styles.createButton}>
                            <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}