import { ChoreCategory } from "@/types/chore";
import { deleteChoreCategory, getChoreCategories } from "@/api/choreCategoriesApi";
import { useCallback, useState } from "react";
import { Alert, FlatList, Image, Pressable, Text, useColorScheme, View } from "react-native";
import { styles } from "@/styles/settingsCategories.styles";
import { useFocusEffect } from "expo-router";
import { CreateChoreCategoryModal } from "@/components/CreateChoreCaregoryModal";
import { EditChoreCategoryModal } from "@/components/EditChoreCategoryModal";

export default function ChoreCategoriesScreen() {
    const [categories, setCategories] = useState<ChoreCategory[]>([]);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<ChoreCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadCategories() {
        try {
            const data = await getChoreCategories();
            setCategories(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadCategories();
        }, [])
    );

    function handleCreate(newCategoryId: string) {
        setCategoryModalVisible(false);
        setCategoryId(newCategoryId);
        loadCategories();
    }

    function handleEdit(category: ChoreCategory) {
        setEditingCategory(category);
    }

    function handleUpdated() {
        setEditingCategory(null);
        loadCategories();
    }

    function handleDelete(category: ChoreCategory) {
        Alert.alert(
            "Delete category",
            `Delete "${category.name}"? This is only possible if no chores use it.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteChoreCategory(category.id);
                            loadCategories();
                        } catch (e) {
                            console.log(e);
                            Alert.alert("Error", "This category has chores assigned to it and can't be deleted.");
                        }
                    },
                },
            ]
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Chore categories</Text>
                <Pressable onPress={() => setCategoryModalVisible(true)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>

            {!loading && categories.length === 0 ? (
                <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>No categories yet.</Text>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={[styles.row, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                            <View style={styles.rowContent}>
                                <Text style={[styles.name, { color: isDark ? "#fff" : "#000" }]}>{item.name}</Text>
                            </View>

                            <View style={styles.actions}>
                                <Pressable onPress={() => handleEdit(item)} hitSlop={10} style={styles.iconButton}>
                                    <Image
                                        source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                                        style={styles.icon}
                                    />
                                </Pressable>
                                <Pressable onPress={() => handleDelete(item)} hitSlop={10} style={styles.iconButton}>
                                    <Image
                                        source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                                        style={styles.icon}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            )}

            <CreateChoreCategoryModal
                visible={categoryModalVisible}
                onClose={() => setCategoryModalVisible(false)}
                onCreated={handleCreate}
            />

            <EditChoreCategoryModal
                visible={editingCategory !== null}
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                onUpdated={handleUpdated}
            />
        </View>
    );
}