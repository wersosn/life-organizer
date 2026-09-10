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

    iconBadge: {
        alignSelf: "center",
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
 
    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 32,
    },
 
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E4E4E4",
        borderRadius: 18,
        paddingHorizontal: 14,
        marginBottom: 16,
    },
 
    descriptionWrapper: {
        alignItems: "flex-start",
        paddingTop: 14,
    },
 
    inputIcon: {
        marginRight: 10,
    },
 
    descriptionIcon: {
        marginTop: 2,
    },
 
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: "#000",
    },
 
    description: {
        height: 110,
        textAlignVertical: "top",
        paddingTop: 0,
    },
 
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#4F7CFF",
        borderRadius: 18,
        paddingVertical: 16,
        marginTop: 8,
    },
 
    buttonPressed: {
        opacity: 0.85,
    },
 
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});