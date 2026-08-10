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
        borderColor: "#4F7CFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    checked: {
        backgroundColor: "#4F7CFF",
    },

    checkmark: {
        color: "#FFFFFF",
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
        borderLeftColor: "#4F7CFF",
    },

    automationBadge: {
        backgroundColor: "#4F7CFF20",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    
    automationBadgeText: {
        color: "#4F7CFF",
        fontSize: 11,
        fontWeight: "700",
    },
})