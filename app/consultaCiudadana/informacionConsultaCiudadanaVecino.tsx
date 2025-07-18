import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Linking
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import { getInformacionConsultaCiudadana, postPreferencia, subscribeResultadosConsultaWS } from '@/api/petitions';
import { Card } from '@rneui/themed';
import { Button } from '@rneui/themed/dist/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getColorByAuthDataRol } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import ConsultaCiudadanaProgressRecuento from '@/components/ConsultaCiudadanaProgressRecuento';
import ConsultaCiudadanaProgressSinRecuento from '@/components/ConsultaCiudadanaProgressSinRecuento';
import SuccessToast from '@/components/Toasters/SuccesToast';
import FailedToast from '@/components/Toasters/FailedToast';
import ConfirmationDialog from '@/components/ConfirmationDialog';


export default function informacionConsultaCiudadanaVecino() {
    const { authData } = useAuth();
    const principalColor = getColorByAuthDataRol(authData.rol);

    const { consultaIdStr } = useLocalSearchParams();
    const consultaId = consultaIdStr ? JSON.parse(consultaIdStr as string) : null;

    const [consulta, setConsulta] = useState<InformacionConsultaCiudadanaActivaResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const [openCD, setOpenCD] = useState<boolean>(false);
    const [openSuccessToast, setOpenSuccessToast] = useState<boolean>(false);
    const [openFailedToast, setOpenFailedToast] = useState<boolean>(false);


    useEffect(() => {
        let isMounted = true; // Para evitar actualizaciones en componentes desmontados
        const cleanupWs = { current: () => { } }; // Limpieza de WebSocket

        const fetchDataAndSubscribe = async () => {
            if (!consultaId || !isMounted) return;

            try {
                setLoading(true);

                // 1. Carga inicial de datos
                const data = await getInformacionConsultaCiudadana(consultaId, authData.id);
                if (!isMounted) return;

                setConsulta(data);

                // 2. Suscripción WebSocket
                cleanupWs.current = subscribeResultadosConsultaWS(consultaId, (proyectosDto) => {
                    // Actualización del estado
                    setConsulta(prev => {
                        if (!prev) return prev;

                        const nuevosProyectos = prev.proyectos.map(p => {
                            const actualizado = proyectosDto.find(x => x.id === p.id);
                            return actualizado ? { ...p, cantidad: actualizado.cantidad } : p;
                        });

                        // Evita rerenders innecesarios
                        return prev.proyectos.every((p, i) => p.cantidad === nuevosProyectos[i].cantidad)
                            ? prev
                            : { ...prev, proyectos: nuevosProyectos };
                    });
                });
            } catch (error) {
                console.error("Error cargando consulta:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDataAndSubscribe();

        // 3. Cleanup mejorado
        return () => {
            isMounted = false;
            cleanupWs.current();
        };
    }, [consultaId, authData.id]);


    const [proyectoPreferidoId, setProyectoPreferidoId] = useState<number|undefined>();
    const openConfirmationDialog = (proyectoId: number) => {
        setProyectoPreferidoId(proyectoId);
        setOpenCD(true);
    }


    const onVote = async () => {
        if (!proyectoPreferidoId) return;

        let success;
        try {
            setLoading(true);
            success = await postPreferencia(consultaId, proyectoPreferidoId, authData.id);
        } catch (e) {
            console.error("Error al elegir:", e);
        } finally {
            setOpenCD(false);
            setLoading(false);
            if (success) {
                setConsulta(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        proyectoIdVotado: proyectoPreferidoId
                    };
                });
                setOpenSuccessToast(true);
            } else {
                setOpenFailedToast(true);
            }
        }
    };


    const getProyectosConRecuento = (): ProyectoEnVotacionConRecuento[] => {
        const proyectos = consulta?.proyectos
        const proyectosMapeados = proyectos?.map((p) => { return { id: p.id, titulo: p.titulo, votos: p.cantidad } })
        return proyectosMapeados ? proyectosMapeados : [];
    }

    const getProyectosSinRecuento = (): ProyectoEnVotacionSinRecuento[] => {
        const proyectos = consulta?.proyectos
        const proyectosMapeados = proyectos?.map((p) => { return { id: p.id, titulo: p.titulo } })
        return proyectosMapeados ? proyectosMapeados : [];
    }


    if (loading) {
        return <LoadingLogoAnimatedTransparent isLoading />;
    }

    if (!consulta) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>No se pudo cargar la información de la consulta.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.header}>
                    {consulta.titulo}
                </Text>

                {/* Datos básicos */}
                {(consulta.descripcion) &&
                    <Card containerStyle={styles.card}>
                        <Text style={styles.subHeader}>Descripción de la Consulta</Text>
                        <Text style={styles.text}>{consulta.descripcion}</Text>
                    </Card>
                }

                <Text style={{ marginVertical: 15, textAlign: "center" }}>
                    Seleccione el círculo del proyecto que prefiera
                </Text>

                {consulta.mostrarRecuento ?
                    (
                        <ConsultaCiudadanaProgressRecuento
                            proyectos={getProyectosConRecuento()}
                            onVote={openConfirmationDialog}
                            proyectoIdVotado={consulta.proyectoIdVotado ? consulta.proyectoIdVotado : null}
                        />
                    ) : (
                        <ConsultaCiudadanaProgressSinRecuento
                            proyectos={getProyectosSinRecuento()}
                            onVote={openConfirmationDialog}
                            proyectoIdVotado={consulta.proyectoIdVotado ? consulta.proyectoIdVotado : null}
                        />
                    )
                }

                {/* Proyectos asociados */}
                {consulta.proyectos.map(p => {
                    return (
                        <View key={p.id}>
                            <Card containerStyle={styles.card}>
                                <Text style={styles.subHeader}>Proyecto: {p.titulo}</Text>
                                <View>
                                    <Text style={styles.text}>Información Sobre Proyecto:</Text>
                                    {p.descripcion && <Text style={styles.text}>{p.descripcion}</Text>}
                                    {p.archivoUrl &&
                                        <Button
                                            title="Ver archivo adjunto"
                                            icon={
                                                <MaterialCommunityIcons
                                                    name="file-document-outline"
                                                    size={25}
                                                    color="white"
                                                />
                                            }
                                            buttonStyle={[styles.button, { backgroundColor: principalColor }]}
                                            containerStyle={styles.buttonWrapper}
                                            titleStyle={styles.buttonText}
                                            onPress={() => Linking.openURL(p.archivoUrl)}
                                        />
                                    }
                                </View>
                            </Card>
                        </View>)
                })}

            </ScrollView>

            <ConfirmationDialog
                visible={openCD}
                title={"¿Cargar Preferencia?"}
                description={'Una vez que seleccione "Aceptar" se cargará el proyecto que usted prefiere y no podrá cambiar de decisión'}
                confirmText={" Aceptar "}
                cancelText={"Cancelar"}
                onConfirm={onVote}
                onCancel={() => setOpenCD(false)}
            />

            <SuccessToast
                visible={openSuccessToast}
                message={"¡Consulta elegida exitosamente!"}
                onHide={() => setOpenSuccessToast(false)}
            />

            <FailedToast
                visible={openFailedToast}
                message={"¡Falla al cargar la consulta, intente luego!"}
                onHide={() => setOpenFailedToast(false)}
            />

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9'
    },
    scrollContent: {
        padding: 16
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center'
    },
    card: {
        borderRadius: 8,
        padding: 10,
        marginVertical: 13,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        elevation: 2,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333'
    },
    link: {
        fontSize: 16,
        color: '#1E90FF',
        marginBottom: 4
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16
    },

    buttonWrapper: {
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 10,
    },
    informationButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    }
});
