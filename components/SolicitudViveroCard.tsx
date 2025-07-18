import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { Card } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@rneui/themed/dist/Button';
import { subTiposDeSolicitud } from '@/constants/tiposYSubTiposConst/SubTiposDeSolicitudes';
import { router } from 'expo-router';


interface SolicitudViveroCardProps {
    id: number;
    nombreSubTipoReclamo: string;
    nombreTipoReclamo: string;
    nombreEstado: string;
    tecnico1?: string;
    tecnico2?: string;
    fechaArreglo?: string;
    horaArreglo?: string;
    nombreVecino: string;
    apellidoVecino: string;
    dniVecino: string;
    fechaPrimerReclamo?: string;
    horaPrimerReclamo?: string;
    solicitudesDeVivero: string[];
    navigateToSolicitudInfo: (id: number) => void;
}


const SolicitudViveroCard: React.FC<SolicitudViveroCardProps> = ({
    id,
    nombreSubTipoReclamo,
    nombreTipoReclamo,
    nombreEstado,
    tecnico1,
    tecnico2,
    fechaArreglo,
    horaArreglo,
    nombreVecino,
    apellidoVecino,
    dniVecino,
    fechaPrimerReclamo,
    horaPrimerReclamo,
    solicitudesDeVivero,
    navigateToSolicitudInfo
}) => {
    const isResolved = nombreEstado === 'Resuelto';

    const isSolicitudVivero = () => {
        if (solicitudesDeVivero.includes(nombreSubTipoReclamo)) {
            return true;
        }
        return false;
    }

    return (
        <TouchableWithoutFeedback>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <View style={styles.textContainer}>


                        <Text style={styles.title}>#{id} - {nombreTipoReclamo}</Text>

                        <Text style={styles.subtitle}>{nombreSubTipoReclamo}</Text>

                        <Text style={styles.info}>
                            Vecino: {nombreVecino} {apellidoVecino}
                        </Text>

                        <Text style={styles.info}>
                            D.N.I: {dniVecino}
                        </Text>

                        <Text style={styles.info}>
                            Fecha de Reclamo: {fechaPrimerReclamo} - {horaPrimerReclamo}
                        </Text>


                        {(fechaArreglo && horaArreglo) &&
                            <Text style={styles.info}>
                                Fecha de Reparación: {fechaArreglo} - {horaArreglo}
                            </Text>
                        }

                        {tecnico1 && <Text style={styles.info}>Técnico 1: {tecnico1}</Text>}

                        {tecnico2 && <Text style={styles.info}>Técnico 2: {tecnico2}</Text>}

                        <Text style={[styles.status, getStatusStyle(nombreEstado)]}>
                            Estado: {nombreEstado}
                        </Text>

                        {/* Ícono de "tick" si está resuelto */}
                        {isResolved && (
                            <MaterialIcons name="check-circle" size={35} color="#7CB16E" style={styles.tickIcon} />
                        )}

                        {!isResolved && isSolicitudVivero() &&
                            <Button
                                title={"Finalizar reserva"}
                                onPress={() => navigateToSolicitudInfo(id)}
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
            return { color: '#1DADDF' };
    }
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
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
    tickIcon: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -16 }],
    },
    buttonWrapper: {
        marginTop: 15,
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

export default SolicitudViveroCard;
