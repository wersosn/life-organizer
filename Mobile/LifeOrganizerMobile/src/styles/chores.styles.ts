import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 28,
        fontWeight: "600",
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

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
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
});