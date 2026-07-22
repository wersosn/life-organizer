import { Redirect, router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from "@/auth/AuthContext";
import { Button, Pressable, Text } from 'react-native';

// For the future: tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { token, loading } = useAuth();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/(auth)/login");
    }
  }, [loading, token]);

  if (loading || !token) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="todo"
        options={{
          title: "To-do",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="checklist" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="repeat" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarButton: ({ accessibilityState }) => (
            <Pressable
              accessibilityState={accessibilityState}
              onPress={() => router.push("/modal")}
              style={{
                top: -15,
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#4F7CFF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 34,
                  fontWeight: "600",
                }}
              >
                +
              </Text>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="finances"
        options={{
          title: "Finance",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="creditcard.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chores"
        options={{
          title: "Chores",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
