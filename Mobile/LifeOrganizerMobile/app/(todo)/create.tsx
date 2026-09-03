import { createTodo } from "@/api/todoApi";
import { router } from "expo-router";
import { useState } from "react";
import { Text, useColorScheme, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { styles } from "../../src/styles/createTodo.styles";
import { useAuth } from "@/auth/AuthContext";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { addToSyncQueue } from "@/services/syncQueue";
import { createCachedTodo } from "@/database/repositories/todoRepository";

export default function CreateTodoScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const isOnline = useNetworkStatus();
    const { user } = useAuth();

    async function handleCreate() {
        if (!title.trim()) {
            console.log("Title is required");
            return;
        }

        if (!user) {
            return;
        }

        if (isOnline) {
            await createTodo(title, description || undefined);
        } else {
            const todo = await createCachedTodo(
                user.id,
                title.trim(),
                description || undefined
            );

            await addToSyncQueue(
                "todo",
                todo.id,
                "create",
                {
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                }
            );
        }
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