import { View, Text, Button, TextInput, useColorScheme, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/apiClient";
import { saveToken } from "@/auth/tokenStorage";
import { useAuth } from "@/auth/AuthContext";
import { ThemedText } from "@/components/themed-text";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

export default function LoginScreen() {
    // Connection test:
    /*const [message, setMessage] = useState("Sprawdzanie połączenia...");

    useEffect(() => {
        apiClient
            .get("/test")
            .then(response => {
                console.log(response.data);
                setMessage("Działa połączenie z serwerem");
            })
            .catch(error => {
                console.log(error);
                setMessage("Nie działa połączenie z serwerem " + error);
            });
    }, []);

    return (
        <View>
            <ThemedText>{message}</ThemedText>
        </View>
    )*/

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleLogin() {
        try {
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            });

            await login(response.data.token);
            router.replace("/(tabs)/todo");
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: isDark ? "#121212" : "#F5F5F5" },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                <Text
                    style={[
                        styles.title,
                        { color: isDark ? "#FFFFFF" : "#000000" },
                    ]}
                >
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
                    <Button title="Login" onPress={handleLogin} />
                </View>

                <Link href="../register" style={[styles.link, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    Don't have an account? Register here
                </Link>
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
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 20,
    },

    buttonContainer: {
        marginTop: 10,
        marginBottom: 30,
    },

    link: {
        textAlign: "center",
        fontSize: 15,
    },
});