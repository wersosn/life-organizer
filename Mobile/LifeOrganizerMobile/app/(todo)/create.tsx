import { createTodo } from "@/api/todoApi";
import { router } from "expo-router";
import { useState } from "react";
import { Text, useColorScheme, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { styles } from "../../src/styles/createTodo.styles";
import { useAuth } from "@/auth/AuthContext";

export default function CreateTodoScreen() {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleCreate() {
        if (!title.trim()) {
            console.log("Title is required");
            return;
        }
        if (!user) {
            console.log("No user - cannot create todo");
            return;
        }

        await createTodo(title, description || undefined);
        router.back();
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    {
                        backgroundColor: isDark
                            ? "#121212"
                            : "#F5F5F5",
                    },
                ]}
                keyboardShouldPersistTaps="handled"
            >

                <Text
                    style={[
                        styles.title,
                        {
                            color: isDark
                                ? "#fff"
                                : "#000",
                        },
                    ]}
                >
                    New task
                </Text>

                <TextInput
                    placeholder="Title"
                    placeholderTextColor="#888"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Description"
                    placeholderTextColor="#888"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    style={[
                        styles.input,
                        styles.description
                    ]}
                />

                <Button
                    title="Create"
                    onPress={handleCreate}
                    color="#4F7CFF"
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}