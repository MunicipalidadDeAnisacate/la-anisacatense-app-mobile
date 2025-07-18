import { createUsuarioByAdmin } from "@/api/petitions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { DatePickerInput } from "@/components/DatePickerInput";
import FailedToast from "@/components/Toasters/FailedToast";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import SuccessToast from "@/components/Toasters/SuccesToast";
import { barrios } from "@/constants/barriosAnisacateList";
import { principalColorAdmin } from "@/constants/Colors";
import { cuadrillas } from "@/constants/cuadrillas";
import getStringFromDateForConsole from "@/functions/dates/getStringFromDateForConsole";
import { pickerSelectStyles } from "@/styles/pickerStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNPickerSelect from 'react-native-picker-select';

export default function usuarioCreateForm() {

    const { tipoUsuarioId } = useLocalSearchParams();
    const tipoUsuarioIdObj = tipoUsuarioId ? JSON.parse(tipoUsuarioId as string) : null;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [succesVisible, setSuccesVisible] = useState<boolean>(false);
    const [failedVisible, setFailedVisible] = useState<boolean>(false);
    const [valoresRepetidosBool, setValoresRepetidosBool] = useState<boolean>(false);
    const [valoresRepetidos, setValoresRepetidos] = useState<string>();


    const [dni, setDni] = useState<string>(); // not null
    const [password, setPassword] = useState<string>(); // not null
    const [nombre, setNombre] = useState<string>(); // not null
    const [apellido, setApellido] = useState<string>(); // not null
    const [mail, setMail] = useState<string>(); // not null
    const [telefono, setTelefono] = useState<string>(); // not null
    const [nombreCalle, setNombreCalle] = useState<string>(); // not null
    const [numeroCalle, setNumeroCalle] = useState<string>(); // not null
    const [manzana, setManzana] = useState<string>(); // not null
    const [lote, setLote] = useState<string>(); // not null
    const [barrioId, setBarrioId] = useState<number>(); // not null
    const [tipoUsuario, setTipoUsuario] = useState(); // not null
    const [cuadrillaId, setCuadrillaId] = useState<number | null>();
    const [birthDate, setBirthDate] = useState<Date | null>(null); // not null

    const [isConfirmDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
    const [isConfirmDialogOpenCancel, setIsConfirmDialogOpenCancel] = useState<boolean>(false);

    const goBack = () => {
        setIsConfirmDialogOpenCancel(false);
        router.back();
    }

    useEffect(() => {
        setTipoUsuario(tipoUsuarioIdObj);
    }, [tipoUsuarioIdObj])


    const getBarrioValue = (id: number): string => {
        const barrio = barrios.find(b => b.id === id);
        return barrio ? barrio.name : "";
    }


    const getCuadrillaValue = (id: number): string => {
        const cuadrilla = cuadrillas.find(b => b.id === id);
        return cuadrilla ? cuadrilla.name : "";
    }


    const validate = (): boolean => {
        if (!dni || !password || !telefono || !nombre || !apellido || !mail || !barrioId || !tipoUsuario) {
            Alert.alert("Error de validacion", "Hay campos incompletos que deben ser completados!")
            return false;
        }

        if (tipoUsuario === 2 && !cuadrillaId) {
            Alert.alert("Error validando", "Si el usuario es técnico debe tener una cuadrilla asignada.");
            return false;
        }

        if (!/^\d{7,8}$/.test(dni)) {
            Alert.alert("DNI invalido", "El DNI debe tener 7 u 8 dígitos.");
            return false;
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail.toLowerCase())) {
            Alert.alert("Correo inválido", "El correo no tiene un formato válido.");
            return false;
        }

        if (cuadrillaId !== null && (tipoUsuario !== 2)) {
            setCuadrillaId(null);
        }

        const tieneCalleYNumero = nombreCalle && numeroCalle && nombreCalle !== "" && numeroCalle !== "";
        const tieneManzanaYLote = manzana && lote && manzana !== "" && lote !== "";

        if (!nombreCalle && !numeroCalle && !manzana && !lote) {
            Alert.alert("Error en Domicilio", "Debe completar al menos Calle y Número de Calle, o Manzana y Lote.");
            return false;
        }

        if (!tieneCalleYNumero && !tieneManzanaYLote) {
            Alert.alert("Error en Domicilio", "Debe completar al menos Calle y Número de Calle, o Manzana y Lote.");
            return false;
        }

        if (password === "") {
            Alert.alert("Error validando", "El usuario NO puede tener una contraseña vacia.")
            return false;
        }

        if (tipoUsuarioIdObj === 1 && !birthDate) {
            Alert.alert("Error Fecha de Nacimiento", "El usuario NO puede tener una no tener una fecha de nacimiento.")
            return false;
        }

        return true
    }

    const openConfirmationDialog = () => {
        if (!validate()) {
            return;
        }

        setIsConfirmationDialogOpen(true)
    }

    const handleSubmit = async () => {
        setIsConfirmationDialogOpen(false);
        setIsLoading(true);

        const datosNuevoUsuario = {
            dni: dni,
            password: password,
            nombre: nombre,
            apellido: apellido,
            tipoUsuarioId: tipoUsuario,
            cuadrillaId: cuadrillaId ? cuadrillaId : undefined,
            mail: mail.toLowerCase(),
            telefono: telefono,
            fechaNacimiento: birthDate,
            barrioId: barrioId ? barrioId : undefined,
            nombreCalle: nombreCalle ? nombreCalle : undefined,
            numeroCalle: numeroCalle ? numeroCalle : undefined,
            manzana: manzana ? manzana : undefined,
            lote: lote ? lote : undefined
        }

        try {
            const success = await createUsuarioByAdmin(datosNuevoUsuario);

            if (typeof success === 'boolean') {
                if (success) {
                    setSuccesVisible(true);
                    setTimeout(() => router.back(), 3000);
                } else {
                    setFailedVisible(true);
                }
            } else if (!success.success) {
                setValoresRepetidosBool(true);
                setValoresRepetidos(success.message);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <LoadingLogoAnimatedTransparent isLoading={isLoading} />}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                >

                    {tipoUsuarioIdObj === 1 &&
                        <Text style={styles.title}>Crear nuevo Vecino</Text>
                    }

                    {tipoUsuarioIdObj === 2 &&
                        <Text style={styles.title}>Crear nuevo Técnico</Text>
                    }

                    {tipoUsuarioIdObj === 3 &&
                        <Text style={styles.title}>Crear nuevo Administrador</Text>
                    }

                    <Text style={styles.instructionText}>
                        Para agregar un nuevo usuario a la App debe ingresar todos los datos necesarios para el mismo,
                        tenga en cuenta que puede ingresar o calle y nro de calle o la manzana y lote del domicilio
                        del mismo, una vez ingresado los datos toque "Guardar usuario" y confirme, luego del cartel de
                        guardado exitoso ya estara cargado el nuevo usuario.
                    </Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>DNI:</Text>
                        <TextInput
                            placeholder="Ingrese el DNI"
                            placeholderTextColor="#757575"
                            value={dni}
                            onChangeText={setDni}
                            style={styles.input}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <Text style={styles.label}>Nombre:</Text>
                        <TextInput
                            placeholder="Ingrese el Nombre"
                            placeholderTextColor="#757575"
                            value={nombre}
                            onChangeText={setNombre}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Apellido:</Text>
                        <TextInput
                            placeholder="Ingrese el Apellido"
                            placeholderTextColor="#757575"
                            value={apellido}
                            onChangeText={setApellido}
                            style={styles.input}
                        />

                        <Text style={[styles.label, { marginBottom: 0 }]}>Contraseña:</Text>
                        <Text style={{ marginBottom: 8 }}>Lo que se cargue va a ser la nueva contraseña del usuario</Text>
                        <TextInput
                            placeholder="Ingrese la Contraseña"
                            placeholderTextColor="#757575"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Mail:</Text>
                        <TextInput
                            placeholder="Ingrese el Mail"
                            placeholderTextColor="#757575"
                            value={mail}
                            onChangeText={setMail}
                            style={styles.input}
                            keyboardType="email-address"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />


                        <Text style={[styles.label, { marginBottom: 0 }]}>Teléfono:</Text>
                        <Text style={{ marginBottom: 8 }}>Ej: 3547888999, sin el "0" y sin el "15"</Text>
                        <TextInput
                            placeholder="Ingrese el Nro. de Teléfono"
                            placeholderTextColor="#757575"
                            value={telefono}
                            onChangeText={setTelefono}
                            style={styles.input}
                            keyboardType="phone-pad"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <Text style={[styles.label, { marginBottom: 8 }]}>Fecha de Nacimiento:</Text>
                        <DatePickerInput
                            buttonTitle={birthDate ? getStringFromDateForConsole(birthDate) : "Fecha de Nacimiento"}
                            date={birthDate}
                            onChange={(d) => setBirthDate(d)}
                            maximumDate={new Date()}
                            inputStyle={styles.input}
                            textStyle={{ color: "#757575", fontSize: 16 }}
                        />

                        <Text style={styles.label}>Seleccionar barrio:</Text>
                        {barrioId && <Text style={styles.selectedText}>El barrio seleccionado es: {getBarrioValue(barrioId)}</Text>}
                        <View style={styles.pickerContainer}>
                            <RNPickerSelect
                                value={barrioId}
                                onValueChange={(value) => setBarrioId(value)}
                                items={barrios.map(barrio => ({
                                    label: barrio.name,
                                    value: barrio.id,
                                }))}
                                placeholder={{ label: "Seleccione su Barrio", value: null }}
                                useNativeAndroidPickerStyle={false}
                                style={pickerSelectStyles}
                                Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc"/></View>}
                                fixAndroidTouchableBug={true}
                            />
                        </View>

                        <Text style={styles.label}>Dirección:</Text>
                        <View style={styles.row}>
                            <TextInput
                                placeholder="Nombre de Calle"
                                placeholderTextColor="#757575"
                                value={nombreCalle}
                                onChangeText={setNombreCalle}
                                style={[styles.input, styles.inputHalf]}
                            />
                            <TextInput
                                placeholder="Número"
                                placeholderTextColor="#757575"
                                value={numeroCalle}
                                onChangeText={setNumeroCalle}
                                style={[styles.input, styles.inputHalf]}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                placeholder="Manzana"
                                placeholderTextColor="#757575"
                                value={manzana}
                                onChangeText={setManzana}
                                style={[styles.input, styles.inputHalf]}
                            />
                            <TextInput
                                placeholder="Lote"
                                placeholderTextColor="#757575"
                                value={lote}
                                onChangeText={setLote}
                                style={[styles.input, styles.inputHalf]}
                            />
                        </View>

                        {tipoUsuarioIdObj === 2 &&
                            <>
                                <Text style={styles.label}>Seleccione la cuadrilla:</Text>
                                {cuadrillaId && <Text style={styles.selectedText}>Cuadrilla actual: {getCuadrillaValue(cuadrillaId)}</Text>}
                                <View style={styles.pickerContainer}>
                                    <RNPickerSelect
                                        value={cuadrillaId}
                                        onValueChange={(value) => setCuadrillaId(value)}
                                        items={cuadrillas.map(cuadrilla => ({
                                            label: cuadrilla.name,
                                            value: cuadrilla.id,
                                        }))}
                                        placeholder={{ label: "Seleccione su Cuadrilla", value: null }}
                                        useNativeAndroidPickerStyle={false}
                                        style={pickerSelectStyles}
                                        Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc"/></View>}
                                        fixAndroidTouchableBug={true}
                                    />
                                </View>
                            </>
                        }

                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Guardar usuario"
                            buttonStyle={styles.button}
                            containerStyle={styles.buttonSpacing}
                            onPress={openConfirmationDialog}
                        />
                        <Button
                            title="Cancelar carga de usuario"
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
                title="Crear el usuario?"
                onConfirm={handleSubmit}
                confirmText="Crear Usuario"
                onCancel={() => setIsConfirmationDialogOpen(false)}
            />

            <ConfirmationDialog
                visible={isConfirmDialogOpenCancel}
                title="Cancelar Carga?"
                description="Esta seguro que sedea cancelar la carga del usuario?"
                onConfirm={goBack}
                onCancel={() => setIsConfirmDialogOpenCancel(false)}
            />

            <SuccessToast
                visible={succesVisible}
                message={"Usuario creado exitosamente!"}
                onHide={() => setSuccesVisible(false)}
            />

            <FailedToast
                visible={failedVisible}
                message={"No se pudo crear al usuario! intentelo nuevamente mas tarde."}
                onHide={() => setFailedVisible(false)}
            />

            {valoresRepetidos &&
                <FailedToast
                    visible={valoresRepetidosBool}
                    message={valoresRepetidos}
                    onHide={() => setValoresRepetidosBool(false)}
                    duration={4500}
                />
            }
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
        color: principalColorAdmin,
        marginBottom: 8,
        fontWeight: "bold",
        textAlign: "center"
    },
    instructionText: {
        fontSize: 16,
        color: "#4A4A4A",
        marginBottom: 20,
        textAlign: "center",
    },
    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        elevation: 3,
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
        marginBottom: 15,
    },
    selectedText: {
        color: "#333333",
        marginBottom: 8
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputHalf: {
        flex: 1,
        marginHorizontal: 5,
    },
    pickerContainer: {
        width: "100%",
        height: 50,
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 20,
    },
    buttonSpacing: {
        marginBottom: 15,
    },
    button: {
        backgroundColor: principalColorAdmin,
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
});