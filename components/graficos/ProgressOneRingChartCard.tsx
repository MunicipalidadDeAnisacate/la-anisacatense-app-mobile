import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Card } from '@rneui/themed';
import { ProgressChart } from 'react-native-chart-kit';


interface ProgressOneRingChartCardProps {
    title?: string;
    data: { label: string, data: number, color: string };
    backgroundColor?: string;
    cantidad: number;
    width?: number;
    height?: number
    descripcion?: string;
    sinMargin?: boolean;
}



export default function ProgressOneRingChartCard({
    title,
    data,
    cantidad,
    backgroundColor = "#f4f4f4",
    width,
    height,
    descripcion,
    sinMargin = false
}: ProgressOneRingChartCardProps) {

    const { width: screenWidth } = useWindowDimensions();
    const cardWidth = width ?? screenWidth * 0.75;
    const cardHeight = height ?? cardWidth * 1;

    let computedRadius;
    let stroke;
    if (cardHeight < cardWidth) {
        computedRadius = Math.min(cardWidth, cardHeight) * 0.2;
        stroke = computedRadius * 0.4;
    } else {
        computedRadius = Math.min(cardWidth, cardHeight) * 0.2;
        stroke = computedRadius * 0.4;
    }

    return (
        <Card
            containerStyle={[
                styles.card,
                sinMargin ? { margin: 5, marginTop: 10, padding: 5 } : { padding: 15 },
                { backgroundColor: backgroundColor, width: width, height: height }
            ]}>

            {title &&
                <View>
                    <Text style={[{ textAlign: "center" }, !sinMargin && { marginBottom: 15 }]}>{title}</Text>
                </View>
            }

            <View style={descripcion ? { flexDirection: "row" } : {}}>
                <View style={[{ alignSelf: "center", transform: [{ rotate: '-90deg' }] }, descripcion ? { width: "60%" } : {}]}
                >
                    <ProgressChart
                        data={{
                            labels: [data.label],
                            data: [data.data],
                            colors: [data.color]
                        }}
                        width={cardWidth * 0.55}
                        height={cardHeight < cardWidth ? cardHeight * 0.65 : cardHeight * 0.55}
                        strokeWidth={stroke}
                        radius={computedRadius}
                        chartConfig={{
                            backgroundGradientFrom: backgroundColor,
                            backgroundGradientFromOpacity: 1,
                            backgroundGradientTo: backgroundColor,
                            backgroundGradientToOpacity: 1,
                            color: (opacity, index) => opacity < 0.3 ? `rgba(255, 255, 255, 0.9)` : data.color,
                            propsForLabels: {
                                fill: '#000'
                            },
                        }}
                        hideLegend
                        withCustomBarColorFromData
                    />
                </View>

                {descripcion ?
                    (
                        <View style={styles.labelsColumn}>
                            <Text style={[styles.labelText, { fontSize: 12, textAlign: "center" }]}>
                                {descripcion}
                            </Text>
                        </View>
                    ) : (
                        <View style={[styles.labelsRow, !sinMargin ? { marginTop: 15, marginLeft: 10, marginBottom: 10 } : { marginHorizontal: 10 }]}>
                            <View style={styles.labelItem}>
                                <Text style={[styles.labelText, sinMargin && {fontSize: 12}]}>
                                    {data.label}: {Math.round(data.data * 100)}%{'\n'}Total: {cantidad}
                                </Text>
                            </View>
                        </View>
                    )
                }

            </View>

        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 0,
        width: "100%",
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    labelsColumn: {
        width: "40%",
        justifyContent: "center"
    },
    labelsRow: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: "center"
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
