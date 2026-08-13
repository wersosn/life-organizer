import { getRetentionSettings, updateRetentionSettings } from "@/api/retentionApi";
import { styles } from "../../src/styles/automation.styles";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, TextInput, useColorScheme, View } from "react-native";

export default function RetentionScreen() {
    const [days, setDays] = useState("30");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        getRetentionSettings()
            .then(data => setDays(String(data.taskHistoryRetentionDays)))
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, []);

    async function handleSave() {
        const parsed = parseInt(days, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 365) {
            setError("Enter a value between 1 and 365 days");
            return;
        }

        setError(null);
        try {
            await updateRetentionSettings(parsed);
            Alert.alert("Saved", "Your retention settings have been updated.");
        } catch (e) {
            console.log(e);
            setError("Failed to save. Please try again.");
        }
    }

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <ActivityIndicator size="large" color="#4F7CFF" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Task history retention</Text>
            <Text style={[styles.subtitle, { color: isDark ? "#888" : "#999" }]}>
                Completed tasks older than this many days will be automatically deleted.
            </Text>

            <TextInput
                value={days}
                onChangeText={setDays}
                keyboardType="number-pad"
                style={[styles.input, { backgroundColor: isDark ? "#1E1E1E" : "#fff", color: isDark ? "#fff" : "#000" }]}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button title="Save" onPress={handleSave} color="#4F7CFF"/>
        </View>
    );
}