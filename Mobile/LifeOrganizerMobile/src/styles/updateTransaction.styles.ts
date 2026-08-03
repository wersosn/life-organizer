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

    segmentedControl: { 
        flexDirection: "row", 
        gap: 8, 
        marginBottom: 20 
    },

    segment: { 
        flex: 1, 
        paddingVertical: 10, 
        borderRadius: 10, 
        borderWidth: 1, 
        alignItems: "center" 
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
});