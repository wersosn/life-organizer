import { View, Text } from "react-native";
import { router } from "expo-router";
import { styles } from "../../src/styles/finances.styles";

export default function FinancesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Finances</Text>
        </View>
    );
}