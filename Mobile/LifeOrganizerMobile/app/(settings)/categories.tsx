import { deleteCategory, getCategories } from "@/api/transactionCategoriesApi";
import { CreateCategoryModal } from "@/components/CreateCategoryModal";
import { EditCategoryModal } from "@/components/EditCategoryModal";
import { styles } from "@/styles/settingsCategories.styles";
import { TransactionCategory, TransactionType } from "@/types/transaction";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Image, Pressable, useColorScheme, Text, View } from "react-native";

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [createType, setCreateType] = useState<TransactionType>(TransactionType.Expense);
    const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    async function loadCategories() {
        try {
            const data = await getCategories();
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

    function handleEdit(category: TransactionCategory) {
        setEditingCategory(category);
    }

    function handleUpdated() {
        setEditingCategory(null);
        loadCategories();
    }

    function handleDelete(category: TransactionCategory) {
        Alert.alert(
            "Delete category",
            `Delete "${category.name}"? This is only possible if no transactions use it.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCategory(category.id);
                            loadCategories();
                        } catch (e) {
                            console.log(e);
                            Alert.alert("Error", "This category has transactions assigned to it and can't be deleted.");
                        }
                    },
                },
            ]
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Categories</Text>
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
                                <View
                                    style={[
                                        styles.badge,
                                        { backgroundColor: item.type === TransactionType.Expense ? "#E5393520" : "#4CAF5020" },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            { color: item.type === TransactionType.Expense ? "#E53935" : "#4CAF50" },
                                        ]}
                                    >
                                        {item.type === TransactionType.Expense ? "Expense" : "Income"}
                                    </Text>
                                </View>
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

            <CreateCategoryModal
                visible={categoryModalVisible}
                onClose={() => setCategoryModalVisible(false)}
                onCreated={handleCreate}
            />

            <EditCategoryModal
                visible={editingCategory !== null}
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                onUpdated={handleUpdated}
            />
        </View>
    );
}
