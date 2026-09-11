import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        position: "relative",
        overflow: "hidden",
    },
 
    blobTop: {
        position: "absolute",
        top: 0,
        left: -30,
    },
 
    blobBottom: {
        position: "absolute",
        bottom: 0,
        left: -30,
    },
    
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
        backgroundColor: "#408bbc",
        alignItems: "center",
        justifyContent: "center",
    },

    addButtonText: {
        color: "#F5F5F5",
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