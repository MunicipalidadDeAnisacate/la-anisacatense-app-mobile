import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { router } from "expo-router";
import TipoSolicitudMenuCard from '../../components/TipoSolicitudMenuCard';
import { tiposDeSolicitud, TipoSolicitud } from '@/constants/tiposYSubTiposConst/TiposDeSolicitud';


const MenuTipoSolicitud: React.FC = () => {

  const setAndNavigate = (item: TipoSolicitud) => {
    if (item.id === 8) {
      router.push({
        pathname: "/utilsPages/informacionContactoSolicitud",
        params: { contactoStr: JSON.stringify(item.contactoInformativo) },
      });
    } else {
      router.push({
        pathname: "/menuVecino/menuSubTipoSolicitud",
        params: { subTipos: JSON.stringify(item.subTipos), idTipoStr: JSON.stringify(item.id)},
      });
    }
  };

  const renderItem = ({ item }: { item: TipoSolicitud }) => (
    <TipoSolicitudMenuCard
      title={item.title}
      image={item.image}
      onPress={() => setAndNavigate(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tiposDeSolicitud}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{paddingBottom:30}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default MenuTipoSolicitud;
