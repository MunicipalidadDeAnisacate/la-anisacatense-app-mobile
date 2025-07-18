import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card } from '@rneui/themed';
import { getNombreBarrio } from '@/functions/solicitudCardFunctions/getNombreBarrio';

interface ReparacionCardProps {
  id: number;
  nombrePoste?: string;
  nombreTipoReclamo: string;
  nombreSubTipoReclamo?: string;
  fechaArreglo?: string;
  horaArreglo?: string;
  nombreEstadoReclamo?: string;
  tecnico1: string;
  tecnico2?: string;
  nombreBarrio?: string;
  latitud?: number;
  longitud?: number;
  nombreAnimal?: string;
}

const ReparacionCard: React.FC<ReparacionCardProps> = ({
  id,
  nombrePoste,
  nombreTipoReclamo,
  nombreSubTipoReclamo,
  fechaArreglo,
  horaArreglo,
  nombreEstadoReclamo,
  tecnico1,
  tecnico2,
  nombreBarrio,
  latitud,
  longitud,
  nombreAnimal
}) => {

  return (
    <TouchableWithoutFeedback>
      <Card containerStyle={styles.card}>
        <View style={styles.content}>
          <View style={styles.textContainer}>

            {(!nombreEstadoReclamo && !nombreSubTipoReclamo) ?
              (<Text style={styles.title}>Reparación - #{id}</Text>) :
              (<Text style={styles.title}>Solicitud arreglada - #{id}</Text>)
            }

            <Text style={styles.subtitle}>{nombreTipoReclamo}</Text>

            {nombreSubTipoReclamo && <Text style={styles.subtitle}>{nombreSubTipoReclamo}</Text>}

            {(nombreBarrio || (latitud && longitud)) &&
              <Text style={styles.subtitle}>Barrio: {getNombreBarrio(nombreBarrio, latitud, longitud)}</Text>
            }

            {nombrePoste && <Text style={styles.subtitle}>Poste: {nombrePoste}</Text>}

            {nombreAnimal && <Text style={styles.subtitle}>Animal: {nombreAnimal}</Text>}

            <Text style={styles.info}>
              Fecha y Hora de Reparación: {fechaArreglo} - {horaArreglo}
            </Text>

            <Text style={styles.info}>Técnico 1: {tecnico1}</Text>

            {tecnico2 && <Text style={styles.info}>Técnico 2: {tecnico2}</Text>}

            {nombreEstadoReclamo &&
              <Text style={[styles.status, getStatusStyle(nombreEstadoReclamo)]}>
                Estado: {nombreEstadoReclamo}
              </Text>
            }
          </View>
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
    marginVertical: 15,
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
});

export default ReparacionCard;
