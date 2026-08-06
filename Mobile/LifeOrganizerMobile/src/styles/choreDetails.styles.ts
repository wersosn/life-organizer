import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        paddingTop: 60, 
        paddingHorizontal: 20, 
        paddingBottom: 60 
    },

    center: { 
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center" 
    },

    headerRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        marginBottom: 8 
    },
    
    title: { 
        fontSize: 26, 
        fontWeight: "700", 
        flex: 1, 
        marginRight: 12 
    },

    headerActions: { 
        flexDirection: "row", 
        gap: 12 
    },

    iconButton: { 
        padding: 4 
    },

    icon: { 
        width: 20, 
        height: 20, 
        resizeMode: "contain" 
    },

    description: { 
        fontSize: 14, 
        marginBottom: 12 
    },

    badgeRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10, 
        marginBottom: 20 
    },

    badge: { 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8 
    },

    badgeText: { 
        fontSize: 12, 
        fontWeight: "600" 
    },

    badgeSubtext: { 
        fontSize: 13 
    },

    statusCard: { 
        borderRadius: 14, 
        padding: 18, 
        marginBottom: 20 
    },

    statusText: { 
        fontSize: 18, 
        fontWeight: "700", 
        marginBottom: 4 
    },

    statusSubtext: { 
        fontSize: 13 
    },

    completeButton: { 
        backgroundColor: "#4F7CFF", 
        borderRadius: 12, 
        paddingVertical: 14, 
        alignItems: "center", 
        marginBottom: 10 
    },

    completeButtonText: { 
        color: "#fff", 
        fontSize: 15, 
        fontWeight: "700" 
    },

    undoButton: { 
        alignItems: "center", 
        marginBottom: 32, 
        paddingVertical: 6 
    },

    undoButtonText: { 
        color: "#E53935", 
        fontSize: 13, 
        fontWeight: "600" 
    },

    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "700", 
        marginBottom: 12 
    },

    historyRow: { 
        padding: 12, 
        borderRadius: 10, 
        marginBottom: 8, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center" 
    },

    historyDate: { 
        fontSize: 14, 
        fontWeight: "600" 
    },
    
    historyNotes: { 
        fontSize: 13, 
        flex: 1, 
        textAlign: "right", 
        marginLeft: 12 
    },
});