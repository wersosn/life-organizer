import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    textWrapper: { 
        flex: 1 
    },

    label: { 
        fontSize: 15, 
        fontWeight: "500" 
    },

    subtitle: { 
        fontSize: 12, 
        marginTop: 2 
    },

    chevron: { 
        fontSize: 22, 
        fontWeight: "300" 
    },
});