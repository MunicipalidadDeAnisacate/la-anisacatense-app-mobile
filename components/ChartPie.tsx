import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export type PieDataItem = {
    name: string;
    population: number;
    color?: string;
};

interface ChartPieProps {
    data: PieDataItem[];
    title?: string;
}

export const ChartPie: React.FC<ChartPieProps> = ({ data, title }) => {
    const { width: screenWidth } = useWindowDimensions();
    const chartWidth = Math.min(screenWidth * 0.8, 300);
    const chartHeight = 220;


    const defaultColors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];

    const total = data.reduce((sum, item) => sum + item.population, 0) || 1;

    const chartData = data.map((item, i) => ({
        name: item.name,
        population: item.population,
        color: item.color || defaultColors[i % defaultColors.length],
        legendFontColor: '#333',
        legendFontSize: 14,
    }));

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={[styles.chartWrapper, { width: chartWidth, alignSelf: 'center' }]}>
                <PieChart
                    data={chartData}
                    width={chartWidth}
                    height={chartHeight}
                    chartConfig={{ color: () => `rgba(0, 0, 0, 0.8)` }}
                    accessor="population"
                    backgroundColor="transparent"
                    absolute={false}
                    hasLegend={false}
                    paddingLeft={(chartWidth/4).toString()}
                    center={[0, 0]} // default
                />
            </View>

            <View style={styles.legendContainer}>
                {chartData.map((slice, i) => {
                    const percent = ((slice.population / total) * 100).toFixed(1);
                    return (
                        <View key={i} style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: slice.color }]} />
                            <Text style={styles.legendText}>
                                {slice.name} — {percent}% ({slice.population})
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        alignItems: 'center',
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center'
    },
    legendContainer: {
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: '#333',
    },
});
