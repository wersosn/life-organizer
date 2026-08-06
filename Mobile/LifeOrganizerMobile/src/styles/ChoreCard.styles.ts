import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },

    overdueBorder: {
        borderLeftWidth: 3,
        borderLeftColor: "#E53935",
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
        backgroundColor: "#E5393520", 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 6 
    },

    overdueBadgeText: { 
        color: "#E53935", 
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
        backgroundColor: "#4F7CFF",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },

    completeButtonText: { 
        color: "#fff", 
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