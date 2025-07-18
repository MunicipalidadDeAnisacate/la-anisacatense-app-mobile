import { createNewProyecto } from "@/api/petitions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import FailedToast from "@/components/Toasters/FailedToast";
import SuccessToast from "@/components/Toasters/SuccesToast";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
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
    Text,
    TextInput,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import { pickFile } from "@/functions/pickDocument/pickDocument";


// se accede desde vecino y desde admin
export default function nuevoProyecto() {
    const { authData } = useAuth();
    const backgroundColorByRol = getColorByAuthDataRol(authData.rol);

    const [isLoading, setIsLoading] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [failedVisible, setFailedVisible] = useState(false);

    const [tituloProyecto, setTituloProyecto] = useState<string>("");
    const [descripcionProyecto, setDescripcionProyecto] = useState<string>("");
    const [archivoProyecto, setArchivoProyecto] = useState< { uri: string, name: string, type: string; } | null>();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);


    const goBack = () => {
        setCancelOpen(false);
        router.back();
    };


    const pickDocument = async () => {
        const documentUri = await pickFile(5);
        if (documentUri) {
            setArchivoProyecto(documentUri)
        }
    };


    const validate = (): boolean => {
        if (!tituloProyecto.trim()) {
            Alert.alert("Sin Título", "Debes ingresar un título.");
            return false;
        }
        if (!descripcionProyecto.trim()) {
            Alert.alert("Sin Descripción", "Debes ingresar una breve descripción.");
            return false;
        }
        return true;
    };


    const openConfirm = () => {
        if (validate()) setConfirmOpen(true);
    };


    const handleSubmit = async () => {
        setConfirmOpen(false);
        setIsLoading(true);
        const proyecto: CreateProyectoRequest = {
            titulo: tituloProyecto.trim(),
            descripcion: descripcionProyecto.trim(),
            archivoUrl: archivoProyecto ?? undefined,
            usuarioId: authData.id,
        };
        try {
            const success = await createNewProyecto(proyecto);
            if (success) {
                setSuccessVisible(true);
                setTimeout(() => router.back(), 3000);
            } else {
                setFailedVisible(true);
            }
        } catch (err) {
            console.error(err);
            setFailedVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <LoadingLogoAnimatedTransparent isLoading />}
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, {color: backgroundColorByRol}]}>¡Comparte tu propuesta!</Text>
                        <Text style={styles.subtitle}>
                            Aquí puedes sugerir mejoras o proyectos. Ingresa un título, una breve descripción,
                            y, si lo deseas, adjunta un archivo PDF o Word con más detalles técnicos.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Título:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Escribe el título"
                                placeholderTextColor="#757575"
                                value={tituloProyecto}
                                onChangeText={setTituloProyecto}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Descripción:</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                placeholder="Escribe la descripción"
                                placeholderTextColor="#757575"
                                textAlignVertical="top"
                                multiline
                                value={descripcionProyecto}
                                onChangeText={setDescripcionProyecto}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Archivo (opcional):</Text>
                            <View style={styles.fileRow}>
                                <Button
                                    title={
                                        archivoProyecto
                                            ? "Cambiar archivo"
                                            : "Seleccionar PDF/Word"
                                    }
                                    onPress={pickDocument}
                                    buttonStyle={[styles.pickBtn, { backgroundColor: backgroundColorByRol}]}
                                    containerStyle={styles.pickBtnContainer}
                                />
                                {archivoProyecto && (
                                    <Text style={styles.selected}>
                                        {archivoProyecto.name.split("/").pop()}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Button
                            title="Enviar proyecto"
                            onPress={openConfirm}
                            buttonStyle={[styles.okBtn, { backgroundColor: backgroundColorByRol}]}
                            containerStyle={styles.btnContainer}
                            titleStyle={styles.btnText}
                        />
                        <Button
                            title="Cancelar"
                            onPress={() => setCancelOpen(true)}
                            type="outline"
                            buttonStyle={styles.cancelBtn}
                            containerStyle={styles.btnContainer}
                            titleStyle={styles.btnText}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>

            {/* Dialogs & Toasts */}
            <ConfirmationDialog
                visible={confirmOpen}
                title="¿Crear proyecto?"
                confirmText="Crear Proyecto"
                onConfirm={handleSubmit}
                onCancel={() => setConfirmOpen(false)}
            />
            <ConfirmationDialog
                visible={cancelOpen}
                title="¿Cancelar carga?"
                description="Se perderán los cambios."
                onConfirm={goBack}
                onCancel={() => setCancelOpen(false)}
            />
            <SuccessToast
                visible={successVisible}
                message="Proyecto enviado!"
                onHide={() => setSuccessVisible(false)}
            />
            <FailedToast
                visible={failedVisible}
                message="Error al enviar proyecto. Intenta luego."
                onHide={() => setFailedVisible(false)}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F3F4F6" },
    flex: { flex: 1 },
    container: {
        padding: 20,
        alignItems: "center",
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 4,
    },
    form: {
        width: "100%",
        marginVertical: 10,
    },
    field: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    input: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#DDD",
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
    },
    fileRow: {
        flexDirection: "column",
        alignItems: "center",
    },
    pickBtn: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    pickBtnContainer: {
        width: "95%",
    },
    selected: {
        marginTop: 8,
        fontSize: 14,
        color: "#555",
        backgroundColor: "#EFEFEF",
        padding: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "black"
    },
    actions: {
        width: "100%",
        marginTop: 20,
        alignItems: "center",
    },
    btnContainer: {
        width: "90%",
        marginBottom: 12,
    },
    okBtn: {
        borderRadius: 8,
        paddingVertical: 12,
    },
    cancelBtn: {
        backgroundColor: "gray",
        borderRadius: 8,
        paddingVertical: 12,
    },
    btnText: {
        color: "#FFF",
        fontSize: 18,
    },
});