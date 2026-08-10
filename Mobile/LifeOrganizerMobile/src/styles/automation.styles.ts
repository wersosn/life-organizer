import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: 60, 
        paddingHorizontal: 20, 
        gap: 12 
    },

    center: { 
        alignItems: "center", 
        justifyContent: "center" 
    },

    title: { 
        fontSize: 28, 
        fontWeight: "700", 
        marginBottom: 12 
    },

    row: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: 16, 
        borderRadius: 12, 
        gap: 12 
    },

    rowText: { 
        flex: 1, 
        gap: 4 
    },

    rowLabel: { 
        fontSize: 15, 
        fontWeight: "600" 
    },

    rowSubtitle: { 
        fontSize: 13 
    },
});