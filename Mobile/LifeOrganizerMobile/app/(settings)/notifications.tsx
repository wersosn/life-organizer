import { getNotificationSettings, updateNotificationSettings } from "@/api/notificationsApi";
import { styles } from "@/styles/automation.styles";
import { NotificationSettings } from "@/types/notification";
import { useEffect, useState } from "react";
import { ActivityIndicator, Switch, Text, useColorScheme, View } from "react-native";

export default function NotificationsScreen() {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        getNotificationSettings()
            .then(setSettings)
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, []);

    async function handleToggle(value: boolean) {
        if (!settings) {
            return;
        }

        const previous = settings;
        const updated = { ...settings, pushNotificationsEnabled: value };
        setSettings(updated);

        try {
            await updateNotificationSettings(updated);
        } catch (e) {
            console.log(e);
            setSettings(previous);
        }
    }

    if (loading || !settings) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
                <ActivityIndicator size="large" color="#4F7CFF" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Notifications</Text>

            <View style={[styles.row, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: isDark ? "#fff" : "#000" }]}>Push notifications</Text>
                    <Text style={[styles.rowSubtitle, { color: isDark ? "#888" : "#999" }]}>
                        Get notified about overdue habits, chores, and other important updates.
                    </Text>
                </View>
                <Switch
                    value={settings.pushNotificationsEnabled}
                    onValueChange={handleToggle}
                />
            </View>
        </View>
    );
}