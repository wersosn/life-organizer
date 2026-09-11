import { Stack } from "expo-router";

export default function HabitLayout() {
    return (
        <Stack>
            <Stack.Screen name="create" options={{ title: "Create habit", headerShown: false }} />
            <Stack.Screen name="update" options={{ title: "Update habit", headerShown: false }} />
            <Stack.Screen name="details" options={{ title: "Habit details", headerShown: false }} />
        </Stack>
    );
}