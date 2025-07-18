import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import { getColorByAuthDataRol } from "@/constants/Colors";
import ConsultaCiudadanaItemCard from "@/components/ConsultaCiudadanaItemCard";
import { getConsultasCiudadanasActivas } from "@/api/petitions";
import { router } from "expo-router";


export default function ConsultaCiudadana() {
  const { authData } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [consultas, setConsultas] = useState<ConsultaCiudadanaItemResponse[]>([]);

  useEffect(() => {
    const fetchConsultasCiudadanasActivas = async () => {
      try {
        setIsLoading(true)
        const consultasData = await getConsultasCiudadanasActivas();
        setConsultas(consultasData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsultasCiudadanasActivas();
  }, []);


  const renderItem = ({ item }: { item: ConsultaCiudadanaItemResponse }) => (
    <ConsultaCiudadanaItemCard
      id={item.id}
      titulo={item.titulo}
      fechaInicio={item.fechaInicio}
      horaInicio={item.horaInicio}
      fechaCierre={item.fechaCierre}
      horaCierre={item.horaCierre}
      onPress={() => {
        router.push({
          pathname: "/consultaCiudadana/informacionConsultaCiudadanaVecino",
          params: { consultaIdStr: JSON.stringify(item.id) }
        })
      }}
    />
  );


  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <LoadingLogoAnimated isLoading={isLoading} />
      ) : consultas.length > 0 ? (
        <>
          <Text style={[styles.noConsultasSubtitle, { marginHorizontal: 15, marginVertical: 20 }]}>
            Consulta Ciudadana es un espacio donde los vecinos de Anisacate pueden expresar su preferencia entre distintos proyectos locales. Cada consulta abre en una fecha determinada y cierra en otra, y durante ese período podrás revisar la información completa de cada propuesta (archivo PDF o Word) y elegir la alternativa que más te interese. De esta manera, la Municipalidad conoce mejor tus opiniones antes de avanzar con los proyectos.
          </Text>
          
          <FlatList
            data={consultas}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 65 }}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="info-outline" size={64} color={getColorByAuthDataRol(authData.rol)} />
          <Text style={styles.noConsultasText}>Aún no hay ninguna Consulta ciudadana</Text>
          <Text style={styles.noConsultasSubtitle}>
            Consulta Ciudadana es un espacio donde los vecinos de Anisacate pueden expresar su preferencia entre distintos proyectos locales. Cada consulta abre en una fecha determinada y cierra en otra, y durante ese período podrás revisar la información completa de cada propuesta (archivo PDF o Word) y elegir la alternativa que más te interese. De esta manera, la Municipalidad conoce mejor tus opiniones antes de avanzar con los proyectos.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 10,
  },
  noConsultasText: {
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
  noConsultasSubtitle: {
    marginTop: 5,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});
