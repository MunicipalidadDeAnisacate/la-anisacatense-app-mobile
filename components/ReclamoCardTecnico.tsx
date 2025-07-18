import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card, Button } from '@rneui/themed';
import { router } from "expo-router";
import { obtenerNombreBarrio } from '@/constants/localizar';

export interface VecinoResponse {
  dni: string;
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
  nombreCalle?: string;
  numeroCalle?: string;
  manzana?: string;
  lote?: string;
  fechaReclamo: any;
  horaReclamo: any;
}

export interface SolicitudesVariasResponse {
  id: number;
  nombreSubTipoReclamo: string;
  nroSubTipoReclamo: number;
  nombreTipoReclamo: string;
  latitudReclamo: number;
  longitudReclamo: number;
  nombreEstado: string;
  vecinoDtoList: VecinoResponse[];
}

interface SolicitudCardProps {
  solicitud: SolicitudesVariasResponse;
  closeBottomSheet: () => void
}

const ReclamoCardTecnico: React.FC<SolicitudCardProps> = ({ solicitud, onVerEnMapa, closeBottomSheet }) => {

  const {
    id,
    nombreTipoReclamo,
    nombreSubTipoReclamo,
    nombreEstado,
    vecinoDtoList,
    latitudReclamo,
    longitudReclamo,
  } = solicitud;

  const nombreBarrio = obtenerNombreBarrio(latitudReclamo, longitudReclamo)

  const vecinoPrincipal = vecinoDtoList && vecinoDtoList.length > 0 ? vecinoDtoList[0] : null;

  const verEnMapa = () => {
    onVerEnMapa(solicitud.latitudReclamo, solicitud.longitudReclamo);
  };

  const handleNavigate = () => {
    closeBottomSheet();
    router.push({
      pathname: "informacionSolicitud/informacionSolicitudFromMap",
      params: { idReclamo: id }
    })
  }

  return (
    <TouchableWithoutFeedback>
      <Card containerStyle={styles.card}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              #{id} - {nombreTipoReclamo}
            </Text>
            <Text style={styles.subtitle}>{nombreSubTipoReclamo}</Text>
            {vecinoPrincipal ? (
              <>
                <Text style={styles.info}>
                  Vecino: {vecinoPrincipal.nombre} {vecinoPrincipal.apellido}
                </Text>
                <Text style={styles.info}>
                  Barrio: {nombreBarrio}
                </Text>
                <Text style={styles.info}>
                  Fecha: {vecinoPrincipal.fechaReclamo}
                </Text>
                <Text style={styles.info}>
                  Hora: {vecinoPrincipal.horaReclamo}
                </Text>
              </>
            ) : (
              <Text style={styles.info}>Vecino: Información no disponible</Text>
            )}
            <Text style={[styles.status, getStatusStyle(nombreEstado)]}>
              Estado: {nombreEstado}
            </Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            title="Ver en mapa"
            onPress={verEnMapa}
            buttonStyle={styles.buttonVerMapa}
            titleStyle={styles.buttonTitle}
          />
          <Button
            title="Información"
            onPress={handleNavigate}
            buttonStyle={styles.buttonInformacion}
            titleStyle={styles.buttonTitle}
          />

        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
};


const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Resuelto':
      return { color: '#7CB16E' };
    case 'En Proceso':
      return { color: '#1DADDF' };
    default:
      return { color: '#2196F3' };
  }
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  info: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  buttonsContainer: {
    alignSelf: 'center',
    marginTop: 5,
  },
  buttonVerMapa: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#3B82F6",
    width: "90%",
    marginBottom: 5,
  },
  buttonInformacion: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    width: "95%",
  },
  buttonTitle: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default ReclamoCardTecnico;
