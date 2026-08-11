import { getChoreCategories } from "@/api/choreCategoriesApi";
import { createChore } from "@/api/choresApi";
import { ChoreCategory, ChoreFrequency } from "@/types/chore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, useColorScheme, View } from "react-native";
import { styles } from "../../src/styles/createChore.styles";
import { CreateChoreCategoryModal } from "@/components/CreateChoreCaregoryModal";

const FREQUENCY_UNITS = [
    { value: ChoreFrequency.Days, label: "Days" },
    { value: ChoreFrequency.Weeks, label: "Weeks" },
    { value: ChoreFrequency.Months, label: "Months" },
];

export default function CreateChoreScreen() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [frequencyUnit, setFrequencyUnit] = useState<ChoreFrequency>(ChoreFrequency.Days);
    const [frequencyValue, setFrequencyValue] = useState("7");
    const [categories, setCategories] = useState<ChoreCategory[]>([]);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await getChoreCategories();
            setCategories(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingCategories(false);
        }
    }

    function handleCategoryCreated(newCategoryId: string) {
        setCategoryModalVisible(false);
        setCategoryId(newCategoryId);
        loadCategories();
    }

    async function handleCreate() {
        const parsedValue = parseInt(frequencyValue, 10);

        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        if (!categoryId) {
            setError("Select a category");
            return;
        }
        if (!frequencyValue || isNaN(parsedValue) || parsedValue <= 0) {
            setError("Enter a valid frequency");
            return;
        }

        setError(null);

        try {
            await createChore(name, categoryId, frequencyUnit, parsedValue, isAutomationEnabled, description || undefined);
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to create chore. Please try again.");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#121212" : "#F5F5F5" }]}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>New chore</Text>

                <TextInput
                    placeholder="Name"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Description (optional)"
                    placeholderTextColor="#888"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                />

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Category</Text>

                {loadingCategories ? (
                    <ActivityIndicator style={{ marginBottom: 20 }} />
                ) : categories.length === 0 ? (
                    <Text style={[styles.emptyText, { color: isDark ? "#888" : "#999" }]}>
                        No categories yet. Create one in Settings first.
                    </Text>
                ) : (
                    <View style={styles.chipRow}>
                        {categories.map(category => {
                            const isSelected = categoryId === category.id;
                            return (
                                <Pressable
                                    key={category.id}
                                    onPress={() => setCategoryId(category.id)}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: isSelected ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                                            borderColor: isDark ? "#333" : "#ccc",
                                        },
                                    ]}
                                >
                                    <Text style={{ color: isSelected ? "#fff" : isDark ? "#ccc" : "#333", fontSize: 13, fontWeight: "600" }}>
                                        {category.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                <Pressable onPress={() => setCategoryModalVisible(true)} style={styles.newCategoryButton}>
                    <Text style={styles.newCategoryText}>+ New category</Text>
                </Pressable>

                <CreateChoreCategoryModal
                    visible={categoryModalVisible}
                    onClose={() => setCategoryModalVisible(false)}
                    onCreated={handleCategoryCreated}
                />

                <Text style={[styles.label, { color: isDark ? "#ccc" : "#444" }]}>Repeat every</Text>
                <View style={styles.frequencyRow}>
                    <TextInput
                        value={frequencyValue}
                        onChangeText={setFrequencyValue}
                        keyboardType="number-pad"
                        style={[styles.input, styles.frequencyInput]}
                    />
                    <View style={styles.unitRow}>
                        {FREQUENCY_UNITS.map(unit => {
                            const isSelected = frequencyUnit === unit.value;
                            return (
                                <Pressable
                                    key={unit.value}
                                    onPress={() => setFrequencyUnit(unit.value)}
                                    style={[
                                        styles.unitChip,
                                        {
                                            backgroundColor: isSelected ? "#4F7CFF" : isDark ? "#1E1E1E" : "#fff",
                                            borderColor: isDark ? "#333" : "#ccc",
                                        },
                                    ]}
                                >
                                    <Text style={{ color: isSelected ? "#fff" : isDark ? "#ccc" : "#333", fontSize: 13, fontWeight: "600" }}>
                                        {unit.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: isDark ? "#ccc" : "#444", marginBottom: 0 }]}>
                        Automation enabled
                    </Text>
                    <Switch value={isAutomationEnabled} onValueChange={setIsAutomationEnabled} />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.buttonWrapper}>
                    <Button title="Create" onPress={handleCreate} color="#4F7CFF" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}