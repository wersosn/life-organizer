import { updateTodo } from "@/api/todoApi";
import { markSynced, updateTodoLocal } from "@/database/repositories/todoRepository";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, useColorScheme, Button, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";

export default function UpdateTodoScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;
    const [title, setTitle] = useState(params.title as string);
    const [description, setDescription] = useState(params.description as string);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleUpdate() {
        if (!title.trim()) {
            console.log("Title is required");
            return;
        }

        try {
            await updateTodo(
                id,
                title,
                description
            );
            router.back();
        } catch (error) {
            console.log(error);
        }
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
                    title="Save changes"
                    onPress={handleUpdate}
                    color="#4F7CFF"
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