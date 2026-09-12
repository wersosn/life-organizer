import { Stack } from "expo-router";

export default function FinanceLayout() {
    return (
        <Stack>
            <Stack.Screen name="createTransaction" options={{ title: "Create transaction", headerShown: false }} />
            <Stack.Screen name="updateTransaction" options={{ title: "Update transaction", headerShown: false }} />
            <Stack.Screen name="monthlySummary" options={{ title: "Monthly Summary", headerShown: false }} />
            <Stack.Screen name="createBudget" options={{ title: "Create budget", headerShown: false }} />
            <Stack.Screen name="updateBudget" options={{ title: "Update budget", headerShown: false }} />
        </Stack>
    );
}