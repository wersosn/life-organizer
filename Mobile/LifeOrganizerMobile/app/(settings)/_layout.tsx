import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen name="categories" options={{ title: "Transaction categories" }} />
            <Stack.Screen name="automation" options={{ title: "Automation" }} />
            <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
            <Stack.Screen name="retention" options={{ title: "Task history retention" }} />
        </Stack>
    );
}