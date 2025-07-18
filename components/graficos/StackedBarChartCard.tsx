import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from '@rneui/themed';
import { StackedBarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface StackedBarChartCardProps {
  data: {
    labels: string[];
    legend: string[];
    data: number[][];
    barColors: string[];
  };
  chartConfig?: object;
  width?: number;
  height?: number;
  backgroundColor?: string;
  verticalLabels?: boolean
}

export default function StackedBarChartCard({
  data,
  chartConfig,
  width = screenWidth * 0.75,
  height = 220,
  backgroundColor = "#f4f4f4",
  verticalLabels = true
}: StackedBarChartCardProps) {

  const defaultConfig = {
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: () => `rgba(0,0,0,0.6)`,
    barPercentage: verticalLabels ? 0.5 : 0.2,
    useShadowColorFromDataset: false,
    propsForVerticalLabels: {
      fontSize: verticalLabels ? 12 : 10,
      rotation: -45,
      translateX: -8, 
    }
  };

  return (
    <Card containerStyle={[styles.card, { backgroundColor: backgroundColor }]}>
      <StackedBarChart
        data={{
          labels: data.labels,
          legend: data.legend,
          data: data.data,
          barColors: data.barColors,
        }}
        width={width}
        height={height}
        chartConfig={chartConfig || defaultConfig}
        style={styles.chart}
        hideLegend={true}
      />
      <View style={styles.legendRow}>
        {data.legend.map((label, i) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: data.barColors[i] }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
  },
});
