import { Stack } from "expo-router";

export default function FinanceLayout() {
    return (
        <Stack>
            <Stack.Screen name="createTransaction" options={{ title: "Create transaction" }} />
            <Stack.Screen name="updateTransaction" options={{ title: "Update transaction" }} />
            <Stack.Screen name="monthlySummary" options={{ title: "Monthly Summary" }} />
        </Stack>
    );
}