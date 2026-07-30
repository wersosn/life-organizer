import { View, Text } from "react-native";
import { router } from "expo-router";
import { styles } from "../../src/styles/chores.styles";

export default function ChoresScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chores</Text>
        </View>
    );
}