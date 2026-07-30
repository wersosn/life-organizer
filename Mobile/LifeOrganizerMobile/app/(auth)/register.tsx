import { View, Text, Button, TextInput, useColorScheme, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { apiClient } from "@/api/apiClient";
import { styles } from "../../src/styles/register.styles";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function register() {
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

        await apiClient.post("/auth/register", { email, name, password });
        console.log({
            email,
            name,
            password
        });
        router.replace("../login");
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    {
                        backgroundColor: isDark ? "#121212" : "#F5F5F5",
                    },
                ]}
                keyboardShouldPersistTaps="handled">

                <Text style={[ styles.title, { color: isDark ? "#FFFFFF" : "#000000", }, ]}>
                    Registration
                </Text>

                <TextInput
                    placeholder="Username"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <TextInput
                    placeholder="Repeat password"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title="Create account"
                        onPress={register}
                        color="#4F7CFF"
                    />
                </View>

                <Link href="../login" style={styles.link}>
                    Already have an account? Login here
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}