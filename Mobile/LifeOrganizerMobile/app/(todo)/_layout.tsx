import { Stack } from "expo-router";

export default function TodoLayout() {
    return (
        <Stack>
            <Stack.Screen name="create" options={{ title: "Create task", headerShown: false }}/>
            <Stack.Screen name="update" options={{ title: "Update task", headerShown: false }}/>
        </Stack>
    );
}