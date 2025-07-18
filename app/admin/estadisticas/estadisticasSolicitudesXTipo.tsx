import React, { useEffect, useState } from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Card } from '@rneui/themed';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { getEstadisticasSolicitudesLuminariaDesde, getEstadisticasSolicitudesXTipo } from '@/api/petitions';
import ProgressChartCard from '@/components/graficos/ProgressChartCard';
import { principalColorTecnico, principalColorVecino } from '@/constants/Colors';
import ProgressOneRingChartCard from '@/components/graficos/ProgressOneRingChartCard';
import LoadingLogoPulse from '@/components/LoadingLogoAnimated';
import LuminariaStatsCard from '@/components/graficos/LuminariaStatsCard';


export default function estadisticasSolicitudesXTipo() {
    const { width: screenWidth } = useWindowDimensions();

    const [data, setData] = useState<EstadisticasSolicitudesXTipoResponse[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const [numeroMeses, setNumeroMeses] = useState<string>("-1");
    const [estadisticasLuminaria, setEstadisticasLuminaria] = useState<EstadisticasSolicitudesXSubTipoResponse | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {

            setLoading(true);
            try {
                const res = await getEstadisticasSolicitudesXTipo();
                if (res) {
                    setData(res);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }

        })();
    }, []);

    useEffect(() => {

        if (numeroMeses !== "-1") {
            (async () => {

                setLoading(true);

                try {
                    const data = await getEstadisticasSolicitudesLuminariaDesde(parseInt(numeroMeses));
                    if (data) {
                        setEstadisticasLuminaria(data);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }

            })();
        }

    }, [numeroMeses]);

    const renderSection = ({ item }: { item: EstadisticasSolicitudesXTipoResponse }) => {
        const total = item.cantSolicitudesResueltas + item.cantSolicitudesEnProceso;

        const dataChart = [
            item.cantSolicitudesResueltas / total,
            item.cantSolicitudesEnProceso / total,
        ];

        return (
            <Card containerStyle={styles.card}>
                <TouchableOpacity
                    style={styles.header}
                    onPress={() =>
                        setExpanded(prev => ({
                            ...prev,
                            [item.nombreTipoSolicitud]: !prev[item.nombreTipoSolicitud],
                        }))
                    }
                >
                    <Text style={styles.title}>{item.nombreTipoSolicitud}</Text>
                    <Ionicons
                        name={expanded[item.nombreTipoSolicitud] ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#333"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        setExpanded(prev => ({
                            ...prev,
                            [item.nombreTipoSolicitud]: !prev[item.nombreTipoSolicitud],
                        }))
                    }
                >
                    <ProgressChartCard
                        data={{
                            labels: ["Resueltas", "En Proceso"],
                            data: [dataChart[0], dataChart[1]],
                            colors: [principalColorTecnico, principalColorVecino]
                        }}
                        totales={[item.cantSolicitudesResueltas, item.cantSolicitudesEnProceso]}
                    />
                </TouchableOpacity>

                {/* SubTipos collapsible */}
                <Collapsible collapsed={!expanded[item.nombreTipoSolicitud]}>
                    {item.estadisticasSolicitudesXSubTipo.map(sub => {

                        const totalSub =
                            sub.cantSolicitudesResueltas +
                            sub.cantSolicitudesEnProceso;

                        const pctSub = [
                            sub.cantSolicitudesResueltas / totalSub,
                            sub.cantSolicitudesEnProceso / totalSub
                        ];

                        return (
                            <View key={sub.idSubTipoSolicitud} style={styles.subCard}>
                                <Text style={styles.subTitle}>{sub.nombreSubTipoSolicitud}</Text>

                                <View style={{ alignSelf: "center" }}>
                                    <ProgressOneRingChartCard
                                        title={"Solicitudes en proceso"}
                                        data={{ label: "En Proceso", data: pctSub[1], color: principalColorVecino }}
                                        cantidad={sub.cantSolicitudesEnProceso}
                                        descripcion={`En el momento hay ${sub.cantSolicitudesEnProceso} solicitudes en proceso de ser reparadas. Equivale a un ${Math.round(pctSub[1] * 100)}% del solicitudes del subtipo.`}
                                        width={screenWidth * 0.75}
                                        height={screenWidth * 0.55}
                                    />
                                </View>

                                <View style={{ marginHorizontal: 10, flexDirection: "row", justifyContent: "center", alignSelf: "center", width: screenWidth * 0.75 }}>
                                    <View style={{ width: "50%" }}>
                                        <ProgressOneRingChartCard
                                            title={"Resueltas"}
                                            data={{ label: "Resueltas", data: pctSub[0], color: principalColorTecnico }}
                                            cantidad={sub.cantSolicitudesResueltas}
                                            width={screenWidth * 0.36}
                                            height={screenWidth * 0.47}
                                            sinMargin
                                        />
                                    </View>

                                </View>

                                {sub.idSubTipoSolicitud === 1 &&
                                    <LuminariaStatsCard
                                        numeroMeses={numeroMeses}
                                        onChangeMeses={value => {
                                            setNumeroMeses(value);
                                            setExpanded({});
                                        }}
                                        data={parseInt(numeroMeses) !== -1 && estadisticasLuminaria ? estadisticasLuminaria : sub}
                                        isLoading={loading}
                                    />
                                }

                            </View>
                        );
                    })}
                </Collapsible>
            </Card>
        );
    };


    if (loading) return <LoadingLogoPulse isLoading={loading} />

    if (!data || data.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aún no hay estadísticas de solicitudes para mostrar.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <SectionList
                sections={[{ title: '', data }]}
                keyExtractor={item => item.nombreTipoSolicitud}
                renderItem={renderSection}
                contentContainerStyle={{ paddingVertical: 10, paddingBottom: 30 }}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6'
    },
    card: {
        borderRadius: 12,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 25
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: '600'
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8
    },
    stat: {
        fontSize: 14
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
    subCard: {
        marginTop: 10,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#ddd',
        marginBottom: 5
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4
    },
    pickerContainer: {
        marginVertical: 2,
        marginBottom: 12,
        width: "100%",
    },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#666', textAlign: "center" },
});