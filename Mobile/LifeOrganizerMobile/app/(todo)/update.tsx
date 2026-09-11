import { updateTodo } from "@/api/todoApi";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, useColorScheme, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform, View, Pressable } from "react-native";
import { styles } from "../../src/styles/updateTodo.styles";
import { Blob } from "@/components/ui/Blob";
import { BackButton } from "@/components/ui/BackButton";

export default function UpdateTodoScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;
    const [title, setTitle] = useState(params.title as string);
    const [description, setDescription] = useState(params.description as string);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const blobColor = isDark ? "#f2f3f7" : "#13161d";
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

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
        <View style={[styles.screen, { backgroundColor: screenBackground }]}>
            <Blob variant="top4" color={blobColor} width={430} style={styles.blobTop} />
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
                        Update task
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
                        onPress={handleUpdate}
                    >
                        <Text style={styles.buttonText}>Save changes</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}