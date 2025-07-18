import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import { getInformacionReclamo, InformacionReclamo } from '@/api/petitions';

export default function informacionSolicitudFromMap() {
    const { idReclamo } = useLocalSearchParams();

    const reclamoId = idReclamo ? parseInt(idReclamo.toString()) : null;

    const [reclamo, setReclamo] = useState<InformacionReclamo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isImageModalVisible, setImageModalVisible] = useState(false); // Asegurarse de inicializar hooks aquí

    
    useEffect(() => {
        if (!reclamoId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const reclamoData = await getInformacionReclamo(reclamoId);
                setReclamo(reclamoData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reclamoId]);


    if (loading) {
        return <LoadingLogoAnimatedTransparent isLoading />;
    }


    if (!reclamo) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>No se pudo cargar la información del reclamo.</Text>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.header}>#{reclamo.reclamoId} - {reclamo.nombreTipoReclamo}</Text>

                {/* Detalles del Reclamo */}
                <View style={styles.card}>
                    <Text style={styles.subHeader}>Detalles del Reclamo</Text>
                    <Text style={styles.text}>Tipo: {reclamo.nombreSubTipoReclamo}</Text>
                    <Text style={styles.text}>Estado: {reclamo.nombreEstado}</Text>
                    {reclamo.nombrePoste && <Text style={styles.text}>Número de poste: {reclamo.nombrePoste}</Text>}

                    {reclamo.nombrePoste == null &&
                        (reclamo.observacionReclamo ?
                            (<Text style={styles.text}>Observación: {reclamo.observacionReclamo}</Text>) :
                            (<Text style={styles.text}>Observación: Sin observación</Text>))
                    }

                </View>

                {/* Foto del Reclamo */}
                {reclamo.nombrePoste == null &&
                    (reclamo.fotoReclamo ? (
                        <View style={styles.card}>
                            <Text style={styles.subHeader}>Fotografía</Text>
                            
                            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                                <Image source={{ uri: reclamo.fotoReclamo }} style={styles.image} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.card}>
                            <Text style={styles.subHeader}>Fotografía</Text>
                            <Text style={styles.text}>Sin foto</Text>
                        </View>
                    ))
                }

                {/* Vecinos */}
                <View style={styles.card}>
                    <Text style={styles.subHeader}>Vecinos Involucrados</Text>
                    {reclamo.vecinos.map((vecino, index) => (
                        <View key={index} style={styles.vecinoCard}>
                            <Text style={styles.text}>{vecino.nombre} {vecino.apellido}</Text>
                            <Text style={styles.text}>DNI: {vecino.dni}</Text>
                            <Text style={styles.text}>Mail: {vecino.mail}</Text>
                            <Text style={styles.text}>Teléfono: {vecino.telefono}</Text>
                            <Text style={styles.text}>Fecha Reclamo: {vecino.fechaReclamo} - {vecino.horaReclamo}</Text>
                            <Text style={styles.text}>Domicilio: </Text>
                            {vecino.nombreCalle && vecino.numeroCalle &&
                                <Text style={styles.text}>      Calle: {vecino.nombreCalle} - {vecino.numeroCalle}</Text>
                            }
                            {vecino.manzana && vecino.lote &&
                                <Text style={styles.text}>      Manzana: {vecino.manzana} - Lote: {vecino.lote}</Text>
                            }
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Modal para mostrar la imagen ampliada */}
            <Modal visible={isImageModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setImageModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: reclamo.fotoReclamo }} style={styles.modalImage} resizeMode="contain" />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    vecinoCard: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
    }
});
