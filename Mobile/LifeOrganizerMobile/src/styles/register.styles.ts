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
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
    },

    input: {
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 20,
    },

    buttonContainer: {
        marginTop: 10,
        marginBottom: 30,
        borderRadius: 24,
        overflow: "hidden",
    },

    link: {
        textAlign: "center",
        fontSize: 15,
    },
});