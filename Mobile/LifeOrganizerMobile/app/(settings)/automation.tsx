import { AutomationSettings } from "@/types/automation";
import { useEffect, useState } from "react";
import { ActivityIndicator, Switch, Text, useColorScheme, View } from "react-native";
import { styles } from "../../src/styles/automation.styles";

export default function AutomationScreen() {
    const [settings, setSettings] = useState<AutomationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    /*useEffect(() => {
        getAutomationSettings()
            .then(setSettings)
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, []);*/

    async function handleToggle(key: keyof AutomationSettings, value: boolean) {
        if (!settings) return;

        const previous = settings;
        const updated = { ...settings, [key]: value };
        setSettings(updated);

        try {
            //await updateAutomationSettings(updated);
        } catch (e) {
            console.log(e);
            setSettings(previous);
        }
    }

    /*if (loading || !settings) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <ActivityIndicator size="large" color="#4F7CFF" />
            </View>
        );
    }*/

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Automation</Text>

            <View style={[styles.row, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: isDark ? "#fff" : "#000" }]}>Habits</Text>
                    <Text style={[styles.rowSubtitle, { color: isDark ? "#888" : "#999" }]}>
                        Missed habits will automatically appear in your task list.
                    </Text>
                </View>
                {/*<Switch
                    value={settings.habitAutomationEnabled}
                    onValueChange={value => handleToggle("habitAutomationEnabled", value)}
                />*/}
            </View>

            <View style={[styles.row, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: isDark ? "#fff" : "#000" }]}>Chores</Text>
                    <Text style={[styles.rowSubtitle, { color: isDark ? "#888" : "#999" }]}>
                        Overdue chores will automatically appear in your task list.
                    </Text>
                </View>
                {/*<Switch
                    value={settings.choreAutomationEnabled}
                    onValueChange={value => handleToggle("choreAutomationEnabled", value)}
                />*/}
            </View>
        </View>
    );
}