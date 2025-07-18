import React, { useState, useEffect } from 'react';
import {
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Switch,
    Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getColorByAuthDataRol } from '@/constants/Colors';
import LoadingLogoPulse from '@/components/LoadingLogoAnimated';
import { Button, Card } from '@rneui/themed';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import SuccessToast from '@/components/Toasters/SuccesToast';
import FailedToast from '@/components/Toasters/FailedToast';
import { getInformacionConsultaCiudadanaAdmin, patchCerrarConsulta, patchModificarConsulta } from '@/api/petitions';
import getFechaActual from '@/functions/dates/getFechaActual';
import { ChartPie, PieDataItem } from '@/components/ChartPie';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PADDING = 16;

const acciones = ["Consulta cerrada exitosamente!", "Consulta modificada exitosamente!"];
const fallas = ["No se pudo cerrar la consulta! Intente luego", "Falla en modificar consulta!"];

export default function InformacionConsultaCiudadanaAdmin() {
    const { authData } = useAuth();
    const principalColor = getColorByAuthDataRol(authData.rol);

    const { idConsultaStr } = useLocalSearchParams();
    const idConsulta: number = idConsultaStr ? JSON.parse(idConsultaStr as string) : -1;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [consulta, setConsulta] = useState<InformacionConsultaCiudadanaActivaResponse | null>(null);

    // Estado local del switch y su valor original:
    const [mostrarRecuento, setMostrarRecuento] = useState<boolean>(true);
    const [originalMostrarRecuento, setOriginalMostrarRecuento] = useState<boolean>(true);

    const [openCerrarConsultaCD, setOpenCerrarConsultaCD] = useState<boolean>(false);

    const [succesVisible, setSuccesVisible] = useState<boolean>(false);
    const [failedVisible, setFailedVisible] = useState<boolean>(false);
    const [accionRealizada, setAccionRealizada] = useState<string | null>(null);
    const [falla, setFalla] = useState<string | null>(null);

    const [pieData, setPieData] = useState<PieDataItem[] | []>([])

    useEffect(() => {
        (async () => {
            try {
                const data = await getInformacionConsultaCiudadanaAdmin(idConsulta);
                if (data) {
                    setConsulta(data);
                    setMostrarRecuento(data.mostrarRecuento);
                    setOriginalMostrarRecuento(data.mostrarRecuento);

                    setPieData(
                        data.proyectos.map(p => ({
                            name: p.titulo,
                            population: p.cantidad,
                        }))
                    );
                }
            } catch (error) {
                console.error("Error obteniendo consulta ciudadana ", error);
            } finally {
                setIsLoading(false);
            }
        })();
        isConsultaCerrada();
    }, [idConsulta, succesVisible]);


    const handleCerrarConsulta = async () => {
        setIsLoading(true);
        try {
            const success = await patchCerrarConsulta(idConsulta);
            if (success) {
                setAccionRealizada(acciones[0]);
                setSuccesVisible(true);
            } else {
                setFalla(fallas[0]);
                setFailedVisible(true);
            }
        } catch (error) {
            console.error("Error cerrando consulta", error);
            setFalla(fallas[0]);
            setFailedVisible(true);
        } finally {
            setOpenCerrarConsultaCD(false);
            setIsLoading(false);
        }
    };


    const handleModificarRecuento = async () => {
        setIsLoading(true);
        try {
            const success = await patchModificarConsulta(idConsulta);
            if (success) {
                setAccionRealizada(acciones[1]);
                setSuccesVisible(true);
                setOriginalMostrarRecuento(mostrarRecuento);
            } else {
                setFalla(fallas[1]);
                setFailedVisible(true);
            }
        } catch (error) {
            console.error("Error modificando consulta", error);
            setFalla(fallas[1]);
            setFailedVisible(true);
        } finally {
            setIsLoading(false);
        }
    };


    const isConsultaCerrada = (): boolean => {
        if (!consulta) return true;

        const fechaActual = getFechaActual();
        const hoy = fechaActual.dateFormateadoComoBack;
        const horaActual = fechaActual.timeStringSinSeconds;

        if (hoy > consulta.fechaCierre) {
            return false;
        } else if (hoy == consulta.fechaCierre && horaActual > consulta.horaCierre) {
            return false;
        }
        return true;
    }

    const hayPreferencias = (): boolean => {
        if (!consulta) return false;
        let cantPreferencias = consulta.proyectos.reduce((acum, p) => acum + p.cantidad, 0)
        return (cantPreferencias !== 0)
    }


    if (isLoading || !consulta) {
        return <LoadingLogoPulse isLoading />;
    }

    const cambiosPendientes = mostrarRecuento !== originalMostrarRecuento;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Título */}
                <Text style={[styles.title, { color: principalColor }]}>
                    {consulta.titulo}
                </Text>

                {/* Fechas */}
                <View style={[styles.field, styles.row]}>
                    <View style={styles.half}>
                        <Text style={styles.label}>Inicio:</Text>
                        <Text style={styles.value}>
                            {consulta.fechaInicio} - {consulta.horaInicio}
                        </Text>
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>Cierre:</Text>
                        <Text style={styles.value}>
                            {consulta.fechaCierre} - {consulta.horaCierre}
                        </Text>
                    </View>
                </View>

                {isConsultaCerrada() &&
                    <>
                        {/* Switch de recuento */}
                        < View style={styles.field}>
                            <Text style={styles.label}>Recuento de preferencias público:</Text>
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchText}>
                                    {mostrarRecuento ? 'Mostrar recuento' : 'Ocultar recuento'}
                                </Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: principalColor }}
                                    thumbColor="#f4f3f4"
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={setMostrarRecuento}
                                    value={mostrarRecuento}
                                />
                            </View>
                        </View>

                        {/* Botones */}
                        <View style={styles.buttonsRow}>
                            {/* Cerrar consulta */}
                            <Button
                                title="Cerrar consulta"
                                onPress={() => setOpenCerrarConsultaCD(true)}
                                buttonStyle={[styles.button, styles.deleteButton]}
                                containerStyle={styles.buttonWrapper}
                                titleStyle={styles.deleteButtonText}
                            />

                            {/* Guardar cambios */}
                            <Button
                                title="Guardar cambios"
                                onPress={handleModificarRecuento}
                                disabled={!cambiosPendientes}
                                buttonStyle={[styles.button, cambiosPendientes ? {} : styles.disabledButton]}
                                containerStyle={styles.buttonWrapper}
                            />
                        </View>
                    </>
                }

                {hayPreferencias() ?
                    (<Card containerStyle={styles.card}>
                        < ChartPie
                            title="Resultados de la Consulta"
                            data={pieData}
                        />
                    </Card>
                    ) : (
                        <Card containerStyle={[styles.card, {minHeight: 250, flexDirection:"column", justifyContent:"center", alignItems:"center"}]}>
                            <MaterialIcons name="info-outline" size={64} color={getColorByAuthDataRol(authData.rol)} style={{alignSelf:"center"}}/>
                            <Text style={{ fontWeight:"bold", fontSize: 20, textAlign:"center" }}>Aún no hay preferencias de vecinos</Text>
                        </Card>
                    )
                }

            </ScrollView>

            {/* Diálogos */}
            <ConfirmationDialog
                visible={openCerrarConsultaCD}
                title="¿Cerrar consulta ahora?"
                description="Los vecinos ya no podrán elegir proyectos."
                confirmText="Sí, cerrar"
                cancelText="No"
                onConfirm={handleCerrarConsulta}
                onCancel={() => setOpenCerrarConsultaCD(false)}
            />

            {/* Toasts */}
            <SuccessToast
                visible={succesVisible}
                message={accionRealizada || ''}
                onHide={() => setSuccesVisible(false)}
            />
            <FailedToast
                visible={failedVisible}
                message={falla || ''}
                onHide={() => setFailedVisible(false)}
            />
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    scrollContent: { padding: PADDING, paddingBottom: PADDING * 2 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: PADDING, textAlign: 'center' },
    field: { marginBottom: PADDING },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    half: { width: '48%' },
    label: { fontSize: 16, fontWeight: '600', color: '#333' },
    value: { fontSize: 16, color: '#555', marginTop: 4 },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'space-between',
        width: width - PADDING * 2
    },
    switchText: { fontSize: 16, color: '#333' },
    card: {
        alignSelf: "center",
        width: "98%",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginVertical: 10,
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonsRow: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: PADDING
    },
    buttonWrapper: {
        marginVertical: 5,
        marginHorizontal: 4
    },
    button: {
        borderRadius: 8,
        paddingVertical: 10
    },
    deleteButton: {
        backgroundColor: '#FDE8E8',
        borderWidth: 1,
        borderColor: '#D32F2F'
    },
    deleteButtonText: {
        color: '#D32F2F',
        fontWeight: '600'
    },
    disabledButton: {
        backgroundColor: '#CCC'
    }
});
