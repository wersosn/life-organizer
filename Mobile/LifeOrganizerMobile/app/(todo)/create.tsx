import { createTodo } from "@/api/todoApi";
import { router } from "expo-router";
import { useState } from "react";
import { Text, useColorScheme, TextInput, KeyboardAvoidingView, ScrollView, Platform, View, Pressable } from "react-native";
import { styles } from "../../src/styles/createTodo.styles";
import { Blob } from "@/components/ui/Blob";
import { BackButton } from "@/components/ui/BackButton";

export default function CreateTodoScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const blobColor = isDark ? "#f2f3f7" : "#13161d";
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

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
            <Blob variant="top5" color={blobColor} width={430} style={styles.blobTop} />
            <Blob variant="drip3" color={blobColor} width={430} style={styles.blobBottom} />
            <BackButton />
            
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>
                        New task
                    </Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Title"
                            placeholderTextColor="#888"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />
                    </View>

                    <View style={[styles.inputWrapper, styles.descriptionWrapper]}>
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