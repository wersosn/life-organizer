import { View, Text, Button, TextInput, useColorScheme, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/auth/AuthContext";
import { styles } from "../../src/styles/login.styles";
import { LoginResponse } from "@/types/auth";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleLogin() {
        try {
            const response = await apiClient.post<LoginResponse>("/auth/login", {
                email,
                password,
            });

            const { token, refreshToken } = response.data;
            await login(token, refreshToken);
            router.replace("/(tabs)/todo");
        }
        catch (error: any) {
            console.log(error);
            if (error.code === "ERR_NETWORK" || !error.response) {
                Alert.alert("Connection error", "Could not reach the server. Check your internet connection.");
            } else {
                Alert.alert("Login failed", "Invalid email or password");
            }
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: isDark ? "#121212" : "#F5F5F5" },
                ]}
                keyboardShouldPersistTaps="handled">
                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" },]}>
                    Login
                </Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
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

                <View style={styles.buttonContainer}>
                    <Button title="Login" onPress={handleLogin} color="#4F7CFF" />
                </View>

                <Link href="../register" style={[styles.link, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    Don't have an account? Register here
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}