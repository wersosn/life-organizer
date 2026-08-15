import { Alert, ScrollView, Text, useColorScheme, View } from "react-native";
import { styles } from "@/styles/settings.styles";
import { SettingsRow } from "@/components/SettingsRow";
import { router } from "expo-router";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { saveFileToDevice } from "@/utils/exportFile";
import { exportFullData } from "@/api/exportApi";

export default function SettingsScreen() {
    const { logout } = useAuth();
    const [exporting, setExporting] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    function handleLogout() {
        Alert.alert("Log out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log out",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.dismissAll();
                    router.replace("/(auth)/login");
                },
            },
        ]);
    }

    function handleExportPress() {
        Alert.alert(
            "Export your data",
            "This will export all your tasks, habits, transactions, budgets, and chores as a JSON file. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Export", onPress: handleExportJson },
            ]
        );
    }

    async function handleExportJson() {
        setExporting(true);
        try {
            const json = await exportFullData();
            const result = await saveFileToDevice(json, `lifeorganizer_export_${Date.now()}.json`, "application/json");
            Alert.alert(
                result.savedToDownloads ? "Saved" : "Exported",
                result.savedToDownloads ? "Your data was saved." : "Your data is ready to share."
            );
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not export your data.");
        } finally {
            setExporting(false);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}
        >
            <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Settings</Text>

            <Text style={[styles.sectionHeader, { color: isDark ? "#888" : "#999" }]}>Finance</Text>
            <View style={[styles.section, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                <SettingsRow label="Transaction categories" onPress={() => router.push("../transactionCategories")} />
            </View>

            <Text style={[styles.sectionHeader, { color: isDark ? "#888" : "#999" }]}>Chores</Text>
            <View style={[styles.section, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                <SettingsRow label="Chore categories" onPress={() => router.push("../choreCategories")} />
            </View>

            <Text style={[styles.sectionHeader, { color: isDark ? "#888" : "#999" }]}>Preferences</Text>
            <View style={[styles.section, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                <SettingsRow label="Automation" onPress={() => router.push("../automation")} />
                <View style={[styles.divider, { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }]} />
                <SettingsRow label="Notifications" onPress={() => router.push("../notifications")} />
                <View style={[styles.divider, { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }]} />
                <SettingsRow label="Task history retention" onPress={() => router.push("../retention")} />
            </View>

            <Text style={[styles.sectionHeader, { color: isDark ? "#888" : "#999" }]}>Account</Text>
            <View style={[styles.section, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                <SettingsRow label={exporting ? "Exporting..." : "Export data"} onPress={exporting ? () => {} : handleExportPress} />
                <View style={[styles.divider, { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }]} />
                <SettingsRow label="Log out" onPress={handleLogout} destructive />
            </View>
        </ScrollView>
    );
}