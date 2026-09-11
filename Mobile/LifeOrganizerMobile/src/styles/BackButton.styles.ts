import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        position: "absolute",
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.08)",
    },
    
    pressed: {
        opacity: 0.6,
    },
});