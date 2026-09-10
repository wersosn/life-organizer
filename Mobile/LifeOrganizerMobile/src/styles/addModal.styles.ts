import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
    },

    menu: {
        width: "100%",
        backgroundColor: "#F5F5F5",
        borderRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 8,
    },

    menuHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    menuTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0B0B0B",
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        gap: 12,
    },

    optionLast: {
        borderBottomWidth: 0,
    },

    optionPressed: {
        opacity: 0.5,
    },

    optionIcon: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
    },

    optionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        color: "#0B0B0B",
    },
});