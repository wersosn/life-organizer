import { createTodo } from "@/api/todoApi";
import { router } from "expo-router";
import { useState } from "react";
import { Text, useColorScheme, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform, View, Pressable } from "react-native";
import { styles } from "../../src/styles/createTodo.styles";
import { Blob } from "@/components/ui/Blob";
import { Ionicons } from "@expo/vector-icons";

export default function CreateTodoScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const blobColor = isDark ? "#F5F5F5" : "#0B0B0B";
    const screenBackground = isDark ? "#121212" : "#F5F5F5";

    async function handleCreate() {
        if (!title.trim()) {
            console.log("Title is required");
            return;
        }

        await createTodo(title, description || undefined);
        router.back();
    }

    return (
        <View style={[styles.screen, { backgroundColor: screenBackground }]}>
            <Blob variant="top4" color={blobColor} width={430} style={styles.blobTop} />
            <Blob variant="drip3" color={blobColor} width={430} style={styles.blobBottom} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
                        New task
                    </Text>

                    <View style={styles.inputWrapper}>
                        <Ionicons name="pricetag-outline" size={18} color="#9A9A9A" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Title"
                            placeholderTextColor="#888"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />
                    </View>

                    <View style={[styles.inputWrapper, styles.descriptionWrapper]}>
                        <Ionicons
                            name="document-text-outline"
                            size={18}
                            color="#9A9A9A"
                            style={[styles.inputIcon, styles.descriptionIcon]}
                        />
                        <TextInput
                            placeholder="Description"
                            placeholderTextColor="#888"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            style={[styles.input, styles.description]}
                        />
                    </View>

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