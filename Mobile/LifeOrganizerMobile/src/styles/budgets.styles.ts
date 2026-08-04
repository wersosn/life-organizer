import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    list: {
        paddingBottom: 40,
    },
    
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 80,
    },

    emptyText: {
        fontSize: 15,
        textAlign: "center",
    },

    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    categoryName: {
        fontSize: 15,
        fontWeight: "600",
    },

    actions: {
        flexDirection: "row",
        gap: 4,
    },

    iconButton: {
        padding: 4,
    },

    icon: {
        width: 18,
        height: 18,
        resizeMode: "contain",
    },

    amountsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    spentText: {
        fontSize: 13,
        fontWeight: "600",
    },

    limitText: {
        fontSize: 13,
    },

    barTrack: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 4,
    },

    barFill: {
        height: "100%",
        borderRadius: 4,
    },

    percentageText: {
        fontSize: 11,
        textAlign: "right",
    },

    container: { 
        flex: 1, 
        justifyContent: "center", 
        paddingHorizontal: 32 
    },

    title: { 
        fontSize: 30, 
        fontWeight: "700", 
        textAlign: "center", 
        marginBottom: 40 
    },

    input: { 
        backgroundColor: "#fff", 
        borderWidth: 1, 
        borderColor: "#ccc", 
        borderRadius: 12, 
        padding: 14, 
        fontSize: 16, 
        marginBottom: 20 
    },

    label: { 
        fontSize: 14, 
        fontWeight: "600", 
        marginBottom: 8 
    },

    categoryRow: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        gap: 8, 
        marginBottom: 20 
    },

    categoryChip: { 
        paddingHorizontal: 12, 
        paddingVertical: 8, 
        borderRadius: 8,
        borderWidth: 1 
    },

    errorText: { 
        color: "#E53935", 
        fontSize: 13, 
        marginBottom: 12, 
        textAlign: "center" 
    },

    buttonWrapper: { 
        marginTop: 8 
    },

    categoryDisplay: { 
        padding: 14, 
        borderRadius: 12, 
        borderWidth: 1, 
        marginBottom: 20 
    },
});