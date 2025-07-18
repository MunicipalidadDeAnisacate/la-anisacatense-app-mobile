import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '@rneui/themed';

const solicitudComoVecinoImage = require("../assets/images/menu/solicitud-como-vecino.png")

export default function SolicitudComoVecinoButton({ setDialog }) {
    return (
            <TouchableOpacity onPress={setDialog}>
                <Card containerStyle={styles.card}>
                    <View style={styles.content}>
                        <Image
                            source={solicitudComoVecinoImage}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>CARGAR SOLICITUD COMO VECINO</Text>
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