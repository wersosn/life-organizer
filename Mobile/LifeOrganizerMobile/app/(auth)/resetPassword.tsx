import { Alert, Button, KeyboardAvoidingView, Platform, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "../../src/styles/resetPassword.styles";
import { router, useLocalSearchParams } from "expo-router";
import { resetPassword } from "@/api/authApi";
import { useState } from "react";

export default function ResetPasswordScreen() {
    const params = useLocalSearchParams();
    const token = params.token as string | undefined;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleSubmit() {
        if (!token) {
            Alert.alert("Invalid link", "This reset link is invalid or missing a token.");
            return;
        }
        if (password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords don't match.");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);
            Alert.alert("Success", "Your password has been reset. Please log in.", [
                { text: "OK", onPress: () => router.replace("/(auth)/login") },
            ]);
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "This link may have expired. Please request a new one.");
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Invalid link</Text>
                <Text style={{ color: isDark ? "#888" : "#999", textAlign: "center" }}>
                    This password reset link is invalid or has expired. Please request a new one.
                </Text>
                <Button title="Back to login" onPress={() => router.replace("/(auth)/login")} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Set a new password</Text>

                <TextInput
                    placeholder="New password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    placeholder="Confirm password"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Button title={loading ? "Saving..." : "Reset password"} onPress={handleSubmit} disabled={loading} color="#4F7CFF" />
            </View>
        </KeyboardAvoidingView>
    );
}