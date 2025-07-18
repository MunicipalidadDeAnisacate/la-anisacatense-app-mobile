import React, { useMemo } from "react";
import { StyleSheet, FlatList, View, Platform, Dimensions } from "react-native";
import { Dialog, IconButton, Portal, Text } from "react-native-paper";
import ReclamoLuminariCardTecnico from "./ReclamoLuminariaCardTecnico";

type Solicitud = {
  idPoste: number;
  idReclamo: number;
  latitude: number;
  longitude: number;
  estadoPoste: number;
  nombrePoste: string;
  usuarios: {
    nombreUsuario: string;
    apellidoUsuario: string;
    fechaReclamo: string;
    horaReclamo: string;
  }[];
};

type SolicitudesLuminariaProps = {
  solicitudes: Solicitud[];
  onVerEnMapa: (lat: number, lng: number) => void;
  isOpen: boolean;
  closeBottomSheet: () => void;
};

const { height: screenHeight } = Dimensions.get("window");

const ListadoSolicitudesLuminaria: React.FC<SolicitudesLuminariaProps> = ({
  solicitudes,
  onVerEnMapa,
  isOpen,
  closeBottomSheet,
}) => {
  // Memoriza el resultado del ordenamiento para evitar re-cálculos en cada render
  const sortedSolicitudes = useMemo(() => {
    return solicitudes.slice().sort((a, b) => {
      const getEarliestDate = (usuarios: Solicitud["usuarios"]) =>
        usuarios
          .map((u) => new Date(u.fechaReclamo).getTime())
          .reduce((min, date) => Math.min(min, date), Infinity);
      return getEarliestDate(a.usuarios) - getEarliestDate(b.usuarios);
    });
  }, [solicitudes]);

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={closeBottomSheet} style={styles.dialog}>
        <View style={styles.headerContainer}>
          <View style={styles.side} />
          <Text style={styles.headerTitle}>Solicitudes Actuales</Text>
          <View style={styles.side}>
            <IconButton
              icon="close"
              iconColor="#fff"
              size={24}
              onPress={closeBottomSheet}
              style={styles.iconButton}
            />
          </View>
        </View>

        <Dialog.Content style={styles.content}>
          <View style={styles.listContainer}>
            <FlatList
              data={sortedSolicitudes}
              keyExtractor={(item) => item.idReclamo.toString()}
              renderItem={({ item }) => (
                <ReclamoLuminariCardTecnico
                  solicitud={item}
                  onVerEnMapa={onVerEnMapa}
                  closeBottomSheet={closeBottomSheet}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No hay solicitudes disponibles.
                </Text>
              }
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    maxHeight: "90%",
    // position: "relative",
  },
  headerContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingVertical: 5,
  },
  side: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    flex: 2,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left",
    color: "#334155",
  },
  iconButton: {
    backgroundColor: "red",
  },
  content: {
    paddingBottom: 0,
    paddingHorizontal: 0,
    height: Platform.select({
      ios: screenHeight * 0.70,  // iOS un poco menos
      android: screenHeight * 0.75,
    }),
  },
  listContainer: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1
  },
  flatListContent: {
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    paddingVertical: 20,
  },
});

export default ListadoSolicitudesLuminaria;