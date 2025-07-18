import { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { iniciarSolicitud } from "@/api/petitions";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import { useAuth } from "@/context/AuthContext";
import FailedToast from "@/components/Toasters/FailedToast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { principalColorVecino } from "@/constants/Colors";
import SuccessToast from "@/components/Toasters/SuccesToast";


export default function SolicitudVivero() {
    const { authData } = useAuth();
    const { subTipo } = useLocalSearchParams();
    const router = useRouter();

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openFailedToast, setOpenFailedToast] = useState<boolean>(false);
    const [openSuccessToast, setOpenSuccessToast] = useState<boolean>(false);

    const subTipoObj = subTipo ? JSON.parse(subTipo as string) : null;

    const capitalize = (str: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    const extractTipo = (str: string) =>
        str?.replace(/^reservar\s+/i, '') || '';

    const handleSubmit = async () => {
        setIsConfirmationDialogOpen(false);
        setIsLoading(true);
        try {

            const inputData = {
                idVecino: authData.id,
                idSubTipoReclamo: subTipoObj.id,
            };

            const success = await iniciarSolicitud(inputData);

            if (success) {
                setOpenSuccessToast(true);
                setTimeout(() => router.push({
                    pathname: "/utilsPages/informacionViveros",
                    params: { subTipoTitleStr: subTipoObj.title }
                }), 2999);

            } else {
                setOpenFailedToast(true);
            }
        } catch (error) {
            console.error(error);
            setOpenFailedToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <SafeAreaView style={styles.content}>
                    <Text style={styles.title}>Confirmación de reserva</Text>

                    {authData && (
                        <View style={styles.userInfo}>
                            <Text style={styles.label}>Solicitante:</Text>
                            <Text style={styles.userName}>
                                {capitalize(authData.nombre)} {capitalize(authData.apellido)}
                            </Text>
                        </View>
                    )}

                    <View style={styles.reservaBox}>
                        <Text style={styles.reservaText}>
                            Estás por reservar: {'\n'}
                            <Text style={styles.reservaHighlight}>
                                {extractTipo(subTipoObj.title)}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <Button
                            title="Confirmar reserva"
                            containerStyle={styles.buttonContainer}
                            titleStyle={styles.buttonText}
                            buttonStyle={styles.confirmButton}
                            onPress={() => setIsConfirmationDialogOpen(true)}
                        />
                        <Button
                            title="Cancelar"
                            containerStyle={styles.buttonContainer}
                            titleStyle={styles.buttonText}
                            buttonStyle={styles.cancelButton}
                            onPress={() => router.back()}
                        />
                    </View>

                    <ConfirmationDialog
                        visible={isConfirmationDialogOpen}
                        description="¿Confirmar la reserva?"
                        onCancel={() => setIsConfirmationDialogOpen(false)}
                        onConfirm={handleSubmit}
                    />

                    <LoadingLogoAnimatedTransparent isLoading={isLoading} />

                    <SuccessToast
                        visible={openSuccessToast}
                        message="Reserva confirmada!"
                        onHide={() => setOpenSuccessToast(false)}
                    />

                    <FailedToast
                        visible={openFailedToast}
                        message="Error al procesar la reserva"
                        onHide={() => setOpenFailedToast(false)}
                    />

                </SafeAreaView>
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: principalColorVecino,
        textAlign: 'center',
        marginBottom: 32,
    },
    userInfo: {
        marginBottom: 24,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 4,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    reservaBox: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 20,
        marginVertical: 24,
        alignItems: 'center',
    },
    reservaText: {
        fontSize: 18,
        color: '#1E3A8A',
        textAlign: 'center',
        lineHeight: 24,
    },
    reservaHighlight: {
        fontWeight: '600',
        color: principalColorVecino,
    },
    buttonsContainer: {
        gap: 16,
        marginTop: 32,
    },
    buttonContainer: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    confirmButton: {
        backgroundColor: principalColorVecino,
        paddingVertical: 14,
    },
    cancelButton: {
        backgroundColor: 'gray',
        borderRadius: 8,
        paddingVertical: 13,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: '600',
    },
});