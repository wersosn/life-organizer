import { View, Text, Button, TextInput } from "react-native";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/apiClient";
import { saveToken } from "@/auth/tokenStorage";
import { useAuth } from "@/auth/authProvider";
import { ThemedText } from "@/components/themed-text";

export default function LoginScreen() {
    const [message, setMessage] = useState("Sprawdzanie połączenia...");

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
    )
    /*const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

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
        <View style={{ padding: 20, flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Logowanie</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Hasło" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Zaloguj" onPress={handleLogin} />
            <Link href="../register"> Nie masz konta? Zarejestruj się </Link>
        </View>
    );*/
}