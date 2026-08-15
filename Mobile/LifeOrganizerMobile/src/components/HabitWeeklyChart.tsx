import { View, Dimensions, useColorScheme } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { HabitCompletion } from "@/types/habit";
import { toWeeklyCompletionChart } from "@/utils/chartData";

type Props = {
    completions: HabitCompletion[];
};

export function HabitWeeklyChart({ completions }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const screenWidth = Dimensions.get("window").width - 40;
    const chartData = toWeeklyCompletionChart(completions);

    return (
        <View testID="habit-weekly-chart">
            <BarChart
                data={chartData}
                width={screenWidth}
                height={160}
                fromZero
                showValuesOnTopOfBars={false}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    backgroundGradientFrom: isDark ? "#1E1E1E" : "#fff",
                    backgroundGradientTo: isDark ? "#1E1E1E" : "#fff",
                    color: () => "#4F7CFF",
                    labelColor: () => (isDark ? "#ccc" : "#666"),
                    barPercentage: 0.6,
                    propsForBackgroundLines: { strokeWidth: 0 },
                }}
                withInnerLines={false}
                style={{ borderRadius: 12 }}
            />
        </View>
    );
}