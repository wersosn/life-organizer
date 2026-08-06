import { Stack } from "expo-router";

export default function ChoreLayout() {
    return (
        <Stack>
            <Stack.Screen name="createChore" options={{ title: "Create chore" }} />
            <Stack.Screen name="updateChore" options={{ title: "Update chore" }} />
            <Stack.Screen name="choreDetails" options={{ title: "Chore details" }} />
        </Stack>
    );
}