import { Stack } from "expo-router";

export default function FinanceLayout() {
    return (
        <Stack>
            <Stack.Screen name="createTransaction" options={{ title: "Create transaction" }} />
        </Stack>
    );
}