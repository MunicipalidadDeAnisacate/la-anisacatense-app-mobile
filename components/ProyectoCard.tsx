import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card } from '@rneui/themed';
import { Button } from '@rneui/themed/dist/Button';
import { router } from 'expo-router';

interface ProyectoCardProps {
    proyecto: ProyectoResponse;
    onDelete: () => void;
}

const ProyectoCard: React.FC<ProyectoCardProps> = ({
    proyecto,
    onDelete
}) => {

    const { id, titulo, descripcion, nombreUsuario, dniUsuario } = proyecto;

    const navigateToInfoProyecto = () => {
        router.push({
            pathname: "/admin/proyectoCiudadanoAdmin/informacionProyecto",
            params: { proyectoIdStr: JSON.stringify(id) }
        })
    }

    return (
        <TouchableWithoutFeedback>
            <Card containerStyle={styles.card}>
                <View style={[styles.content, { flex: 1 }]}>
                    <View style={styles.textContainer}>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.title}>Proyecto Nro. {id}</Text>
                            <Text style={styles.title}>Título: {titulo}</Text>
                        </View>

                        {descripcion &&
                            <View>
                                <Text style={styles.subtitle}>Descripción:</Text>
                                <Text style={styles.subtitle}>{descripcion}</Text>
                            </View>
                        }

                        <Text style={styles.subtitle}>{'\n'}Postulante: {nombreUsuario}</Text>
                        <Text style={styles.subtitle}>D.N.I: {dniUsuario}{'\n'}</Text>


                        <Button
                            title="Ver información"
                            buttonStyle={[styles.button, styles.informationButton]}
                            containerStyle={styles.buttonWrapper}
                            titleStyle={styles.informationButtonText}
                            onPress={navigateToInfoProyecto}
                        />

                        <Button
                            title="Eliminar proyecto"
                            onPress={onDelete}
                            buttonStyle={[styles.button, styles.deleteButton]}
                            containerStyle={styles.buttonWrapper}
                            titleStyle={styles.deleteButtonText}
                        />

                        <Text style={{ textAlign:"center", color:"red", fontSize:10 }}>*No se pueden eliminar proyectos ya asignados a consultas ciudadanas*</Text>
                    </View>
                </View>

            </Card>
        </TouchableWithoutFeedback>
    );
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Guardado':
            return { color: 'gray' };
        case 'En Votacion':
            return { color: 'blue' };
        case 'Votado':
            return { color: 'green' };
        default:
            return { color: 'gray' };
    }
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
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
        marginVertical: 5,
    },
    informationButton: {
        borderWidth: 1,
        borderColor: '#007BFF',
        backgroundColor: '#E9F5FF',
    },
    deleteButton: {
        backgroundColor: '#FDE8E8',
        borderRadius: 8,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#D32F2F',
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 10,
    },
    deleteButtonText: {
        color: '#D32F2F',
        fontWeight: '600',
    },
    informationButtonText: {
        color: '#007BFF',
        fontWeight: '600',
    }
});

export default ProyectoCard;
