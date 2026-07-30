import { View, Text, StyleSheet, FlatList, useColorScheme } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { completeTodo, deleteTodo, getTodos } from "@/api/todoApi";
import { router, useFocusEffect } from "expo-router";
import TodoCard from "@/components/TodoCard";
import { deleteTodoLocal, getAllTodos, markSynced, updateTodoLocal, upsertFromServer } from "@/database/repositories/todoRepository";

export default function TodoScreen() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadTodos() {
        try {
            const data = await getTodos();
            setTodos(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadTodos();
        }, [])
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
        await deleteTodo(id);
        await loadTodos();
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginTop: 60,
        marginLeft: 24,
    },
    fab: {
        position: "absolute",
        bottom: 35,
        alignSelf: "center",

        width: 68,
        height: 68,
        borderRadius: 34,

        backgroundColor: "#4F7CFF",

        justifyContent: "center",
        alignItems: "center",

        elevation: 6,
    },
    plus: {
        color: "white",
        fontSize: 38,
        marginTop: -2,
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 15,
    },
});