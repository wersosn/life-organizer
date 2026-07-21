import { View, Text, Button, TextInput, useColorScheme } from "react-native";
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
    async function handleLogin() {
        try {
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            });

            await login(response.data.token);
            router.replace("/(tabs)");
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ padding: 20, flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
            <Link href="../register"> Don't have an account? Register here </Link>
        </View>
        </ThemeProvider>
    );
}