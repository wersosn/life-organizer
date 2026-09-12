import { ActivityIndicator, Button, Pressable, Text, useColorScheme, View } from "react-native";
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
    const screenBackground = isDark ? "#0c0e13" : "#edeff3";

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
        <View style={[styles.screen, { backgroundColor: screenBackground }]}>
            <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                {status === "loading" && (
                    <>
                        <ActivityIndicator size="large" color="#408bbc" />
                        <Text style={{ color: isDark ? "#888" : "#999", marginTop: 12 }}>Confirming your email...</Text>
                    </>
                )}

                {status === "success" && (
                    <>
                        <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>Email confirmed!</Text>
                        <Text style={{ color: isDark ? "#888" : "#999", textAlign: "center", marginBottom: 20 }}>
                            You can now log in to your account.
                        </Text>
                        <Pressable
                            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                            onPress={() => router.replace("/(auth)/login")}
                        >
                            <Text style={styles.buttonText}>Go to login</Text>
                        </Pressable>
                    </>
                )}

                {status === "error" && (
                    <>
                        <Text style={[styles.title, { color: isDark ? "#f5f5f5" : "#030303" }]}>Confirmation failed</Text>
                        <Text style={{ color: isDark ? "#888" : "#999", textAlign: "center", marginBottom: 20 }}>
                            This link may be invalid or expired.
                        </Text>
                        <Pressable
                            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                            onPress={() => router.replace("/(auth)/login")}
                        >
                            <Text style={styles.buttonText}>Back to login</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}
