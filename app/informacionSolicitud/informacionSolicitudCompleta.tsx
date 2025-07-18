import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import { getInformacionReclamo, InformacionReclamo } from '@/api/petitions';

export default function informacionSolicitudCompleta() {
    const { solicitudId } = useLocalSearchParams();

    const reclamoId = solicitudId ? parseInt(solicitudId.toString()) : null;

    const [reclamo, setReclamo] = useState<InformacionReclamo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

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
                    <Text style={styles.subHeader}>Detalles de la Solicitud:</Text>
                    <Text style={styles.text}>Tipo: {reclamo.nombreSubTipoReclamo}</Text>
                    <Text style={styles.text}>Estado: {reclamo.nombreEstado}</Text>
                    <Text style={styles.text}>Barrio: {reclamo.nombreBarrio}</Text>
                    {reclamo.nombrePoste && <Text style={styles.text}>Número de poste: {reclamo.nombrePoste}</Text>}
                    {reclamo.nombreAnimal && <Text style={styles.text}>Animal: {reclamo.nombreAnimal}</Text>}
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
                            <Text style={styles.subHeader}>Fotografía del Vecino:</Text>
                            <TouchableOpacity onPress={() => {
                                setModalImage(reclamo.fotoReclamo);
                                setImageModalVisible(true);
                            }}>
                                <Image source={{ uri: reclamo.fotoReclamo }} style={styles.image} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.card}>
                            <Text style={styles.subHeader}>Fotografía del Vecino:</Text>
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

                {/* Reparacion */}
                {(reclamo.nombreEstado === "Resuelto") &&
                    <View style={styles.card}>
                        <Text style={styles.subHeader}>Datos sobre técnico/s a cargo:</Text>
                        {reclamo.nombreTecnico1 && <Text style={styles.text}>Técnico 1: {reclamo.nombreTecnico1} {reclamo.apellidoTecnico2}</Text>}
                        {reclamo.nombreTecnico2 && <Text style={styles.text}>Técnico 2: {reclamo.nombreTecnico2} {reclamo.apellidoTecnico2}</Text>}
                        <Text style={styles.text}>Fecha Reparación: {reclamo.fechaArreglo}</Text>
                        <Text style={styles.text}>Hora del Reparación: {reclamo.horaArreglo}</Text>

                        {reclamo.observacionArreglo ? (
                            <Text style={styles.text}>Observación de la reparación: {reclamo.observacionArreglo}</Text>
                        ) : (
                            <Text style={styles.text}>Sin Observación</Text>
                        )}
                    </View>
                }

                {(reclamo.nombrePoste !== null && reclamo.nombreEstado === "Resuelto") &&
                    <View style={styles.card}>
                        <Text style={styles.subHeader}>Reparaciones realizadas a poste:</Text>

                        {reclamo.arreglosPoste?.map((nombreReparacion, index) => (
                            <Text key={index} style={styles.text}> - {nombreReparacion}</Text>
                        ))}

                    </View>
                }

                {reclamo.fotoArreglo &&
                    (reclamo.fotoArreglo ? (
                        <View style={styles.card}>
                            <Text style={styles.subHeader}>Fotografía de la Reparación</Text>
                            <TouchableOpacity onPress={() => {
                                setModalImage(reclamo.fotoArreglo);
                                setImageModalVisible(true);
                            }}>
                                <Image source={{ uri: reclamo.fotoArreglo }} style={styles.image} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.card}>
                            <Text style={styles.subHeader}>Fotografía</Text>
                            <Text style={styles.text}>Sin foto</Text>
                        </View>
                    ))
                }


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
