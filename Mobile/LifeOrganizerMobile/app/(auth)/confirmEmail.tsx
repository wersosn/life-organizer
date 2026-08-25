import { ActivityIndicator, Button, Text, useColorScheme, View } from "react-native";
import { styles } from "../../src/styles/login.styles";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { confirmEmail } from "@/api/authApi";

export default function ConfirmEmailScreen() {
    const params = useLocalSearchParams();
    const token = params.token as string | undefined;

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        confirmEmail(token)
            .then(() => setStatus("success"))
            .catch(e => {
                console.log(e);
                setStatus("error");
            });
    }, [token]);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            {status === "loading" && (
                <>
                    <ActivityIndicator size="large" color="#4F7CFF" />
                    <Text style={{ color: isDark ? "#888" : "#999", marginTop: 12 }}>Confirming your email...</Text>
                </>
            )}

            {status === "success" && (
                <>
                    <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Email confirmed!</Text>
                    <Text style={{ color: isDark ? "#888" : "#999", textAlign: "center", marginBottom: 20 }}>
                        You can now log in to your account.
                    </Text>
                    <Button title="Go to login" onPress={() => router.replace("/(auth)/login")} color="#4F7CFF" />
                </>
            )}

            {status === "error" && (
                <>
                    <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Confirmation failed</Text>
                    <Text style={{ color: isDark ? "#888" : "#999", textAlign: "center", marginBottom: 20 }}>
                        This link may be invalid or expired.
                    </Text>
                    <Button title="Back to login" onPress={() => router.replace("/(auth)/login")} color="#4F7CFF" />
                </>
            )}
        </View>
    );
}
