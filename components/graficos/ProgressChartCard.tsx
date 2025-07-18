import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from '@rneui/themed';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface ProgressChartCardProps {
    data: { labels: string[], data: number[], colors: string[] };
    totales: number[]
    backgroundColor?: string;
    width?: number;
}

export default function ProgressChartCard({ data, totales, backgroundColor = "#f4f4f4", width=screenWidth*0.55 }: ProgressChartCardProps) {
    return (
        <Card containerStyle={[styles.card, { backgroundColor: backgroundColor }]}>
            <View style={{alignSelf:"center", transform: [{ rotate: '-90deg' }]}}>
                <ProgressChart
                    data={data}
                    width={width}
                    height={200}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={{
                        backgroundGradientFrom: backgroundColor,
                        backgroundGradientFromOpacity: 1,
                        backgroundGradientTo: backgroundColor,
                        backgroundGradientToOpacity: 1,
                        // color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
                        color: (opacity, index) => opacity < 0.3 ? `rgba(255, 255, 255, 0.9)` : data.colors[index],
                        propsForLabels: {
                            fill: 'black'
                        },
                    }}
                    hideLegend
                    withCustomBarColorFromData
                />
            </View>
            <View style={styles.labelsRow}>
                {data.labels.map((label, i) => (
                    <View key={label} style={styles.labelItem}>
                        <View style={[styles.colorDot, { backgroundColor: data.colors[i] }]} />
                        <Text style={styles.labelText}>
                            {label}: {Math.round(data.data[i] * 100)}% - Total: {totales[i]}
                        </Text>
                    </View>
                ))}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "95%",
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    labelsRow: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: 15,
        marginLeft: 10,
        marginBottom: 10
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6
    },
    labelText: {
        fontSize: 14,
        color: '#374151'
    }
});
