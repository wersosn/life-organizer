import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        gap: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },

    content: { 
        flex: 1, 
        gap: 2 
    },

    category: { 
        fontSize: 15, 
        fontWeight: "600" 
    },

    description: { 
        fontSize: 12 
    },

    date: { 
        fontSize: 11 
    },

    amount: { 
        fontSize: 15, 
        fontWeight: "700" 
    },

    iconButton: { 
        padding: 4 
    },

    icon: { 
        width: 18, 
        height: 18, 
        resizeMode: "contain" 
    },
});