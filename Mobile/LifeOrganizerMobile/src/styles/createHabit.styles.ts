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
        justifyContent: "center",
        paddingHorizontal: 32,
    },

    iconBadge: {
        alignSelf: "center",
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
 
    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 32,
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
 
    description: {
        height: 110,
        textAlignVertical: "top",
        paddingTop: 0,
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

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },

    segmentedControl: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20,
    },

    segment: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
    },

    daysRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },

    dayChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },

    errorText: {
        color: "#8a3c5c",
        fontSize: 13,
        marginBottom: 12,
        textAlign: "center",
    },

    deadlineRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 16, 
        marginBottom: 20
    },

    deadlineButton: { 
        flex: 1, 
        paddingVertical: 12, 
        paddingHorizontal: 14, 
        borderRadius: 10, 
        borderWidth: 1 
    },

    clearText: { 
        color: "#8a3c5c", 
        fontSize: 13, 
        fontWeight: "600" 
    },
    
    buttonWrapper: {
        marginTop: 8,
    },

    switchRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 24,
    },
});