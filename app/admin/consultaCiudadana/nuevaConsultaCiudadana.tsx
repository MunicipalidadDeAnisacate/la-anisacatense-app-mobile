import ConfirmationDialog from "@/components/ConfirmationDialog";
import FailedToast from "@/components/Toasters/FailedToast";
import SuccessToast from "@/components/Toasters/SuccesToast";
import { getColorByAuthDataRol, principalColorAdmin } from "@/constants/Colors";
import { Button } from "@rneui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import { createNewConsultaCiudadana } from "@/api/petitions";
import { DatePickerInput } from "@/components/DatePickerInput";
import getStringFromDateForConsole from "@/functions/dates/getStringFromDateForConsole";
import { useProyectosSelection } from "@/context/ProyectosContext";
import { Ionicons } from "@expo/vector-icons";
import { formatDateForBackend } from "@/functions/dates/formatDateForBackendFINAL";
import { formatTime } from "@/functions/dates/formatTimeFINAL";

const principalColor = principalColorAdmin;


export default function nuevaConsultaCiudadana() {
    const { selectedProyectos, removeProyecto } = useProyectosSelection();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [succesVisible, setSuccesVisible] = useState<boolean>(false);
    const [failedVisible, setFailedVisible] = useState<boolean>(false);

    const [tituloEleccion, setTituloEleccion] = useState<string>("");
    const [descripcionEleccion, setDescripcionEleccion] = useState<string>("");
    const [fechaInicioEleccion, setFechaInicioEleccion] = useState<Date | null>();
    const [horaInicioEleccion, setHoraInicioEleccion] = useState<Date | null>(null)
    const [fechaCierreEleccion, setFechaCierreEleccion] = useState<Date | null>();
    const [horaCierreEleccion, setHoraCierreEleccion] = useState<Date | null>(null)
    const [mostrarRecuentoEleccion, setMostrarRecuentoEleccioon] = useState<boolean>(true);

    const [isConfirmDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
    const [isConfirmDialogOpenCancel, setIsConfirmDialogOpenCancel] = useState<boolean>(false);


    const goBack = () => {
        setIsConfirmDialogOpenCancel(false);
        router.back();
    }


    const validate = (): boolean => {
        if (!tituloEleccion.trim() || !(tituloEleccion.trim().length > 0)) {
            Alert.alert("Sin Titulo", "No puede cargar una consulta ciudadana sin un titulo.");
            return false;
        }

        if (!horaCierreEleccion || !fechaCierreEleccion) {
            Alert.alert("Sin fecha de cierre", "Debe ingresar una fecha y hora de cierre de la consulta ciudadana.");
            return false;
        }

        if (fechaInicioEleccion && fechaCierreEleccion &&
            new Date(fechaCierreEleccion) < new Date(fechaInicioEleccion)) {
            Alert.alert("Fechas inconsistentes", "La fecha de cierre no puede ser anterior a la de inicio");
            return false;
        }

        if (selectedProyectos.length < 2) {
            Alert.alert("Proyectos insuficientes", "Debe seleccionar al menos 2 proyectos y como maximo 5.")
            return false;
        }

        return true;
    }


    const openConfirmationDialog = () => {
        if (validate()) setIsConfirmationDialogOpen(true);
    }


    const navigateToProyectosSelect = () => {
        router.push("/admin/proyectoCiudadanoAdmin/proyectosSeleccionables")
    }


    const handleSubmit = async () => {
        setIsConfirmationDialogOpen(false);
        setIsLoading(true);

        const nuevaConsulta: CreateConsultaCiudadanaRequest = {
            titulo: tituloEleccion.trim(),
            descripcion: descripcionEleccion.trim(),
            fechaInicio: fechaInicioEleccion ? formatDateForBackend(fechaInicioEleccion) : formatDateForBackend(new Date()),
            horaInicio: horaInicioEleccion ? formatTime(horaInicioEleccion): formatTime(new Date()),
            fechaCierre: formatDateForBackend(fechaCierreEleccion),
            horaCierre: formatTime(horaCierreEleccion),
            mostrarRecuento: mostrarRecuentoEleccion,
            proyectosId: selectedProyectos.map(p => p.id),
        }

        try {    
            const success = await createNewConsultaCiudadana(nuevaConsulta);

            if (success) {
                setSuccesVisible(true);
                setTimeout(() => router.back(), 3000);
            } else {
                setFailedVisible(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <LoadingLogoAnimatedTransparent isLoading />}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>
                        Crear nueva consulta ciudadana
                    </Text>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={[styles.instructionText, { textAlign: "center" }]}>
                            Aquí puedes crear una nueva consulta ciudadana para luego a traves de "Consulta Ciudadana" sea votada,
                            debe tener en cuenta:
                        </Text>
                        <Text style={[styles.instructionText, { textAlign: "left" }]}>
                            - Cada consulta debe tener titulo.
                            {'\n'}- Ingresar una descripción es opcional.
                            {'\n'}- Si no ingresa una fecha y hora de inicio de consulta la misma sera generada en el instante en el que se cargue.
                        </Text>
                    </View>

                    <View style={styles.form}>

                        <View style={styles.field}>
                            <Text style={styles.label}>Título de consulta ciudadana:</Text>
                            <TextInput
                                placeholder="Escribe el título"
                                placeholderTextColor="#757575"
                                value={tituloEleccion}
                                onChangeText={setTituloEleccion}
                                style={styles.input}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Breve descripción de la consulta ciudadana: (opcional)</Text>
                            <TextInput
                                placeholder="Escribe la descripción"
                                placeholderTextColor="#757575"
                                textAlignVertical="top"
                                value={descripcionEleccion}
                                onChangeText={setDescripcionEleccion}
                                style={[styles.input, { height: 80 }]}
                                multiline
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Fecha y Hora de Inicio: (opcional)</Text>
                            <View style={styles.dateTimeContainer}>
                                <View style={{ width: "50%" }}>
                                    <DatePickerInput
                                        buttonTitle={fechaInicioEleccion ? getStringFromDateForConsole(fechaInicioEleccion) : "Fecha"}
                                        date={fechaInicioEleccion}
                                        onChange={setFechaInicioEleccion}
                                        inputStyle={styles.dateTimeInput}
                                        maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
                                        minimumDate={new Date()}
                                        buttonBackgroundColorByRol={principalColorAdmin}
                                    />
                                </View>
                                <View style={{ width: "50%" }}>
                                    <DatePickerInput
                                        mode="time"
                                        date={horaInicioEleccion ?? fechaInicioEleccion ?? new Date()}
                                        minimumDate={fechaInicioEleccion ?? new Date()}
                                        onChange={setHoraInicioEleccion}
                                        buttonTitle={
                                            horaInicioEleccion
                                                ? formatTime(horaInicioEleccion)
                                                : "Hora"
                                        }
                                        inputStyle={styles.dateTimeInput}
                                        buttonBackgroundColorByRol={principalColorAdmin}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Fecha y Hora de Cierre:</Text>
                            <View style={styles.dateTimeContainer}>
                                <View style={{ width: "50%" }}>
                                    <DatePickerInput
                                        buttonTitle={fechaCierreEleccion ? getStringFromDateForConsole(fechaCierreEleccion) : "Fecha"}
                                        date={fechaCierreEleccion}
                                        onChange={setFechaCierreEleccion}
                                        inputStyle={styles.dateTimeInput}
                                        maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
                                        minimumDate={fechaInicioEleccion || new Date()}
                                        buttonBackgroundColorByRol={principalColorAdmin}
                                    />
                                </View>
                                <View style={{ width: "50%" }}>
                                    <DatePickerInput
                                        date={horaCierreEleccion ? new Date(horaCierreEleccion) : new Date()}
                                        onChange={setHoraCierreEleccion}
                                        buttonTitle={
                                            horaCierreEleccion
                                                ? formatTime(horaCierreEleccion)
                                                : "Hora"
                                        }
                                        mode='time'
                                        inputStyle={styles.dateTimeInput}
                                        buttonBackgroundColorByRol={principalColorAdmin}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Recuento de preferencias publico: (Por defecto es publico)</Text>
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchText}>
                                    {mostrarRecuentoEleccion ? "Mostrar recuento" : "No mostrar recuento"}
                                </Text>
                                <Switch
                                    trackColor={{ false: "#767577", true: principalColorAdmin }}
                                    thumbColor={mostrarRecuentoEleccion ? "#f4f3f4" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={setMostrarRecuentoEleccioon}
                                    value={mostrarRecuentoEleccion}
                                />
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Seleccionar proyectos:</Text>
                            <Button
                                title="Seleccionar proyectos"
                                buttonStyle={[styles.button, { backgroundColor: principalColor }]}
                                containerStyle={styles.buttonSpacing}
                                onPress={navigateToProyectosSelect}
                            />
                            {(selectedProyectos.length > 0) &&
                                selectedProyectos.map(proyecto => (
                                    <View style={[styles.input, { height: 55, marginVertical: 3 }]} key={proyecto.id}>
                                        <View style={styles.projectRow}>
                                            <Text style={styles.projectText}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {proyecto.id} - {proyecto.titulo}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.deleteFab}
                                                onPress={() => removeProyecto(proyecto.id)}
                                            >
                                                <Ionicons name="trash" size={15} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>

                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cargar Consulta Ciudadana"
                            buttonStyle={[styles.button, { backgroundColor: principalColor }]}
                            containerStyle={styles.buttonSpacing}
                            onPress={openConfirmationDialog}
                        />
                        <Button
                            title="Cancelar"
                            type="outline"
                            buttonStyle={styles.outlineButton}
                            titleStyle={styles.outlineButtonText}
                            containerStyle={styles.buttonSpacing}
                            onPress={() => setIsConfirmDialogOpenCancel(true)}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>

            <ConfirmationDialog
                visible={isConfirmDialogOpen}
                title="¿Crear la consulta ciudadana?"
                onConfirm={handleSubmit}
                confirmText="Crear consulta"
                onCancel={() => setIsConfirmationDialogOpen(false)}
            />

            <ConfirmationDialog
                visible={isConfirmDialogOpenCancel}
                title="¿Cancelar carga?"
                description="Se perderán los cambios. ¿Deseas continuar?"
                onConfirm={goBack}
                onCancel={() => setIsConfirmDialogOpenCancel(false)}
            />

            <SuccessToast
                visible={succesVisible}
                message="¡Consulta ciudadana cargada exitosamente!"
                onHide={() => setSuccesVisible(false)}
            />

            <FailedToast
                visible={failedVisible}
                message="No se pudo cargar la consulta ciudadana. Intenta más tarde."
                onHide={() => setFailedVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 60
    },
    title: {
        fontSize: 25,
        color: principalColor,
        marginBottom: 8,
        fontWeight: "bold",
        textAlign: "center"
    },
    instructionText: {
        fontSize: 16,
        color: "#4A4A4A",
    },
    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        elevation: 3,
    },
    field: {
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#333333",
        marginBottom: 8,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#F0F1F3",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    dateTimeInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#F0F1F3",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },

    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        gap: 10,
    },
    switchText: {
        fontSize: 16,
        color: '#333'
    },

    buttonContainer: {
        marginTop: 20,
    },
    buttonSpacing: {
        marginBottom: 15,
    },
    button: {
        backgroundColor: principalColor,
        borderRadius: 8,
        paddingVertical: 10,
    },
    outlineButton: {
        borderColor: "#808080",
        borderWidth: 2,
        borderRadius: 8,
    },
    outlineButtonText: {
        color: "#808080",
    },
    projectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    projectText: {
        flex: 1,
        flexShrink: 1,
        fontSize: 16,
        color: '#333',
    },
    deleteFab: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E74C3C',  // rojo
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});