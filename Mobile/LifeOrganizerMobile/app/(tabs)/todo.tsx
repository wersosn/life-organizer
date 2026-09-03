import { View, Text, StyleSheet, FlatList, useColorScheme, Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { completeTodo, deleteTodo, getTodos } from "@/api/todoApi";
import { router, useFocusEffect } from "expo-router";
import TodoCard from "@/components/TodoCard";
import { styles } from "../../src/styles/todo.styles";
import { SettingsButton } from "@/components/SettingsButton";
import { useAuth } from "@/auth/AuthContext";
import { getAllTodos } from "@/database/repositories/todoRepository";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function TodoScreen() {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const isOnline = useNetworkStatus();

    async function loadTodos() {
        if (!user) {
            setLoading(false);
            setRefreshing(false);
            return;
        }

        if (!isOnline) {
            try {
                const data = await getAllTodos(user.id);
                Alert.alert("Sync", "Data synchronization completed successfully.");
                setTodos(data);
            } catch (e) {
                console.log(e);
                Alert.alert("Sync", "Data synchronization failed.");
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        } else {
            try {
                const data = await getTodos();
                Alert.alert("Online", "hello");
                setTodos(data);
            } catch (e) {
                console.log(e);
                Alert.alert("Error", "Could not load tasks.");
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            Alert.alert("User", "User: " + (user ? user.id : "No user"));
            loadTodos();
        }, [user])
    );

    async function handleComplete(id: string) {
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id
                    ? {
                        ...todo,
                        isCompleted: !todo.isCompleted,
                    }
                    : todo
            )
        );
        await completeTodo(id);
    }

    async function handleDelete(id: string) {
        Alert.alert(
            "Delete task",
            `Are you sure you want to delete this task?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteTodo(id);
                            await loadTodos();
                        } catch (e) {
                            console.log(e);
                            Alert.alert("Error", "Could not delete task.");
                        }
                    },
                },
            ]
        );
    }

    function handleEdit(todo: Todo) {
        router.push({
            pathname: "../(todo)/update",
            params: {
                id: todo.id,
                title: todo.title,
                description: todo.description ?? "",
            },
        });
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    To-do List
                </Text>
                <View style={styles.headerActions}>
                    <SettingsButton />
                </View>
            </View>

            {!loading && todos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No tasks yet. Tap + to create one.
                    </Text>
                </View>
            ) : (
                <FlatList
                    style={{ marginTop: 20 }}
                    data={todos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TodoCard
                            todo={item}
                            onComplete={handleComplete}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    )}
                />
            )}
        </View>
    );
}