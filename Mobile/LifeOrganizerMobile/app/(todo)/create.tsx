import { createTodo } from "@/api/todoApi";
import { createTodoLocal, markSynced } from "@/database/repositories/todoRepository";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, useColorScheme, Button, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";

export default function CreateTodoScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleCreate() {
        if (!title.trim()) {
            console.log("Title is required");
            return;
        }

        /*try {
            await createTodo(
                title,
                description
            );
            await createTodoLocal(title, description);
            router.back();
        } catch (error) {
            console.log(error);
        }*/

        await createTodo(title, description);
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
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 32,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
    },

    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
    },

    description: {
        height: 120,
        textAlignVertical: "top",
    },

});