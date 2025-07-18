import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import { getAllReparacionesByTecnico, MisReparaciones as MisReparacionesResponse } from "@/api/petitions";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import ReparacionCard from "@/components/ReparacionCard";
import Pagination from "@/components/Pagination";
import { getColorByAuthDataRol } from "@/constants/Colors";

export default function MisReparaciones() {
  const { authData } = useAuth();

  const [isLoadingReparaciones, setIsLoadingReparaciones] = useState<boolean>(false);
  
  const [reparaciones, setReparaciones] = useState<MisReparacionesResponse[]>([])

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 10;


  useEffect(() => {
    const fetchMisReparaciones = async () => {
      setIsLoadingReparaciones(true);
      try {
        const data = await getAllReparacionesByTecnico(authData.id, page, pageSize);
        setReparaciones(data.reparaciones);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingReparaciones(false);
      }
    };
    fetchMisReparaciones();
  }, [page]);


  const renderItem = ({ item }: { item: MisReparacionesResponse }) => (
    <ReparacionCard
      id={item.id}
      nombrePoste={item.nombrePoste}
      nombreBarrio={item.nombreBarrio}
      nombreAnimal={item.nombreAnimal}
      latitud={item.latitud}
      longitud={item.longitud}
      nombreTipoReclamo={item.nombreTipoReclamo}
      fechaArreglo={item.fechaArreglo}
      horaArreglo={item.horaArreglo}
      tecnico1={`${item.nombreTecnico1} ${item.apellidoTecnico1}`}
      tecnico2={item.nombreTecnico2 ? `${item.nombreTecnico2} ${item.apellidoTecnico2}` : undefined}
    />
  );


  return (
    <SafeAreaView style={styles.container}>
      { isLoadingReparaciones ? (
        <LoadingLogoAnimated isLoading={true} />
      ) : (reparaciones?.length > 0) ? (
        <>

          <FlatList
            data={reparaciones}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{paddingBottom: 65}}
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
          <Text style={styles.noReparacionesText}>Aún no hay reparaciones</Text>
          <Text style={styles.noReparacionesSubtitle}>
            Cuando se realicen reparaciones, aparecerán aquí.
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
    paddingTop:5,
    paddingLeft:5,
    paddingRight:5,
    paddingBottom: 10
  },
  noReparacionesText: {
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
  noReparacionesSubtitle: {
    marginTop: 5,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});
