import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 32,
    },

    card: {
        width: "100%",
        borderRadius: 16,
        padding: 20,
    },

    title: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 16,
    },

    input: {
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        marginBottom: 8,
    },
    
    errorText: {
        color: "#E53935",
        fontSize: 13,
        marginBottom: 8,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 12,
    },

    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },

    createButton: {
        backgroundColor: "#4F7CFF",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});