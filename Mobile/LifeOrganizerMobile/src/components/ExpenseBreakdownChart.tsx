import { View, Text, Dimensions, StyleSheet, useColorScheme } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { CategoryBreakdown } from "@/types/transaction";
import { toPieChartData } from "@/utils/chartData";
import { styles } from "@/styles/expenseBreakdownChart.styles";

type Props = {
    breakdown: CategoryBreakdown[];
};

export function ExpenseBreakdownChart({ breakdown }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const screenWidth = Dimensions.get("window").width - 40;

    if (breakdown.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={{ color: isDark ? "#888" : "#999" }}>No expenses to show yet.</Text>
            </View>
        );
    }

    const data = toPieChartData(breakdown, isDark ? "#fff" : "#000");

    return (
        <View testID="expense-breakdown-chart">
            <PieChart
                data={data}
                width={screenWidth}
                height={200}
                chartConfig={{
                    color: () => (isDark ? "#fff" : "#000"),
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="0"
            />
        </View>
    );
}
