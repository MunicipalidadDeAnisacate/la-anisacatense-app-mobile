import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import SolicitudCard from "@/components/SolicitudCard";
import { getMisSolicitudesVecino } from "@/api/petitions";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import Pagination from "@/components/Pagination";
import { getColorByAuthDataRol } from "@/constants/Colors";


export default function MisSolicitudes() {
  const { authData } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [solicitudesItems, setSolicitudesItems] = useState<MisSolicitudesResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 10;


  useEffect(() => {
    const fetchMisSolicitudes = async () => {
      try {
        setIsLoading(true)
        const response = await getMisSolicitudesVecino(authData.id, page, pageSize);
        setSolicitudesItems(response.solicitudes);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMisSolicitudes();
  }, [page]);


  const renderItem = ({ item }: { item: MisSolicitudesResponse }) => (
    <SolicitudCard
      rol={authData.rol}
      id={item.id}
      nombreTipoReclamo={item.nombreTipoReclamo}
      nombreSubTipoReclamo={item.nombreSubTipoReclamo}
      nombreEstadoReclamo={item.nombreEstadoReclamo}
      fechaReclamo={item.fechaReclamo}
      horaReclamo={item.horaReclamo}
      nombrePoste={item.nombrePoste}
      nombreAnimal={item.nombreAnimal}
      fechaArreglo={item.fechaArreglo}
      horaArreglo={item.horaArreglo}
      latitud={item.latitud}
      longitud={item.longitud}
      nombreBarrio={item.nombreBarrio}
    />
  );


  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <LoadingLogoAnimated isLoading={isLoading} />
      ) : solicitudesItems.length > 0 ? (
        <>
          <FlatList
            data={solicitudesItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 65 }}
          />

          <View style={{ alignContent: "center" }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              rol={authData.rol}
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="info-outline" size={64} color={getColorByAuthDataRol(authData.rol)} />
          <Text style={styles.noSolicitudesText}>Aún no hay solicitudes</Text>
          <Text style={styles.noSolicitudesSubtitle}>
            Cuando se realicen solicitudes, aparecerán aquí.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 10,
  },
  noSolicitudesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noSolicitudesSubtitle: {
    marginTop: 5,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});
