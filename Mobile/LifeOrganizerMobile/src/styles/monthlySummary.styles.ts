import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        paddingTop: 60, 
        paddingHorizontal: 20, 
        paddingBottom: 60 
    },

    monthSelector: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 24, 
        marginBottom: 24 
    },

    arrow: { 
        fontSize: 28, 
        fontWeight: "300", 
        paddingHorizontal: 12 
    },

    monthLabel: { 
        fontSize: 20, 
        fontWeight: "700" 
    },

    totalsCard: { 
        borderRadius: 16, 
        padding: 20, 
        marginBottom: 28 
    },

    totalsRow: { 
        flexDirection: "row", 
        justifyContent: "space-around" 
    },

    totalsItem: { 
        alignItems: "center" 
    },

    totalsLabel: { 
        fontSize: 12, 
        marginBottom: 4 
    },

    totalsValue: { 
        fontSize: 17, 
        fontWeight: "700" 
    },

    balanceDivider: { 
        height: 1, 
        backgroundColor: "#00000010", 
        marginVertical: 14 
    },

    balanceRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center" 
    },

    balanceLabel: { 
        fontSize: 14, 
        fontWeight: "600" 
    },

    balanceValue: { 
        fontSize: 22, 
        fontWeight: "800" 
    },

    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "700", 
        marginBottom: 16 
    },

    categoryRow: { 
        marginBottom: 16 
    },

    categoryHeader: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginBottom: 6 
    },

    categoryName: { 
        fontSize: 14, 
        fontWeight: "600" 
    },

    categoryAmount: { 
        fontSize: 14 
    },

    barTrack: { 
        height: 8, 
        borderRadius: 4, 
        overflow: "hidden" 
    },
    
    barFill: { 
        height: "100%", 
        backgroundColor: "#4F7CFF", 
        borderRadius: 4 
    },
});