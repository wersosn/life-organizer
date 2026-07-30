import { Stack } from "expo-router";

export default function HabitLayout() {
    return (
        <Stack>
            <Stack.Screen name="create" options={{ title: "Create habit" }} />
            <Stack.Screen name="update" options={{ title: "Update habit" }} />
            <Stack.Screen name="details" options={{ title: "Habit details" }} />
        </Stack>
    );
}