import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#030303",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },

    overdueBorder: {
        borderLeftWidth: 3,
        borderLeftColor: "#8a3c5c",
    },
    
    content: { 
        marginBottom: 10, 
        gap: 4 
    },

    nameRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 8 
    },

    name: {
        fontSize: 16, 
        fontWeight: "600", 
        flexShrink: 1 
    },

    overdueBadge: { 
        backgroundColor: "#8a3c5c20", 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 6 
    },

    overdueBadgeText: { 
        color: "#8a3c5c", 
        fontSize: 11, 
        fontWeight: "700" 
    },

    metaRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 8 
    },

    badge: { 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 6 
    },

    badgeText: { 
        fontSize: 11, 
        fontWeight: "600" 
    },

    subtitle: { 
        fontSize: 12 
    },

    lastCompleted: { 
        fontSize: 12, 
        fontWeight: "500" 
    },

    actions: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 8 
    },

    completeButton: {
        flex: 1,
        backgroundColor: "#408bbc",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },

    completeButtonText: { 
        color: "#f5f5f5", 
        fontSize: 16, 
        fontWeight: "700" 
    },

    iconButton: { 
        padding: 6 
    },

    icon: { 
        width: 18, 
        height: 18, 
        resizeMode: "contain" 
    },
});