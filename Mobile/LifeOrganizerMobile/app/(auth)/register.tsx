import { View, Text, Button, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { apiClient } from "@/api/apiClient";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    async function register() {
        await apiClient.post("/auth/register")
        console.log({
            email,
            name,
            password
        });
        router.replace("../login");
    }

    return (
        <View style={{ padding: 20, flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Rejestracja</Text>
            <TextInput placeholder="Nazwa użytkownika" value={name} onChangeText={setName} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Hasło" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Utwórz konto" onPress={register} />
        </View>
    );
}