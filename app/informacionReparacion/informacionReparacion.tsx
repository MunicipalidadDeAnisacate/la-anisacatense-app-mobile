import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import { getInformacionReparacion } from '@/api/petitions';

export default function informacionReparacion() {
    const { reparacionIdStr } = useLocalSearchParams();
    const reparacionId = reparacionIdStr ? parseInt(reparacionIdStr.toString()) : null;

    const [reparacion, setReparacion] = useState<InformacionReparacionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    useEffect(() => {
        if (!reparacionId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const reclamoData = await getInformacionReparacion(reparacionId);
                setReparacion(reclamoData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reparacionId]);

    if (loading) {
        return <LoadingLogoAnimatedTransparent isLoading />;
    }

    if (!reparacion) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>No se pudo cargar la información de la reparación.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.header}>#{reparacion.id} - {reparacion.nombreTipoReclamo}</Text>

                {/* Detalles de la reparacion */}
                <View style={styles.card}>
                    <Text style={styles.subHeader}>Detalles de la Reparación:</Text>
                    
                    <Text style={styles.text}>Barrio: {reparacion.nombreBarrio}</Text>
                    
                    {reparacion.nombrePoste && <Text style={styles.text}>Número de poste reparado: {reparacion.nombrePoste}</Text>}

                    <Text style={styles.text}>Fecha Reparación: {reparacion.fechaArreglo}</Text>
                    <Text style={styles.text}>Hora del Reparación: {reparacion.horaArreglo}</Text>
                </View>

                {/* Datos sobre la Reparacion */}
                <View style={styles.card}>
                    <Text style={styles.subHeader}>Datos sobre técnico/s a cargo:</Text>
                    {reparacion.nombreTecnico1 && <Text style={styles.text}>Técnico 1: {reparacion.nombreTecnico1} {reparacion.apellidoTecnico2}</Text>}
                    {reparacion.nombreTecnico2 && <Text style={styles.text}>Técnico 2: {reparacion.nombreTecnico2} {reparacion.apellidoTecnico2}</Text>}
                </View>

                <View style={styles.card}>
                    <Text style={styles.subHeader}>Observacion de la Reparación:</Text>
                    {reparacion.observacionArreglo ?
                        (
                            <Text style={styles.text}>{reparacion.observacionArreglo}</Text>
                        ) : (
                            <Text style={styles.text}>Sin observación</Text>
                        )
                    }
                </View>

                {/* Foto del Reclamo */}
                {reparacion.fotoArreglo ? (
                    <View style={styles.card}>
                        <Text style={styles.subHeader}>Fotografía de la Reparación:</Text>
                        <TouchableOpacity onPress={() => {
                            setModalImage(reparacion.fotoArreglo);
                            setImageModalVisible(true);
                        }}>
                            <Image source={{ uri: reparacion.fotoArreglo }} style={styles.image} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.subHeader}>Fotografía de la Reparación:</Text>
                        <Text style={styles.text}>Sin foto</Text>
                    </View>
                )}

            </ScrollView>

            {/* Modal para mostrar la imagen ampliada */}
            <Modal visible={isImageModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setImageModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                    {modalImage && (
                        <Image source={{ uri: modalImage }} style={styles.modalImage} resizeMode="contain" />
                    )}
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
