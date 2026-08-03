import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        paddingTop: 60, 
        paddingBottom: 60 
    },

    title: { 
        fontSize: 28, 
        fontWeight: "700", 
        paddingHorizontal: 20, 
        marginBottom: 24 
    },

    sectionHeader: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        paddingHorizontal: 20,
        marginBottom: 8,
        marginTop: 8,
    },

    section: {
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 24,
        overflow: "hidden",
    },

    divider: { 
        height: 1, 
        marginLeft: 16 
    },
});