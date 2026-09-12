import { forgotPassword } from "@/api/authApi";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "../../src/styles/resetPassword.styles";
import { BackButton } from "@/components/ui/BackButton";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

    async function handleSubmit() {
        if (!email.trim()) {
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email);
            Alert.alert(
                "Check your email",
                "If an account with that email exists, we've sent a password reset link.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.screen, { backgroundColor: screenBackground }]}>
            <BackButton />
            
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                    <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>Reset password</Text>
                    <Text style={[styles.subtitle, { color: isDark ? "#888" : "#999" }]}>
                        Enter your email and we'll send you a link to reset your password.
                    </Text>

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                    />
                
                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send reset link"}</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}