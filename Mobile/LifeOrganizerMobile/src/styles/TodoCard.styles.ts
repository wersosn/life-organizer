import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#f5f5f5",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 3,
    },

    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#408bbc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    checked: {
        backgroundColor: "#408bbc",
    },

    checkmark: {
        color: "#F5F5F5",
        fontSize: 17,
        fontWeight: "700",
    },

    content: {
        flex: 1,
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
    },

    completedText: {
        textDecorationLine: "line-through",
        opacity: 0.5,
    },

    description: {
        marginTop: 5,
        fontSize: 14,
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

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
    },

    automationBorder: {
        borderLeftWidth: 3,
        borderLeftColor: "#408bbc",
    },

    automationBadge: {
        backgroundColor: "#408bbc20",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    
    automationBadgeText: {
        color: "#408bbc",
        fontSize: 11,
        fontWeight: "700",
    },
})