import { View, Text, Button, TextInput, useColorScheme, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { apiClient } from "@/api/apiClient";
import { styles } from "../../src/styles/register.styles";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function register() {
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }
        
        setLoading(true);
        try {
            await apiClient.post("/auth/register", { email, name, password });
            Alert.alert(
                "Check your email",
                "We've sent you a confirmation link. Please confirm your email before logging in.",
                [{ text: "OK" }]
            );
            router.replace("../login");
        } catch (error: any) {
            console.log(error);
            Alert.alert("Registration failed", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
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

                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000", },]}>
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
                    style={[styles.input,  { color: "#000000" }]}
                />

                <TextInput
                    placeholder="Repeat password"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={[styles.input,  { color: "#000000" }]}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title={loading ? "Creating account..." : "Create account"}
                        onPress={register}
                        disabled={loading}
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