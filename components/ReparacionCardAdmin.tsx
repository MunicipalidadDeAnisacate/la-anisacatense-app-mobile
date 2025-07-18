import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card } from '@rneui/themed';
import { getNombreBarrio } from '@/functions/solicitudCardFunctions/getNombreBarrio';
import { Button } from '@rneui/themed/dist/Button';
import { router } from 'expo-router';

interface ReparacionCardProps {
    id: number;
    nombrePoste?: string;
    nombreTipoReclamo: string;
    nombreSubTipoReclamo?: string;
    fechaReparacion?: string;
    nombreAnimal?: string;
    horaReparacion?: string;
    nombreEstadoReclamo?: string;
    tecnico1: string;
    tecnico2?: string;
    nombreBarrio?: string;
    latitud?: number;
    longitud?: number;
}

const ReparacionCardAdmin: React.FC<ReparacionCardProps> = ({
    id,
    nombrePoste,
    nombreTipoReclamo,
    nombreSubTipoReclamo,
    fechaReparacion,
    horaReparacion,
    nombreAnimal,
    nombreEstadoReclamo,
    tecnico1,
    tecnico2,
    nombreBarrio,
    latitud,
    longitud
}) => {

    const navigateToReparacionInfo = (id: number) => {
        router.push({
            pathname: "/informacionReparacion/informacionReparacion",
            params: { reparacionIdStr: JSON.stringify(id) }
        })
    }


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
                            Fecha de Reparación: {fechaReparacion} - {horaReparacion}
                        </Text>

                        <Text style={styles.info}>Técnico 1: {tecnico1}</Text>

                        {tecnico2 && <Text style={styles.info}>Técnico 2: {tecnico2}</Text>}

                        {nombreEstadoReclamo &&
                            <Text style={[styles.status, getStatusStyle(nombreEstadoReclamo)]}>
                                Estado: {nombreEstadoReclamo}
                            </Text>
                        }

                        {(!nombreEstadoReclamo && !nombreSubTipoReclamo) &&
                            <Button
                                title={"Ver Información"}
                                onPress={() => navigateToReparacionInfo(id)}
                                buttonStyle={[styles.button, styles.secondaryButton]}
                                containerStyle={styles.buttonWrapper}
                                titleStyle={styles.secondaryButtonText}
                            />
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

    buttonWrapper: {
        marginTop:15,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 10,
    },
    secondaryButton: {
        backgroundColor: '#E9F5FF',
    },
    secondaryButtonText: {
        color: '#007BFF',
    },
});

export default ReparacionCardAdmin;
