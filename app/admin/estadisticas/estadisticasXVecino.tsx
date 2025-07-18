import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import LoadingLogoPulse from '@/components/LoadingLogoAnimated';
import ProgressOneRingChartCard from '@/components/graficos/ProgressOneRingChartCard';
import { principalColorVecino } from '@/constants/Colors';
import { getEstadisticasSolicitudesXVecino } from '@/api/petitions';
import { Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';


export default function EstadisticasXVecino() {
    const { width: screenWidth } = useWindowDimensions();
    const [estadisticas, setEstadisticas] = useState<EstadisticasPorVecinoResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const resp = await getEstadisticasSolicitudesXVecino();
                setEstadisticas(resp);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading || !estadisticas) return <LoadingLogoPulse isLoading={loading} />;

    const porcentaje = estadisticas.cantidadVecinosSolicitaron / estadisticas.cantidadVecinosRegistrados;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Gráfico general */}
                <View style={styles.chartContainer}>
                    <Text style={styles.title}>Vecinos que realizan solicitudes</Text>
                    <Text style={styles.subTitle}>
                        Registrados: {estadisticas.cantidadVecinosRegistrados} · Con solicitudes: {estadisticas.cantidadVecinosSolicitaron}
                    </Text>
                    <ProgressOneRingChartCard
                        title="Usuarios activos"
                        data={{ label: 'Solicitantes', data: porcentaje, color: principalColorVecino }}
                        cantidad={estadisticas.cantidadVecinosSolicitaron}
                        width={screenWidth * 0.85}
                        height={screenWidth * 0.85}
                    />
                </View>

                {/* Lista top 10 generales */}
                <FlatList
                    scrollEnabled={false}
                    data={estadisticas.vecinosMasSolicitaron}
                    keyExtractor={(item) => item.dni}
                    ListHeaderComponent={<Text style={styles.sectionHeader}>Usuarios con más solicitudes</Text>}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <Card containerStyle={styles.card}>
                            <View style={styles.cardRow}>
                                <View style={styles.usuarioColumn}>
                                    <View style={styles.row}>
                                        <Ionicons name="person" size={20} color="#374151" style={{ marginRight: 8 }} />
                                        <Text
                                            style={styles.name}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.nombreVecino} {item.apellidoVecino}
                                        </Text>
                                    </View>
                                    <Text style={styles.dni}>D.N.I: {item.dni}</Text>
                                </View>
                                <View style={styles.statsColumn}>
                                    <View style={styles.statItem}>
                                        <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                                        <Text>{item.cantSolicitudesResueltas}</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <View style={[styles.dot, { backgroundColor: principalColorVecino }]} />
                                        <Text>{item.cantSolicitudesProceso}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    )}
                />

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    chartContainer: { width: '100%', marginVertical: 20, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '600', color: '#111827', textAlign: 'center' },
    subTitle: { fontSize: 15, fontWeight: '400', color: '#374151', marginTop: 4, textAlign: 'center' },
    sectionHeader: {
        marginTop: 20,
        marginHorizontal: 15,
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    list: { paddingHorizontal: 15, paddingBottom: 20 },
    card: {
        width: '100%',
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 0
    },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
    usuarioColumn: { flex: 0.75, justifyContent: 'center' },
    statsColumn: { flex: 0.25, justifyContent: 'space-around', alignItems: 'flex-end' },
    row: { flexDirection: 'row', alignItems: 'center' },
    name: { fontSize: 16, fontWeight: '500' },
    dni: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    statItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});
