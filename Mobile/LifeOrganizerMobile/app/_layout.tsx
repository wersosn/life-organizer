import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { AuthProvider } from "@/auth/AuthContext";
import { initDatabase } from '@/database/database';
import { syncTodos } from '@/services/syncService';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isOnline = useNetworkStatus();
  initDatabase();

  useEffect(() => {
    if (isOnline) {
      syncTodos();
    }
  }, [isOnline]);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(todo)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
