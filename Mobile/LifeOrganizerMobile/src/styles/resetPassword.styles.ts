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
        backgroundColor: "#f5f5f5", 
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