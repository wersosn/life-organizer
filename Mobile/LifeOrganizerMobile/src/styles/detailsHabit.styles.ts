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
        flexGrow: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 60,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        flex: 1,
        marginRight: 12,
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
 
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: "#030303",
    },

    headerActions: {
        flexDirection: "row",
        gap: 12,
    },

    iconButton: {
        padding: 4,
    },

    iconText: {
        fontSize: 20,
    },

    badgeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 6,
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },

    badgeText: {
        fontSize: 12,
        fontWeight: "600",
    },

    badgeSubtext: {
        fontSize: 13,
    },

    deadlineText: {
        fontSize: 13,
        marginBottom: 20,
    },

    streakCard: {
        alignItems: "center",
        backgroundColor: "#4CAF5015",
        borderRadius: 16,
        paddingVertical: 24,
        marginBottom: 20,
    },

    streakNumber: {
        fontSize: 40,
        fontWeight: "800",
        color: "#408bbc",
    },

    streakLabel: {
        fontSize: 14,
        color: "#408bbc",
        fontWeight: "600",
    },

    completeButton: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 32,
    },

    completeButtonText: {
        fontSize: 15,
        fontWeight: "600",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 16,
    },

    dayCell: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    dayCellText: {
        fontSize: 11,
        fontWeight: "600",
    },

    legendRow: {
        flexDirection: "row",
        gap: 20,
    },

    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    legendText: {
        fontSize: 12,
    },
    
    icon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
    },

    barChartContainer: {
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 20,
        marginBottom: 20,
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