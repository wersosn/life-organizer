import { router } from "expo-router";
import { Image, Pressable, useColorScheme } from "react-native";
import { styles } from "../styles/SettingsButton.styles";

export function SettingsButton() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <Pressable onPress={() => router.push("/(settings)/settings")} hitSlop={10} style={styles.button} testID="settings-button">
            <Image
                source={isDark ? require("@/assets/images/setting-light.png") : require("@/assets/images/setting-dark.png")}
                style={styles.icon}
            />
        </Pressable>
    );
}