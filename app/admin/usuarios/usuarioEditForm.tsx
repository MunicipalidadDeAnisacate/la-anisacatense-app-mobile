import { patchUsuarioByAdmin } from "@/api/petitions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import FailedToast from "@/components/Toasters/FailedToast";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import SuccessToast from "@/components/Toasters/SuccesToast";
import { barrios, getBarrioIdFromName, getBarrioNombre } from "@/constants/barriosAnisacateList";
import { Button } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
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
import { pickerSelectStyles } from "@/styles/pickerStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { cuadrillas, getCuadrillaIdFromName } from "@/constants/cuadrillas";
import { getTipoUsuarioIdFromName, getTipoUsuarioName, tiposUsuarios } from "@/constants/tiposUsuariosList";
import { principalColorAdmin } from "@/constants/Colors";
import { DatePickerInput } from "@/components/DatePickerInput";
import getStringFromDateForConsole from "@/functions/dates/getStringFromDateForConsole";
import { parseLocalDate } from "@/functions/dates/parseLocalDate";

export default function usuarioEditForm() {
    const { usuarioStr, tipoUsuarioId } = useLocalSearchParams();
    const usuario = usuarioStr ? JSON.parse(usuarioStr as string) : {};
    const tipoUsuarioIdObj = tipoUsuarioId ? JSON.parse(tipoUsuarioId as string) : null;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [succesVisible, setSuccesVisible] = useState<boolean>(false);
    const [failedVisible, setFailedVisible] = useState<boolean>(false);

    const [newDni, setNewDni] = useState<string>(usuario.dni);
    const [newPassword, setNewPassword] = useState<string>();
    const [newNombre, setNewNombre] = useState<string>(usuario.nombre);
    const [newApellido, setNewApellido] = useState<string>(usuario.apellido);
    const [newMail, setNewMail] = useState<string>(usuario.mail);
    const [newTelefono, setNewTelefono] = useState<string>(usuario.telefono);
    const [newFechaNacimiento, setNewFechaNacimiento] = useState<Date>(parseLocalDate(usuario.fechaNacimiento))
    const [newNombreCalle, setNewNombreCalle] = useState<string>(usuario.nombreCalle || null);
    const [newNumeroCalle, setNewNumeroCalle] = useState<string>(usuario.numeroCalle || null);
    const [newManzana, setNewManzana] = useState<string>(usuario.manzana || null);
    const [newLote, setNewLote] = useState<string>(usuario.lote || null);

    const [barrioId, setBarrioId] = useState<number>(getBarrioIdFromName(usuario.nombreBarrio));
    const [tipoUsuarioSeleccionadoId, setTipoUsuarioSeleccionadoId] = useState<number>(getTipoUsuarioIdFromName(usuario.nombreTipoUsuario));
    const [cuadrillaId, setCuadrillaId] = useState<number | null>(usuario.nombreCuadrilla ? getCuadrillaIdFromName(usuario.nombreCuadrilla) : null);

    const [isConfirmDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
    const [isConfirmDialogOpenCancel, setIsConfirmDialogOpenCancel] = useState<boolean>(false);

    const goBack = () => {
        setIsConfirmDialogOpenCancel(false);
        router.back();
    }

    const validate = (): boolean => {
        if (tipoUsuarioSeleccionadoId === 2 && cuadrillaId === null) {
            Alert.alert("Error validando", "Si el usuario es tecnico debe tener una cuadrilla asignada.");
            return false;
        }

        if (cuadrillaId !== null && tipoUsuarioSeleccionadoId !== 2) {
            setCuadrillaId(null);
        }

        if (newPassword === "") {
            setNewPassword(undefined);
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

        const datosUsuario = {
            id: usuario.id,
            newDni: newDni ? newDni : undefined,
            newPassword: newPassword ? newPassword : undefined,
            newNombre: newNombre ? newNombre : undefined,
            newApellido: newApellido ? newApellido : undefined,
            tipoUsuarioId: tipoUsuarioSeleccionadoId && tipoUsuarioSeleccionadoId !== 0 ? tipoUsuarioSeleccionadoId : undefined,
            cuadrillaId: cuadrillaId && cuadrillaId !== 0 ? cuadrillaId : undefined,
            newMail: newMail ? newMail : undefined,
            newTelefono: newTelefono ? newTelefono : undefined,
            newFechaNacimiento: newFechaNacimiento,
            barrioId: barrioId && barrioId !== 0 ? barrioId : undefined,
            newNombreCalle: newNombreCalle ? newNombreCalle : undefined,
            newNumeroCalle: newNumeroCalle ? newNumeroCalle : undefined,
            newManzana: newManzana ? newManzana : undefined,
            newLote: newLote ? newLote : undefined,
        }

        try {
            const success = await patchUsuarioByAdmin(datosUsuario);
            
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
                        <Text style={styles.title}>Modificar Vecino</Text>
                    }

                    {tipoUsuarioIdObj === 2 &&
                        <Text style={styles.title}>Modificar Técnico</Text>
                    }

                    {tipoUsuarioIdObj === 3 &&
                        <Text style={styles.title}>Modificar Administrador</Text>
                    }

                    <Text style={styles.instructionText}>
                        Para editar datos del usuario escriba sobre el campo asignado el nuevo dato,
                        no se pueden eliminar datos (por ejemplo no se le puede eliminar al usuario el número de teléfono).
                        En caso de eliminar un dato del usuario y guardar el cambio, se quedará guardado el anterior dato.
                        Para guardar cambios seleccione "Guardar cambios".
                    </Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>DNI:</Text>
                        <TextInput
                            placeholder="Ingrese el DNI"
                            placeholderTextColor="#757575"
                            value={newDni}
                            onChangeText={setNewDni}
                            style={styles.input}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <Text style={styles.label}>Nombre:</Text>
                        <TextInput
                            placeholder="Ingrese el nombre"
                            placeholderTextColor="#757575"
                            value={newNombre}
                            onChangeText={setNewNombre}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Apellido:</Text>
                        <TextInput
                            placeholder="Ingrese el apellido"
                            placeholderTextColor="#757575"
                            value={newApellido}
                            onChangeText={setNewApellido}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Contraseña: (lo que se cargue va a ser la nueva contraseña del usuario)</Text>
                        <TextInput
                            placeholder="Ingrese la nueva contraseña"
                            placeholderTextColor="#757575"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Mail:</Text>
                        <TextInput
                            placeholder="Ingrese el mail"
                            placeholderTextColor="#757575"
                            value={newMail}
                            onChangeText={setNewMail}
                            style={styles.input}
                            keyboardType="email-address"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <Text style={styles.label}>Teléfono:</Text>
                        <Text>Ej: 3547888999, sin el "0" y sin el "15"</Text>
                        <TextInput
                            placeholder="Ingrese el teléfono"
                            placeholderTextColor="#757575"
                            value={newTelefono}
                            onChangeText={setNewTelefono}
                            style={styles.input}
                            keyboardType="phone-pad"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <Text style={[styles.label, { marginBottom: 8 }]}>Fecha de Nacimiento:</Text>
                        <DatePickerInput
                            buttonTitle={getStringFromDateForConsole(newFechaNacimiento)}
                            date={newFechaNacimiento}
                            onChange={(d) => setNewFechaNacimiento(d)}
                            maximumDate={new Date()}
                            inputStyle={styles.input}
                            textStyle={{ color: "#757575", fontSize: 16 }}
                        />

                        <Text style={styles.label}>Cambiar barrio:</Text>
                        {usuario.nombreBarrio && <Text>El barrio actual es: {getBarrioNombre(barrioId)}</Text>}
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
                                placeholder="Nombre de la calle"
                                placeholderTextColor="#757575"
                                value={newNombreCalle}
                                onChangeText={setNewNombreCalle}
                                style={[styles.input, styles.inputHalf]}
                            />
                            <TextInput
                                placeholder="Número"
                                placeholderTextColor="#757575"
                                value={newNumeroCalle}
                                onChangeText={setNewNumeroCalle}
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
                                value={newManzana}
                                onChangeText={setNewManzana}
                                style={[styles.input, styles.inputHalf]}
                            />
                            <TextInput
                                placeholder="Lote"
                                placeholderTextColor="#757575"
                                value={newLote}
                                onChangeText={setNewLote}
                                style={[styles.input, styles.inputHalf]}
                            />
                        </View>

                        <Text style={styles.label}>Tipo Usuario:</Text>
                        <Text>El tipo actual es: {getTipoUsuarioName(tipoUsuarioSeleccionadoId)}</Text>
                        <View style={styles.pickerContainer}>
                            <RNPickerSelect
                                value={tipoUsuarioSeleccionadoId}
                                onValueChange={(value) => setTipoUsuarioSeleccionadoId(value)}
                                items={tiposUsuarios.map(tu => ({
                                    label: tu.name,
                                    value: tu.id,
                                }))}
                                placeholder={{ label: "Seleccione el Tipo de Usuario", value: null }}
                                useNativeAndroidPickerStyle={false}
                                style={pickerSelectStyles}
                                Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc"/></View>}
                                fixAndroidTouchableBug={true}
                            />
                        </View>

                        {((tipoUsuarioSeleccionadoId === 2) || (usuario.nombreTipoUsuario === "técnico")) && (
                            <>
                                <Text style={styles.label}>Seleccione la cuadrilla:</Text>
                                {usuario.nombreTipoUsuario === "tecnico" && <Text>Cuadrilla actual: {usuario.nombreCuadrilla}</Text>}
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
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Guardar cambios"
                            buttonStyle={styles.button}
                            containerStyle={styles.buttonSpacing}
                            onPress={openConfirmationDialog}
                        />
                        <Button
                            title="Cancelar cambios"
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
                title="Guardar cambios en el usuario?"
                onConfirm={handleSubmit}
                confirmText="Guardar Cambios"
                onCancel={() => setIsConfirmationDialogOpen(false)}
            />

            <ConfirmationDialog
                visible={isConfirmDialogOpenCancel}
                title="Cancelar cambios?"
                onConfirm={goBack}
                onCancel={() => setIsConfirmDialogOpenCancel(false)}
            />

            <SuccessToast
                visible={succesVisible}
                message={"Usuario editado exitosamente!"}
                onHide={() => setSuccesVisible(false)}
            />

            <FailedToast
                visible={failedVisible}
                message={"No se pudo editar al usuario"}
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