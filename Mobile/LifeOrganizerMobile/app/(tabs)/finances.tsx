import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function FinancesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Finances</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 28,
        fontWeight: "600",
        marginTop: 60,
        marginLeft: 24,
    },

    fab: {
        position: "absolute",
        bottom: 35,
        alignSelf: "center",

        width: 68,
        height: 68,
        borderRadius: 34,

        backgroundColor: "#4F7CFF",

        justifyContent: "center",
        alignItems: "center",

        elevation: 6,
    },

    plus: {
        color: "white",
        fontSize: 38,
        marginTop: -2,
    },
});