import { View, Text, useColorScheme, Alert, Pressable, FlatList, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { styles } from "../../src/styles/chores.styles";
import { useCallback, useMemo, useState } from "react";
import { Chore } from "@/types/chore";
import { completeChore, deleteChore, getChores } from "@/api/choresApi";
import { SettingsButton } from "@/components/SettingsButton";
import { ChoreCard } from "@/components/ChoreCard";

type ViewMode = "overdue" | "all";

export default function ChoresScreen() {
    const [chores, setChores] = useState<Chore[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("overdue");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadChores() {
        try {
            const data = await getChores();
            setChores(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadChores();
        }, [])
    );

    async function handleRefresh() {
        setRefreshing(true);
        await loadChores();
    }

    const visibleChores = useMemo(() => {
        if (viewMode === "all") {
            return chores;
        }
        return chores.filter(c => c.isOverdue);
    }, [chores, viewMode]);

    async function handleComplete(id: string) {
        try {
            await completeChore(id);
            loadChores();
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not mark chore as done.");
        }
    }

    function handleEdit(chore: Chore) {
        router.push({
            pathname: "../(chores)/updateChore",
            params: {
                id: chore.id,
                name: chore.name,
                description: chore.description ?? "",
                categoryId: chore.categoryId,
                frequencyUnit: String(chore.frequencyUnit),
                frequencyValue: String(chore.frequencyValue),
                isAutomationEnabled: String(chore.isAutomationEnabled),
            },
        });
    }

    function handlePress(chore: Chore) {
        router.push({ pathname: "../(chores)/choreDetails", params: { id: chore.id } });
    }

    function handleDelete(id: string) {
        Alert.alert("Delete chore", "Are you sure you want to delete this chore?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteChore(id);
                        loadChores();
                    } catch (e) {
                        console.log(e);
                        Alert.alert("Error", "Could not delete chore.");
                    }
                },
            },
        ]);
    }
    
    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    Chores
                </Text>
                <View style={styles.headerActions}>
                    <SettingsButton />
                </View>
            </View>

            <View style={styles.viewToggle}>
                <Pressable
                    onPress={() => setViewMode("overdue")}
                    style={[
                        styles.toggleButton,
                        { backgroundColor: viewMode === "overdue" ? "#E53935" : isDark ? "#1E1E1E" : "#fff" },
                    ]}
                >
                    <Text style={{ color: viewMode === "overdue" ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                        Overdue
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setViewMode("all")}
                    style={[
                        styles.toggleButton,
                        { backgroundColor: viewMode === "all" ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff" },
                    ]}
                >
                    <Text style={{ color: viewMode === "all" ? "#fff" : isDark ? "#ccc" : "#333", fontWeight: "600" }}>
                        All
                    </Text>
                </Pressable>
            </View>

            {!loading && visibleChores.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        {viewMode === "overdue" ? "Nothing overdue. Nice!" : "No chores yet. Tap + to add one."}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={visibleChores}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    renderItem={({ item }) => (
                        <ChoreCard
                            chore={item}
                            onComplete={handleComplete}
                            onPress={handlePress}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />
            )}
        </View>
    );
}