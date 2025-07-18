import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { getEstadisticasSolicitudes, getEstadisticasSolicitudesDesde } from "@/api/petitions";
import LoadingLogoPulse from "@/components/LoadingLogoAnimated";
import ProgressChartCard from "@/components/graficos/ProgressChartCard";
import StackedBarChartCard from "@/components/graficos/StackedBarChartCard";
import { principalColorAdmin, principalColorTecnico, principalColorVecino } from "@/constants/Colors";
import RNPickerSelect from 'react-native-picker-select';
import { pickerSelectStyles } from "@/styles/pickerStyles";
import { MaterialIcons } from "@expo/vector-icons";


export default function EstadisticasSolicitudes() {
  const [loading, setLoading] = useState(false);

  const [estadisticas, setEstadisticas] = useState<EstadisticasSolicitudesGeneralResponse | null>(null);
  const [solicitudesXSemana, setSolicitudesXSemana] = useState<ReclamosXSemanaResponse[] | null>(null);

  // datos de estadisticas
  const [solEnProcesoPorc, setSolEnProcesoPorc] = useState<number | null>(null);
  const [solResueltasPorc, setSolResueltasPorc] = useState<number | null>(null);

  const [numSemanas, setNumSemanas] = useState<number>(4);

  useEffect(() => {
    (async () => {

      try {
        setLoading(true);
        const stats = await getEstadisticasSolicitudes();
        setEstadisticas(stats);
        setSolicitudesXSemana(stats?.reclamosXSemanaResponse)
      } catch (error) {
        console.error("Error buscando estadísticas: ", error);
      } finally {
        setLoading(false);
      }

    })();
  }, []);

  useEffect(() => {
    (async () => {

      try {
        setLoading(true);
        const ultimasSemanas = await getEstadisticasSolicitudesDesde(numSemanas);
        setSolicitudesXSemana(ultimasSemanas);
      } catch (error) {
        setNumSemanas(4);
        console.error(error)
      } finally {
        setLoading(false);
      }

    })();
  }, [numSemanas])


  const getPorcetanje = (cant: number): number => {
    if (!estadisticas) {
      return 0;
    }
    const total: number = estadisticas.cantSolicitudesEnProceso + estadisticas.cantSolicitudesResueltos
    
    if (total === 0){
      return Number(0.0);
    }
    
    return Number((cant / total).toFixed(2));
  }


  useEffect(() => {
    if (estadisticas) {
      setSolEnProcesoPorc(getPorcetanje(estadisticas.cantSolicitudesEnProceso));
      setSolResueltasPorc(getPorcetanje(estadisticas.cantSolicitudesResueltos))
    }
  }, [estadisticas])


  const getDataForBarChart = () => {
    const semanas = solicitudesXSemana ?? [];

    const sorted = [...semanas].sort((a, b) => {
      const [dayA, monthA, yearA] = a.fechaDesde.split('-').map(Number);
      const [dayB, monthB, yearB] = b.fechaDesde.split('-').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA.getTime() - dateB.getTime();
    });

    const labels = sorted.map(s =>
      `${s.fechaDesde.slice(0, 2)}/${s.fechaDesde.slice(3, 5)}`
    );

    const data = sorted.map(s => [s.cantidadResueltas]);

    const barData = {
      labels,
      data,
      legend: ['Resueltas'],
      barColors: [principalColorTecnico]
    };

    return barData;
  }


  if (loading) {
    return <LoadingLogoPulse isLoading message="Obteniendo estadísticas..." />;
  }

  if (!estadisticas) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { textAlign: "center", color: principalColorAdmin }]}>
          Estadisticas generales de solicitudes
        </Text>

        {(solEnProcesoPorc != null && solResueltasPorc != null) && (
          <View style={styles.chartContainer}>
            <Text style={styles.title}>Solicitudes según Estado</Text>
            <ProgressChartCard
              data={{
                labels: ["Resueltas", "En Proceso"],
                data: [solResueltasPorc, solEnProcesoPorc],
                colors: [principalColorTecnico, principalColorVecino]
              }}
              totales={[estadisticas.cantSolicitudesResueltos, estadisticas.cantSolicitudesEnProceso]}
            />
          </View>
        )}

        {estadisticas && (
          <View style={styles.chartContainer}>
            <Text style={styles.title}>Solicitudes resueltas por semana</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                value={numSemanas}
                onValueChange={(value) => setNumSemanas(value)}
                items={[
                  { label: "Últimas 2 semanas", value: 2 },
                  { label: "Últimas 3 semanas", value: 3 },
                  { label: "Últimas 4 semanas", value: 4 },
                  { label: "Últimas 5 semanas", value: 5 },
                  { label: "Últimas 6 semanas", value: 6 },
                  { label: "Últimas 7 semanas", value: 7 },
                  { label: "Últimas 8 semanas", value: 8 },
                  { label: "Últimas 9 semanas", value: 9 },
                ]}
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc" /></View>}
                fixAndroidTouchableBug={true}
              />
            </View>
            <StackedBarChartCard
              data={getDataForBarChart()}
              height={250}
              verticalLabels={numSemanas >= 6 ? false : true}
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 15,
    alignItems: "center"
  },
  chartContainer: {
    width:"100%",
    marginVertical: 20,
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  pickerContainer: {
    marginVertical: 5,
    width: "92%",
    height: 50,
  },
});
