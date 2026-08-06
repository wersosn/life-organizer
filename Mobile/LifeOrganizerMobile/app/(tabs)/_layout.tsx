import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/auth/AuthContext";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// For the future:
// tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,

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

            <Modal visible={showAddMenu} transparent animationType="fade">
                <Pressable
                    style={styles.overlay}
                    onPress={() => setShowAddMenu(false)}
                >
                    <View style={styles.menu}>
                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                setShowAddMenu(false);
                                router.push("/(todo)/create");
                            }}
                        >
                            <Text style={styles.optionText}>Add new task</Text>
                        </Pressable>

                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                setShowAddMenu(false);
                                router.push("/(habits)/create");
                            }}
                        >
                            <Text style={styles.optionText}>Add new habit</Text>
                        </Pressable>

                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                setShowAddMenu(false);
                                router.push("/(finances)/createTransaction");
                            }}
                        >
                            <Text style={styles.optionText}>Add new transaction</Text>
                        </Pressable>

                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                setShowAddMenu(false);
                                router.push("/(finances)/createBudget");
                            }}
                        >
                            <Text style={styles.optionText}>Add new budget</Text>
                        </Pressable>

                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                setShowAddMenu(false);
                                router.push("/(chores)/createChore");
                            }}
                        >
                            <Text style={styles.optionText}>Add new chore</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
    },

    menu: {
        width: 280,
        backgroundColor: "white",
        borderRadius: 18,
        paddingVertical: 20,
        paddingHorizontal: 16,
    },

    option: {
        paddingVertical: 14,
    },

    optionText: {
        fontSize: 18,
        textAlign: "center",
    },
});