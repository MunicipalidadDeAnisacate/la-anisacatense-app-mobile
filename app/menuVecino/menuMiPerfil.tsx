import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Text, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import MiPerfilVecinoCard from '@/components/MiPerfilVecinoCard';
import { Card } from '@rneui/themed';

const laAnisacatense = require("../../assets/images/anisacatense/fondoCircular.png");

const editarMiPerfilDescription = "Actualiza tus datos personales: nombre, apellido, teléfono y correo electrónico.";
const editarMiDomicilioDescription = "Modifica la información de tu domicilio: calle, número, manzana y lote.";
const editarMiContrasenaDescription = "Cambia tu contraseña de acceso para mantener tu cuenta segura.";

const editarMiPerfil = require("../../assets/images/menu/menu-mi-perfil/editar-mi-perfil.png");
const editarMiDomicilio = require("../../assets/images/menu/menu-mi-perfil/editar-mi-domicilio.png");
const editarMiContrasena = require("../../assets/images/menu/menu-mi-perfil/contrasena.png");

type OpcionSeleccionada = {
  id: number,
  title: string;
  description: string,
  route: string
  image: any,
}


const opciones: OpcionSeleccionada[] = [
  { id: 1, title: "Editar mi perfil", description: editarMiPerfilDescription, route: "miPerfil/editarMiPerfil", image: editarMiPerfil },
  { id: 2, title: "Editar mi domicilio", description: editarMiDomicilioDescription, route: "miPerfil/editarMiDomicilio", image: editarMiDomicilio },
  { id: 3, title: "Editar mi contraseña", description: editarMiContrasenaDescription, route: "miPerfil/editarMiContrasena", image: editarMiContrasena },
]


export default function menuMiPerfil() {

  const setAndNavigate = async (item: OpcionSeleccionada) => {
    router.push({
      pathname: item.route
    });
  }

  const renderItem = ({ item }: { item: OpcionSeleccionada }) => (
    <MiPerfilVecinoCard
      title={item.title}
      image={item.image}
      onPress={() => setAndNavigate(item)}
      description={item.description}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.listContainer}>
        <FlatList
          data={opciones}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>

      <TouchableOpacity onPress={() => router.push("/utilsPages/cartaPresentacion")}>
        <Card containerStyle={styles.footerCard}>
          <View style={styles.footerContent}>
            <Image source={laAnisacatense} style={styles.footerImage} />
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerDescription}>
                La Municipalidad de Anisacate ha liberado el código de programación de la aplicación “La Anisacatense”, subiéndolo a la plataforma GitHub, lo que permite que cualquier municipio o institución pueda implementarla y adaptarla de manera libre y gratuita. 
                <Text style={{ color:"blue", fontWeight:"bold", textDecorationLine: 'underline' }}>
                  Carta de la Intendente Natalia Contini.
                </Text>
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  footerCardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerCard: {
    margin: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#BDE4F6',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerImage: {
    width: width * 0.20,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginRight: 12,
  },
  footerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footerDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#333',
    fontWeight: '500',
  },
});