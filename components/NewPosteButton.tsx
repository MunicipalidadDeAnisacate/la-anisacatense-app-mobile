import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '@rneui/themed';
import { router } from 'expo-router';

const newPosteImage = require("../assets/images/menu/newPosteImage.png")

export default function NewPosteButton() {

    const setAndNavigate = () => {
        router.push({
            pathname: "/maps/mapaReparacionNuevo",
            params: { flagSetPoste: JSON.stringify(true) }
        });
    }

    return (
        <TouchableOpacity onPress={setAndNavigate}>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <Image
                        source={newPosteImage}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>CARGAR NUEVO POSTE</Text>
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
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        width: '70%',
        justifyContent: 'center',
        marginLeft: 15
    },
    image: {
        width: '30%',
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',

    }
});