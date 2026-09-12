import { Stack } from "expo-router";

export default function ChoreLayout() {
    return (
        <Stack>
            <Stack.Screen name="createChore" options={{ title: "Create chore", headerShown: false }} />
            <Stack.Screen name="updateChore" options={{ title: "Update chore", headerShown: false }} />
            <Stack.Screen name="choreDetails" options={{ title: "Chore details", headerShown: false }} />
        </Stack>
    );
}