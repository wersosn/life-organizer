import { Text, View } from "react-native";
import { styles } from "@/styles/settings.styles";

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
        </View>
    );
}