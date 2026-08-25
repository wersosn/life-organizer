import { sendTestNotification } from "@/api/notificationsApi";
import { SettingsRow } from "@/components/SettingsRow";
import { styles } from "@/styles/chores.styles";
import { Alert, Text, useColorScheme, View } from "react-native";

export default function NotificationsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    
    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Notifications</Text>

            <SettingsRow
                label="Send test notification"
                onPress={async () => {
                    try {
                        await sendTestNotification();
                        Alert.alert("Sent", "Check your notifications!");
                    } catch (e) {
                        console.log(e);
                        Alert.alert("Error", "Could not send test notification. Is your push token registered?");
                    }
                }}
            />
        </View>
    );
}