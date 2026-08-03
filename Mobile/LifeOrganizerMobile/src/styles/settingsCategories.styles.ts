import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: 60, 
        paddingHorizontal: 20 
    },

    header: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 20 
    },

    title: { 
        fontSize: 26, 
        fontWeight: "700" 
    },

    addButton: { 
        width: 34, 
        height: 34, 
        borderRadius: 17, 
        backgroundColor: "#4F7CFF", 
        alignItems: "center", 
        justifyContent: "center" 
    },

    addButtonText: { 
        color: "#fff", 
        fontSize: 20, 
        fontWeight: "600", 
        lineHeight: 22 
    },

    emptyText: { 
        textAlign: "center", 
        marginTop: 40, 
        fontSize: 14 
    },

    list: { 
        paddingBottom: 40 
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
    },

    rowContent: { 
        flex: 1, 
        gap: 6 
    },

    name: { 
        fontSize: 15, 
        fontWeight: "600" 
    },

    badge: { 
        alignSelf: "flex-start", 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 6 
    },

    badgeText: { 
        fontSize: 11, 
        fontWeight: "600" 
    },

    actions: { 
        flexDirection: "row", 
        gap: 4 
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