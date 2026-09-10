import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { styles } from "../../src/styles/addModal.styles";
import { useAuth } from "@/auth/AuthContext";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

const ADD_OPTIONS: {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    route: Parameters<typeof router.push>[0];
}[] = [
        { label: "Add new task", icon: "checkbox-outline", route: "/(todo)/create" },
        { label: "Add new habit", icon: "repeat-outline", route: "/(habits)/create" },
        { label: "Add new transaction", icon: "swap-horizontal-outline", route: "/(finances)/createTransaction" },
        { label: "Add new budget", icon: "wallet-outline", route: "/(finances)/createBudget" },
        { label: "Add new chore", icon: "home-outline", route: "/(chores)/createChore" },
    ];

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { token, loading } = useAuth();
    const [showAddMenu, setShowAddMenu] = useState(false);
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
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                }}
            >
                <Tabs.Screen
                    name="todo"
                    options={{
                        title: "To-do",
                        tabBarIcon: () => (
                            <Image
                                source={isDark ? require("../../src/assets/images/todo-light.png") : require("../../src/assets/images/todo-dark.png")}
                                style={{ width: 22, height: 22, resizeMode: "contain" }} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="habits"
                    options={{
                        title: "Habits",
                        tabBarIcon: () => (
                            <Image
                                source={isDark ? require("../../src/assets/images/habit-light.png") : require("../../src/assets/images/habit-dark.png")}
                                style={{ width: 22, height: 22, resizeMode: "contain" }} />
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
                                onPress={() => setShowAddMenu(true)}
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
                        tabBarIcon: () => (
                            <Image
                                source={isDark ? require("../../src/assets/images/piggy-bank-light.png") : require("../../src/assets/images/piggy-bank-dark.png")}
                                style={{ width: 22, height: 22, resizeMode: "contain" }} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="chores"
                    options={{
                        title: "Chores",
                        tabBarIcon: () => (
                            <Image
                                source={isDark ? require("../../src/assets/images/chore-light.png") : require("../../src/assets/images/chore-dark.png")}
                                style={{ width: 22, height: 22, resizeMode: "contain" }} />
                        ),
                    }}
                />
            </Tabs>

            <Modal visible={showAddMenu} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setShowAddMenu(false)}>
                    <View style={styles.menu}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Add</Text>
                            <Pressable onPress={() => setShowAddMenu(false)} hitSlop={10}>
                                <Ionicons name="close" size={22} color="#0B0B0B" />
                            </Pressable>
                        </View>

                        {ADD_OPTIONS.map((item, index) => (
                            <Pressable
                                key={index}
                                style={({ pressed }) => [
                                    styles.option,
                                    index === ADD_OPTIONS.length - 1 && styles.optionLast,
                                    pressed && styles.optionPressed,
                                ]}
                                onPress={() => {
                                    setShowAddMenu(false);
                                    router.push(item.route);
                                }}
                            >
                                <View style={styles.optionIcon}>
                                    <Ionicons name={item.icon} size={18} color="#4F7CFF" />
                                </View>
                                <Text style={styles.optionText}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}