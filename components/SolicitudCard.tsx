import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { getNombreBarrio } from '@/functions/solicitudCardFunctions/getNombreBarrio';

interface SolicitudCardProps {
  rol: string;
  id: number;
  nombreTipoReclamo: string;
  nombreSubTipoReclamo: string;
  nombreEstadoReclamo: string;
  fechaReclamo: string;
  horaReclamo: string;
  // opc
  nombrePoste?: string;
  nombreAnimal?: string;
  fechaArreglo?: string;
  horaArreglo?: string;
  latitud?: number;
  longitud?: number;
  nombreBarrio?: string;
}

const SolicitudCard: React.FC<SolicitudCardProps> = ({
  id,
  nombreTipoReclamo,
  nombreSubTipoReclamo,
  nombreEstadoReclamo,
  fechaReclamo,
  horaReclamo,
  nombrePoste,
  nombreAnimal,
  fechaArreglo,
  horaArreglo,
  latitud,
  longitud,
  nombreBarrio
}) => {
  const mostrarTick = nombreEstadoReclamo === "Resuelto";

  const getStatusColor = () => {
    if (nombreEstadoReclamo === "Resuelto") return "#7CB16E"; // Verde
    if (nombreEstadoReclamo === "En Proceso") return "#1DADDF"; // Azul
    return "#1DADDF"; // Por defecto
  };

  
  return (
    <TouchableWithoutFeedback>
      <Card containerStyle={styles.card}>
        <View style={styles.content}>
          <View style={styles.textContainer}>

            <Text style={styles.title}>#{id} - {nombreTipoReclamo}</Text>

            <Text style={styles.subtitle}>{nombreSubTipoReclamo}</Text>

            {(nombreBarrio || (latitud && longitud)) &&
              <Text style={styles.subtitle}>Barrio: {getNombreBarrio(nombreBarrio, latitud, longitud)}</Text>
            }

            {nombrePoste && <Text style={styles.subtitle}>Poste: {nombrePoste}</Text>}

            {nombreAnimal && <Text style={styles.subtitle}>Animal denunciado: {nombreAnimal}</Text>}

            <Text style={styles.info}>
              Fecha de Reclamo: {fechaReclamo} - {horaReclamo}
            </Text>

            {(fechaArreglo && horaArreglo) &&
              <Text style={styles.info}>
                Fecha de Reparación: {fechaArreglo} - {horaArreglo}
              </Text>
            }

            <View style={styles.estadoContainer}>
              <Text style={[styles.status, { color: getStatusColor() }]}>
                Estado: {nombreEstadoReclamo}
              </Text>

              {mostrarTick && (
                <MaterialIcons name="check-circle" size={28} color="#7CB16E" style={styles.tickIcon} />
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
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
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tickIcon: {
    position: 'absolute',
    right: 16,
  },
});

export default SolicitudCard;
