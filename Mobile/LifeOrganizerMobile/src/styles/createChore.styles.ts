import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
        paddingVertical: 12, 
        borderRadius: 10, 
        borderWidth: 1, 
        alignItems: "center" 
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

    newCategoryButton: {
        alignSelf: "flex-start",
        marginBottom: 20,
    },

    newCategoryText: {
        color: "#4F7CFF",
        fontSize: 14,
        fontWeight: "600",
    },

    switchRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 24 
    },
});