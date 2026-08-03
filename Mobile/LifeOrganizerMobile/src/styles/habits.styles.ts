import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
    },

    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#4F7CFF",
        alignItems: "center",
        justifyContent: "center",
    },

    addButtonText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "600",
        lineHeight: 24,
    },

    list: {
        paddingBottom: 40,
    },

    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
    },

    emptyText: {
        fontSize: 15,
    },

    viewToggle: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
    },

    headerActions: {
        flexDirection: "row", 
        gap: 10,
    },
});