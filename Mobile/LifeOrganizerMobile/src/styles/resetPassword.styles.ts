import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        paddingHorizontal: 32, 
        gap: 12 
    },

    title: { 
        fontSize: 28, 
        fontWeight: "700", 
        textAlign: "center" 
    },

    subtitle: { 
        fontSize: 14, 
        textAlign: "center", 
        marginBottom: 20 
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

    center: { 
        alignItems: "center" 
    },
});