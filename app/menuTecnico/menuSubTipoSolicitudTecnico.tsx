import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TipoSolicitudMenuCard from '../../components/TipoSolicitudMenuCard';
import NewSolitionButton from '@/components/NewSolutionButton';
import { SubTipoSolicitud, subTiposDeSolicitud } from "../../constants/tiposYSubTiposConst/SubTiposDeSolicitudes"
import { useAuth } from '@/context/AuthContext';
import NewPosteButton from '@/components/NewPosteButton';
import SolicitudComoVecinoButton from '@/components/SolicitudComoVecinoButton';
import { Dialog } from '@rneui/themed';
import { Button } from '@rneui/themed/dist/Button';
import { principalColorTecnico } from '@/constants/Colors';

const menuSubTipoSolicitudTecnico: React.FC = () => {
  const { authData } = useAuth();
  const { id, title, subTipos } = useLocalSearchParams();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);


  const setDialog = () => {
    setDialogVisible(!dialogVisible);
  }


  const tipoSolicitud = {
    id: Number(id),
    title: title as string,
    subTipos: JSON.parse(subTipos as string),
  };


  const filteredSubTipos = subTiposDeSolicitud.filter((tipo) =>
    tipoSolicitud.subTipos.includes(tipo.id)
  );


  function setAndNavigate(item: SubTipoSolicitud) {
    if (item.id === 17 || item.id === 18) {
      router.push({
        pathname: "/actividadTecnico/solicitudesVivero",
        params: { subTipoStr: JSON.stringify(item) }
      });
    } else {
      router.push({
        pathname: (item.id == 1 || item.id == 2) ? item.route : "/maps/mapaSolicitudesVariasTecnico",
        params: { subTipo: JSON.stringify(item) }
      });
    }
  };
  
  function navigateToMap(item: SubTipoSolicitud) {
    setDialog();
    router.push({
      pathname: item.route,
      params: { subTipo: JSON.stringify(item), solicitudComoVecinoStr: JSON.stringify(true) }
    });
  }


  function setTitle(item: SubTipoSolicitud): string {
    if (authData.rol === "tecnico") {
      if (item.id === 1) {
        item.title = "REPARAR ALUMBRADO";
      }
      if (item.id === 2) {
        item.title = "REPARAR POSTE";
      }
      return item.title.toUpperCase();
    }
    return item.title;
  }


  const renderItem = ({ item }: { item: SubTipoSolicitud }) => (
    <>
      {!item.soloVecino &&
        <TipoSolicitudMenuCard
          title={setTitle(item)}
          image={item.image}
          onPress={() => setAndNavigate(item)}
        />
      }
    </>
  );

  return (
    <View>
      <ScrollView style={styles.container}>
        <FlatList
          data={filteredSubTipos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
        {id === "1" && <NewPosteButton />}
        <SolicitudComoVecinoButton setDialog={setDialog} />
        <NewSolitionButton idTipoSolicitud={tipoSolicitud.id} titleTipoSolicitud={tipoSolicitud.title} />
      </ScrollView>

      <Dialog
        isVisible={dialogVisible}
        onBackdropPress={setDialog}
      >
        <Dialog.Title title="Seleccionar Tipo" />
        <Text style={{ marginBottom: 5 }}>Seleccione el tipo de solicitud que desea solucionar/arreglar como vecino:</Text>
        <View style={{ flexDirection: "column", width: "100%" }}>
          {filteredSubTipos.filter(s => !(s.id === 17) && !(s.id === 18) && !(s.soloVecino)).map((subtipo) => (
            <Button
              buttonStyle={{ backgroundColor: principalColorTecnico }}
              containerStyle={{ borderRadius: 10, marginVertical: 3 }}
              key={subtipo.id}
              title={subtipo.title}
              onPress={() => navigateToMap(subtipo)}
            />
          ))}
          <Button
            containerStyle={{ borderRadius: 10, marginBottom: 3, marginTop: 10 }}
            title={"Cerrar"}
            onPress={setDialog}
            buttonStyle={{ backgroundColor: 'red' }}
          />
        </View>
      </Dialog>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default menuSubTipoSolicitudTecnico;