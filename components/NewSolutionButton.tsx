import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '@rneui/themed';
import { router } from 'expo-router';


const plusCircle = require("../assets/images/menu/circulo-plus.png")

export default function NewSolitionButton({ idTipoSolicitud, titleTipoSolicitud }) {

    const mostrarSolicitud = () => {
        if (idTipoSolicitud && titleTipoSolicitud) {
            router.push({
                pathname: "/maps/mapaReparacionNuevo",
                params: {
                    idTipoSolicitud: idTipoSolicitud,
                    titleTipoSolicitud: titleTipoSolicitud,
                }
            });
        }
    }

    return (
        <TouchableOpacity onPress={mostrarSolicitud}>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <Image
                        source={plusCircle}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>OTRO TIPO DE REPARACIÓN</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 15,
        alignItems: 'flex-start',
        marginBottom:50
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        width: '70%',
        justifyContent: 'center',
        marginLeft: 14
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 12,
        color: '#555',
        marginTop: 5,
    },
    image: {
        width: '30%',
        aspectRatio: 1,
        resizeMode: 'contain'
    },
});