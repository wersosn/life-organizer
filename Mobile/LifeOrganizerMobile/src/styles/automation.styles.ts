import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        position: "relative",
        overflow: "hidden",
    },

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

    subtitle: { 
        fontSize: 14, 
        marginBottom: 24 
    },

    input: { 
        padding: 14, 
        borderRadius: 12, 
        fontSize: 16, 
        marginBottom: 16 
    },

    errorText: { 
        color: "#8a3c5c", 
        fontSize: 13, 
        marginBottom: 12 
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