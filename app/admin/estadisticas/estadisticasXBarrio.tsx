import React, { useEffect, useState } from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text, View, TextInput } from 'react-native';
import { getEstadisticasXBarrio } from '@/api/petitions';
import { Card } from '@rneui/themed';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LoadingLogoPulse from '@/components/LoadingLogoAnimated';
import { barrios } from '@/constants/barriosAnisacateList';
import RNPickerSelect from 'react-native-picker-select';
import { tiposReclamosFilters, subtiposPorTipoFilters, subTipoReclamosFilters } from '@/constants/filtros';
import { pickerSelectStyles } from '@/styles/pickerStyles';

export default function estadisticasXBarrio() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [tipoFilter, setTipoFilter] = useState("0");
    const [subtipoFilter, setSubtipoFilter] = useState(null);


    const fetchData = async (tipo, subtipo) => {
        setLoading(true);
        try {
            const res = await getEstadisticasXBarrio(tipo, subtipo);
            const dataMap = new Map();
            res.forEach(item => dataMap.set(item.nombreBarrio, item));

            const barriosCompletos = barrios.map(b => {
                const item = dataMap.get(b.nameFromBack);
                return item || { zona: b.zona, nombreBarrio: b.nameFromBack, cantSolicitudesResueltas: 0, cantSolicitudesEnProceso: 0 };
            });

            const grouped = barriosCompletos.reduce((acc, item) => {
                const zonaKey = `Zona ${item.zona}`;
                if (!acc[zonaKey]) acc[zonaKey] = [];
                acc[zonaKey].push(item);
                return acc;
            }, {});

            const sections = Object.keys(grouped).sort().map(z => ({
                title: z,
                data: grouped[z].sort((a, b) => b.cantSolicitudesEnProceso - a.cantSolicitudesEnProceso)
            }));

            setData(sections);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };


    useEffect(() => {
        fetchData(null, null);
    }, []);


    useEffect(() => {
        if (tipoFilter === "0") {
            setSubtipoFilter(null);
            fetchData(null, null);
        } else {
            fetchData(tipoFilter, null);
        }
    }, [tipoFilter]);


    useEffect(() => {
        if (subtipoFilter !== "Todos" && subtipoFilter !== null) {
            const subTipoFilterId = subTipoReclamosFilters.filter(s => s.id === subtipoFilter)[0].id;
            if (subtipoFilter) fetchData(tipoFilter, subTipoFilterId);
        } else {
            fetchData(tipoFilter, null);
        }
    }, [subtipoFilter]);


    const filteredData = data.map(sec => ({
        title: sec.title,
        data: sec.data.filter(item => item.nombreBarrio.toLowerCase().includes(search.toLowerCase()))
    })).filter(sec => sec.data.length);


    if (loading) return <LoadingLogoPulse isLoading />;

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Buscar barrio..."
                value={search}
                onChangeText={setSearch}
                clearButtonMode="while-editing"
                returnKeyType="search"
                placeholderTextColor={"black"}
            />

            <View style={styles.pickersRow}>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={v => setTipoFilter(v)}
                        items={
                            tiposReclamosFilters.map(f => ({ label: f.label, value: String(f.id) }))
                        }
                        value={tipoFilter}
                        placeholder={{}}
                        style={pickerSelectStyles}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }}><MaterialIcons name="arrow-drop-down" size={24} color="#ccc" /></View>}
                        fixAndroidTouchableBug={true}
                    />
                </View>
                {tipoFilter !== "0" && (
                    <View style={styles.pickerContainer}>
                        <RNPickerSelect
                            onValueChange={v => setSubtipoFilter(v)}
                            items={[
                                {label: "Todos", value: "Todos"},
                                ...subtiposPorTipoFilters[parseInt(tipoFilter)]
                            ]}
                            value={subtipoFilter}
                            placeholder={{}}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc" /></View>}
                            fixAndroidTouchableBug={true}
                        />
                    </View>
                )}
            </View>
            {/* Leyenda de colores */}
            <View style={styles.legendContainer}>
                <View style={styles.statItem}><View style={[styles.dot, { backgroundColor: '#10B981' }]} /><Text>Resueltas</Text></View>
                <View style={styles.statItem}><View style={[styles.dot, { backgroundColor: '#4F46E5' }]} /><Text>En Proceso</Text></View>
            </View>
            <SectionList
                sections={filteredData}
                keyExtractor={item => item.nombreBarrio}
                renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                renderItem={({ item }) => (
                    <Card containerStyle={styles.card}>
                        <View style={styles.row}>
                            <Ionicons name="home-outline" size={20} color="#374151" style={{ marginRight: 8 }} />
                            <Text style={styles.barrioText}>{item.nombreBarrio}</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}><View style={[styles.dot, { backgroundColor: '#10B981' }]} /><Text>{item.cantSolicitudesResueltas}</Text></View>
                            <View style={styles.statItem}><View style={[styles.dot, { backgroundColor: '#4F46E5' }]} /><Text>{item.cantSolicitudesEnProceso}</Text></View>
                        </View>
                    </Card>
                )}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    searchBar: { margin: 15, padding: 8, backgroundColor: '#fff', borderRadius: 8, fontSize: 16 },
    pickersRow: { flexDirection: 'column', justifyContent: 'center', marginHorizontal: 15 },
    pickerContainer: {
        marginVertical: 5,
        width: "100%",
        height: 50,
    },
    legendContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
    sectionHeader: { marginTop: 20, padding: 8, fontSize: 20, fontWeight: '700', backgroundColor: '#F3F4F6' },
    list: { paddingBottom: 20 },
    card: { borderRadius: 12, padding: 15, marginHorizontal: 15, marginVertical: 8 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    barrioText: { fontSize: 16, fontWeight: '500', flexShrink: 1, flexWrap: 'wrap', lineHeight: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statItem: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});