import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        gap: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },

    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },

    checkmark: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    content: {
        flex: 1,
        gap: 4,
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
    },

    nameCompleted: {
        opacity: 0.5,
        textDecorationLine: "line-through",
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },

    badgeText: {
        fontSize: 11,
        fontWeight: "600",
    },

    subtitle: {
        fontSize: 12,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
    },

    iconButton: {
        marginLeft: 14,
    },
    
    icon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
    },
});