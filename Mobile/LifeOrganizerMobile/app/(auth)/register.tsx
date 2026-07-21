import { View, Text, Button, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { apiClient } from "@/api/apiClient";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function register() {
        await apiClient.post("/auth/register", { email, name, password });
        console.log({
            email,
            name,
            password
        });
        router.replace("../login");
    }

    return (
        <View style={{ padding: 20, flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Registration</Text>
            <TextInput placeholder="Username" value={name} onChangeText={setName} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput placeholder="Repeat password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <Button title="Create account" onPress={register} />
        </View>
    );
}