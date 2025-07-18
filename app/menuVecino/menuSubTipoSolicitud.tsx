import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TipoSolicitudMenuCard from '../../components/TipoSolicitudMenuCard';
import { SubTipoSolicitud, subTiposDeSolicitud } from "../../constants/tiposYSubTiposConst/SubTiposDeSolicitudes"
import { getUserLocation } from '@/functions/locationUtils';
import LoadingLogoPulse from '@/components/LoadingLogoAnimated';


const menuSubTipoSolicitud: React.FC = () => {
  const [loadingUbication, setLoadingUbication] = useState<boolean>(false);

  const { subTipos } = useLocalSearchParams();
  const subTiposArray: number[] = subTipos ? JSON.parse(subTipos as string) : [];

  const filteredSubTipos = subTiposDeSolicitud.filter((tipo) => subTiposArray.includes(tipo.id));

  const setAndNavigate = async (item: SubTipoSolicitud) => {
    try {
      setLoadingUbication(true);
      const location = await getUserLocation();
      if (!location) {
        return;
      }
    } finally {
      setLoadingUbication(false);
    }

    if (item.soloVecino) {
      const contacto = { 
        title: item.title, 
        description: item.description2, 
        link: item.link,
        type: item.type
      }
      router.push({
        pathname: item.route,
        params: { contactoStr: JSON.stringify(contacto) }
      });

    } else {
      router.push({
        pathname: item.route,
        params: { subTipo: JSON.stringify(item) }
      });
    }

  }

  const renderItem = ({ item }: { item: SubTipoSolicitud }) => (
    <TipoSolicitudMenuCard
      title={item.title}
      image={item.image}
      onPress={() => setAndNavigate(item)}
      description={item.description}
    />
  );


  if (loadingUbication) return <LoadingLogoPulse isLoading={true} />;
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredSubTipos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default menuSubTipoSolicitud;