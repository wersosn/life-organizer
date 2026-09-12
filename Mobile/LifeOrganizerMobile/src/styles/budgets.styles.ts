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
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 20
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 18,
        paddingHorizontal: 14,
        marginBottom: 16,
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
        color: "#8a3c5c",
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

    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#408bbc",
        borderRadius: 18,
        paddingVertical: 16,
        marginTop: 8,
    },

    buttonPressed: {
        opacity: 0.85,
    },

    buttonText: {
        color: "#f5f5f5",
        fontSize: 16,
        fontWeight: "700",
    },
});