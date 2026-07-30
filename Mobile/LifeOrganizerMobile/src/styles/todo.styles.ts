import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
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

    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
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