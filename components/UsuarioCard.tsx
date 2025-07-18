import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Button, Card } from '@rneui/themed';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { parseLocalDate } from '@/functions/dates/parseLocalDate';
import getStringFromDateForConsole from '@/functions/dates/getStringFromDateForConsole';

interface UsuarioCardProps {
    usuario: {
        id: number;
        dni: string;
        nombre: string;
        apellido: string;
        nombreTipoUsuario: string;
        nombreCuadrilla?: string;
        mail?: string;
        telefono?: string;
        fechaNacimiento?: Date;
        nombreBarrio?: string;
        nombreCalle?: string;
        numeroCalle?: string;
        manzana?: string;
        lote?: string;
    };
    tipoUsuarioId: number;
    onDelete: () => void;
}

const UsuarioCard: React.FC<UsuarioCardProps> = ({ usuario, tipoUsuarioId, onDelete }) => {
    const { authData } = useAuth();

    const navigateToEditUser = () => {
        router.push({
            pathname: "/admin/usuarios/usuarioEditForm",
            params: { usuarioStr: JSON.stringify(usuario), tipoUsuarioId: JSON.stringify(tipoUsuarioId) }
        });
    }

    const navigateToActivityUser = () => {
        router.push({
            pathname: "/admin/usuarios/usuarioActivity",
            params: { usuarioStr: JSON.stringify(usuario) }
        })
    }

    const navigateToTecnicoActivitySolicitudes = () => {
        router.push({
            pathname: "/admin/usuarios/tecnicos/tecnicoActivitySolicitudes",
            params: { usuarioStr: JSON.stringify(usuario) }
        })
    }

    const navigateToTecnicoActivityReparaciones = () => {
        router.push({
            pathname: "/admin/usuarios/tecnicos/tecnicoActivityReparaciones",
            params: { usuarioStr: JSON.stringify(usuario) }
        })
    }

    return (
        <TouchableWithoutFeedback>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <Text style={styles.title}>{usuario.nombre} {usuario.apellido}</Text>
                    <Text style={styles.subtitle}>DNI: {usuario.dni}</Text>
                    <Text style={styles.subtitle}>
                        Tipo usuario: {usuario.nombreTipoUsuario}
                        {usuario.nombreTipoUsuario === "tecnico" && usuario.nombreCuadrilla && (
                            <Text style={styles.subtitle}> - Cuadrilla de {usuario.nombreCuadrilla}</Text>
                        )}
                    </Text>
                    {usuario.mail && <Text style={styles.info}>Email: {usuario.mail}</Text>}
                    {usuario.telefono && <Text style={styles.info}>Teléfono: {usuario.telefono}</Text>}
                    {usuario.fechaNacimiento && <Text style={styles.info}>Fecha de Nacimiento: {getStringFromDateForConsole(parseLocalDate(usuario.fechaNacimiento))}</Text>}
                    {usuario.nombreBarrio && <Text style={styles.info}>Barrio: {usuario.nombreBarrio}</Text>}
                    {usuario.nombreCalle && usuario.numeroCalle && (
                        <Text style={styles.info}>Dirección: {usuario.nombreCalle} {usuario.numeroCalle}</Text>
                    )}
                    {usuario.manzana && usuario.lote && (
                        <Text style={styles.info}>Manzana: {usuario.manzana} - Lote: {usuario.lote}</Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    {(authData.id != usuario.id) &&
                        <Button
                            title="Modificar Usuario"
                            onPress={navigateToEditUser}
                            buttonStyle={styles.button}
                            containerStyle={styles.buttonWrapper}
                        />
                    }

                    {tipoUsuarioId === 1 &&
                        <Button
                            title="Ver Actividad"
                            onPress={navigateToActivityUser}
                            buttonStyle={[styles.button, styles.secondaryButton]}
                            containerStyle={styles.buttonWrapper}
                            titleStyle={styles.secondaryButtonText}
                        />
                    }

                    {tipoUsuarioId === 2 &&
                        <>
                            <Button
                                title="Ver Solicitudes Resueltas"
                                onPress={navigateToTecnicoActivitySolicitudes}
                                buttonStyle={[styles.button, styles.secondaryButton]}
                                containerStyle={styles.buttonWrapper}
                                titleStyle={styles.secondaryButtonText}
                            />

                            <Button
                                title="Ver Reparaciones"
                                onPress={navigateToTecnicoActivityReparaciones}
                                buttonStyle={[styles.button, styles.secondaryButton]}
                                containerStyle={styles.buttonWrapper}
                                titleStyle={styles.secondaryButtonText}
                            />
                        </>
                    }

                    {(authData.id != usuario.id) &&
                        <Button
                            title="Eliminar usuario"
                            onPress={onDelete}
                            buttonStyle={[styles.button, styles.deleteButton]}
                            containerStyle={styles.buttonWrapper}
                            titleStyle={styles.deleteButtonText}
                        />
                    }
                </View>
            </Card>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 20,
        marginVertical: 15,
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555555',
        marginBottom: 6,
    },
    info: {
        fontSize: 14,
        color: '#777777',
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: 'column',
    },
    buttonWrapper: {
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 10,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#007BFF',
        backgroundColor: '#E9F5FF',
    },
    secondaryButtonText: {
        color: '#007BFF',
    },
    deleteButton: {
        backgroundColor: '#FDE8E8',
        borderRadius: 8,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#D32F2F',
    },
    deleteButtonText: {
        color: '#D32F2F',
        fontWeight: '600',
    },
});

export default UsuarioCard;
