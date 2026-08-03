import { styles } from "@/styles/SettingsRow.styles";
import { Pressable, useColorScheme, Text, View } from "react-native";

type Props = {
    label: string;
    onPress: () => void;
    destructive?: boolean;
    subtitle?: string;
};

export function SettingsRow({ label, onPress, destructive, subtitle }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.row,
                { backgroundColor: pressed ? (isDark ? "#2A2A2A" : "#F0F0F0") : "transparent" },
            ]}
        >
            <View style={styles.textWrapper}>
                <Text
                    style={[
                        styles.label,
                        { color: destructive ? "#E53935" : isDark ? "#fff" : "#000" },
                    ]}
                >
                    {label}
                </Text>
                {subtitle && (
                    <Text style={[styles.subtitle, { color: isDark ? "#888" : "#999" }]}>{subtitle}</Text>
                )}
            </View>
            {!destructive && (
                <Text style={[styles.chevron, { color: isDark ? "#555" : "#ccc" }]}>›</Text>
            )}
        </Pressable>
    );
}
