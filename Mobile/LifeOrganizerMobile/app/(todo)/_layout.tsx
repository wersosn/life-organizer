import { Stack } from "expo-router";

export default function TodoLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="create"
                options={{
                    title: "Create task"
                }}
            />
            <Stack.Screen
                name="update"
                options={{
                    title: "Update task"
                }}
            />
        </Stack>
    );
}