import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { router } from "expo-router";
import TipoSolicitudMenuCard from '../../components/TipoSolicitudMenuCard';
import { tiposDeSolicitud, TipoSolicitud } from '@/constants/tiposYSubTiposConst/TiposDeSolicitud';
import { useAuth } from '@/context/AuthContext';

const menuTipoSolicitudTecnico: React.FC = () => {
  const { authData } = useAuth();


  function isBlock(item: TipoSolicitud) {
    return item.cuadrilla !== authData.cuadrilla;
  }


  function setAndNavigate(item: TipoSolicitud) {
    router.push({
      pathname: "/menuTecnico/menuSubTipoSolicitudTecnico",
      params: {
        id: item.id,
        title: item.title,
        subTipos: JSON.stringify(item.subTipos),
      },
    });
  }


  function setTitle(item: TipoSolicitud): string {
    if (authData.rol === "tecnico") {
      if (item.id === 1) {
        item.title = "REPARAR ALUMBRADO PÚBLICO"
      }
      return item.title.toUpperCase();
    }
    return item.title;
  }


  const renderItem = ({ item }: { item: TipoSolicitud }) => (
    <>
      {!item.soloVecino &&
        <TipoSolicitudMenuCard
          title={setTitle(item)}
          image={item.image}
          onPress={() => setAndNavigate(item)}
          blocked={isBlock(item)}
        />
      }
    </>
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={tiposDeSolicitud}
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


export default menuTipoSolicitudTecnico;
