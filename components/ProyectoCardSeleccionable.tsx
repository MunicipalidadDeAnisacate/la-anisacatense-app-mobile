import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card, CheckBox } from '@rneui/themed';
import { useProyectosSelection } from '@/context/ProyectosContext';
import { Button } from '@rneui/themed/dist/Button';
import { principalColorVecino } from '@/constants/Colors';
import { router } from 'expo-router';

interface ProyectoCardSeleccionableProps {
  proyecto: ProyectoResponse;
}

const ProyectoCardSeleccionable: React.FC<ProyectoCardSeleccionableProps> = ({
  proyecto
}) => {

  const { id, titulo, descripcion, nombreUsuario, dniUsuario } = proyecto;

  const { selectedProyectos, toggleProyecto } = useProyectosSelection();
  const isChecked = selectedProyectos.some(p => p.id === id);

  const checkProyecto = () => {
    toggleProyecto({ id: id, titulo: titulo });
  };

  const navigateToInfoProyecto = () => {
    router.push({
      pathname: "/admin/proyectoCiudadanoAdmin/informacionProyecto",
      params: {proyectoIdStr: JSON.stringify(id)}
    })
  }

  return (
    <TouchableWithoutFeedback>
      <Card containerStyle={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox
            checked={isChecked}
            onPress={checkProyecto}
          />

          <View style={[styles.content, { flex: 1 }]}>
            <View style={styles.textContainer}>
              <View style={{ marginBottom: 5 }}>
                <Text style={styles.title}>Proyecto Nro. {id}</Text>
                <Text style={styles.title}>Título: {titulo}</Text>
              </View>

              {descripcion &&
                <View>
                  <Text style={styles.subtitle}>Descripción:</Text>
                  <Text style={styles.subtitle}>{descripcion}</Text>
                </View>
              }

              <Text style={styles.subtitle}>{'\n'}Postulante: {nombreUsuario}</Text>
              <Text style={styles.subtitle}>D.N.I: {dniUsuario}{'\n'}</Text>

              <Button
                title="Ver información"
                buttonStyle={[styles.button, { backgroundColor: principalColorVecino }]}
                containerStyle={styles.buttonSpacing}
                onPress={navigateToInfoProyecto}
              />
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
    paddingVertical: 20,
    paddingHorizontal: 10,
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
  buttonSpacing: {
    marginTop: 5,
  },
  button: {
    backgroundColor: principalColorVecino,
    margin: 5,
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 3
  },
});

export default ProyectoCardSeleccionable;
