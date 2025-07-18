import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons';
import { pickerSelectStyles } from '@/styles/pickerStyles';
import { principalColorTecnico, principalColorVecino } from '@/constants/Colors';

type LuminariaStatsCardProps = {
    numeroMeses: string;
    onChangeMeses: (m: string) => void;
    data: EstadisticasSolicitudesXSubTipoResponse;
    isLoading: boolean;
};

const items = [
    { label: "Histórico", value: "-1" },
    { label: "Hoy", value: "0" },
    { label: "Ayer", value: "1" },
    { label: "Últimos 7 días", value: "7" },
    { label: "Últimos 30 días", value: "30" },
    { label: "Últimos 60 días", value: "60" },
    { label: "Últimos 90 días", value: "90" },
]

export default function LuminariaStatsCard({ numeroMeses, onChangeMeses, data, isLoading }: LuminariaStatsCardProps) {
    const hasHistoric = numeroMeses !== "-1";

    if (isLoading) return;

    return (
        <Card containerStyle={styles.card}>
            <Text style={{ textAlign: "center", marginBottom: 5 }}>Reparaciones realizadas</Text>
            <RNPickerSelect
                onValueChange={value => onChangeMeses(value)}
                items={items}
                value={numeroMeses}
                placeholder={{}}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }}><MaterialIcons name="arrow-drop-down" size={24} color="#ccc" /></View>}
                fixAndroidTouchableBug={true}
            />

            {hasHistoric || data ? (
                <View style={styles.grid}>
                    <StatItem label="Focos" value={data.cantSolicitudesConCambioFoco} color={principalColorTecnico} />
                    <StatItem label="Fotocélulas" value={data.cantSolicitudesConCambioFotocelula} color={principalColorVecino} />
                    <StatItem label="Fusibles" value={data.cantSolicitudesConCambioFusible} color="#F59E0B" />
                    <StatItem label="Otros" value={data.cantSolicitudesConOtro} color="#6B7280" />
                </View>
            ) : (
                <Text style={styles.empty}>Sin datos para este periodo</Text>
            )}
        </Card>
    );
}

const StatItem = ({ label, value, color }) => (
    <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.text}>{label}: {value}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        padding: 15,
        borderRadius: 16,
        backgroundColor: '#f4f4f4',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    item: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    text: { fontSize: 14, color: '#374151' },
    empty: { textAlign: 'center', color: '#6B7280', fontStyle: 'italic' },
});
