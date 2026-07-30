import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 32,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
    },

    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
    },

    description: {
        height: 120,
        textAlignVertical: "top",
    },
});