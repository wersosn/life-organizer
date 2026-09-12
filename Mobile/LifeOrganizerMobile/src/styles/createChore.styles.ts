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

    label: { 
        fontSize: 14, 
        fontWeight: "600", 
        marginBottom: 8 
    },

    chipRow: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        gap: 8, 
        marginBottom: 20 
    },
    
    chip: { 
        paddingHorizontal: 12, 
        paddingVertical: 8, 
        borderRadius: 8, 
        borderWidth: 1 
    },

    emptyText: { 
        fontSize: 13, 
        marginBottom: 20 
    },

    frequencyRow: { 
        flexDirection: "row", 
        gap: 10, 
        marginBottom: 20 
    },

    frequencyInput: { 
        width: 70, 
        marginBottom: 0, 
        textAlign: "center" 
    },

    unitRow: { 
        flex: 1, 
        flexDirection: "row", 
        gap: 6 
    },

    unitChip: { 
        flex: 1, 
        paddingVertical: 15, 
        borderRadius: 10, 
        borderWidth: 1, 
        alignItems: "center" 
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

    newCategoryButton: {
        alignSelf: "flex-start",
        marginBottom: 20,
    },

    newCategoryText: {
        color: "#408bbc",
        fontSize: 14,
        fontWeight: "600",
    },

    switchRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 24 
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