import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card, Button } from '@rneui/themed';
import { router } from 'expo-router';
import { obtenerNombreBarrio } from '@/constants/localizar';

type Solicitud = {
    idPoste: number;
    idReclamo: number;
    latitude: number;
    longitude: number;
    estadoPoste: number;
    nombrePoste: string;
    usuarios: {
        nombreUsuario: string;
        apellidoUsuario: string;
        fechaReclamo: string;
        horaReclamo: string;
    }[];
};

interface SolicitudLuminariaCardProps {
    solicitud: Solicitud;
    closeBottomSheet: () => void; 
}

const ReclamoLuminariCardTecnico: React.FC<SolicitudLuminariaCardProps> = ({ solicitud, onVerEnMapa, closeBottomSheet }) => {
    const {
        nombrePoste,
        idReclamo,
        usuarios,
    } = solicitud;

    const verEnMapa = () => {
        onVerEnMapa(solicitud.latitude, solicitud.longitude, solicitud.idPoste);
    };

    const nombreBarrio = obtenerNombreBarrio(solicitud.latitude, solicitud.longitude);
    
    const handleNavigate = () => {
        closeBottomSheet();
        router.push({
            pathname: "informacionSolicitud/informacionSolicitudFromMap",
            params: { idReclamo: idReclamo }
        })
    }

    return (
        <TouchableWithoutFeedback>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            Reclamo: #{idReclamo}
                        </Text>
                        <Text style={styles.subtitle}>Poste: {nombrePoste}</Text>
                        {usuarios?.map(usuario =>
                        (<>
                            <Text style={styles.info}>
                                Vecino: {usuario.nombreUsuario} {usuario.apellidoUsuario}
                            </Text>
                            <Text style={styles.info}>
                                Barrio: {nombreBarrio}
                            </Text>
                            <Text style={styles.info}>
                                Fecha: {usuario.fechaReclamo}
                            </Text>
                            <Text style={styles.info}>
                                Hora: {usuario.horaReclamo}
                            </Text>
                        </>)
                        )}
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
                    <Button
                        title="Ver en mapa"
                        onPress={verEnMapa}
                        buttonStyle={styles.buttonVerMapa}
                        titleStyle={styles.buttonTitle}
                    />
                    <Button
                        title="Información"
                        onPress={handleNavigate}
                        buttonStyle={styles.buttonInformacion}
                        titleStyle={styles.buttonTitle}
                    />
                </View>
            </Card>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 20,
        marginVertical: 12,
        backgroundColor: "#FFFFFF",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    content: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748B",
        marginBottom: 8,
    },
    info: {
        fontSize: 14,
        color: "#94A3B8",
        marginBottom: 6,
    },
    buttonsContainer: {
        alignSelf: 'center',
        marginTop: 5,
    },
    buttonVerMapa: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#3B82F6",
        width: "90%",
        marginBottom: 5,
    },
    buttonInformacion: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#4CAF50",
        width: "95%",
    },
    buttonTitle: {
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default ReclamoLuminariCardTecnico;
