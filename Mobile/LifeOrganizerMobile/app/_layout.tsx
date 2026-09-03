import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '@/utils/pushNotifications';
import { registerPushToken } from '@/api/notificationsApi';
import { Alert, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { initDatabase, resetDatabase } from '@/database/database';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

resetDatabase();

function AppContent() {
    const colorScheme = useColorScheme();
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            registerForPushNotificationsAsync()
                .then(pushToken => {
                    if (!pushToken) {
                        return;
                    }

                    registerPushToken(pushToken)
                        .catch(e => {
                            Alert.alert(
                                "Backend error",
                                `Status: ${e?.response?.status ?? "no response"}\n${JSON.stringify(e?.response?.data ?? e?.message)}`
                            );
                        });
                })
                .catch(e => {
                    Alert.alert("Error getting push token", e?.message ?? String(e));
                });
        }
    }, [token]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(todo)" options={{ headerShown: false }} />
                <Stack.Screen name="(habits)" options={{ headerShown: false }} />
                <Stack.Screen name="(finances)" options={{ headerShown: false }} />
                <Stack.Screen name="(chores)" options={{ headerShown: false }} />
                <Stack.Screen name="(settings)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
