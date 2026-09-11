import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../../styles/BackButton.styles";

export function BackButton() {
    const isDark = useColorScheme() === "dark";
    const insets = useSafeAreaInsets();

    return (
        <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [
                styles.button,
                { top: insets.top + 8, backgroundColor: isDark ? "#030303" : "#F5F5F5" },
                pressed && styles.pressed,
            ]}
        >
            <Ionicons name="chevron-back" size={22} color={isDark ? "#F5F5F5" : "#030303"} />
        </Pressable>
    );
}