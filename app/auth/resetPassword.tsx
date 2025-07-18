import React, { useCallback, useState } from 'react';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, Linking, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { Button, Text, Card } from '@rneui/themed';
import { createResetTokenMail, createResetTokenSMS, getMailyTelefonoByDni, resetPassword } from '@/api/petitions';
import SuccessToast from '@/components/Toasters/SuccesToast';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { CheckBox } from '@rneui/themed/dist/CheckBox';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { principalColorVecino } from '@/constants/Colors';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import FailedToast from '@/components/Toasters/FailedToast';
import { useBackGuard } from '@/hooks/useBackGuard';

const principalColor = principalColorVecino;

const ResetPassword = () => {
    // Manejo del botón de "Atrás"
    const [openBackConfirmationDialog, setOpenBackConfirmationDialog] = useState<boolean>(false);

    const [currentStep, setCurrentStep] = useState(1);
    const [dni, setDni] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [backToLoginButton, setBackToLoginButton] = useState<boolean>(false);
    const [mailChecked, setMailChecked] = useState<boolean>(false);
    const [smsChecked, setSmsChecked] = useState<boolean>(false);
    const [telefonoUser, setTelefonoUser] = useState<string>();
    const [mailUser, setMailUser] = useState<string>();
    const [loadingMailYTelefono, setLoadingMailYTelefono] = useState<boolean>(true);
    const [errorObtData, setErrorObtData] = useState<boolean>(false);

    // Estados para los toasts
    const [successDni, setSuccessDni] = useState<boolean>(false);
    const [successReset, setSuccessReset] = useState<boolean>(false);
    const [failedReset, setFailedReset] = useState<boolean>(false);


    useBackGuard({
        disableGestures: true,
        onBack: () => {
            handleBack()
            return true;
        }
    })

    const handleBack = () => {
        if (currentStep === 1) {
            setOpenBackConfirmationDialog(true);
            return true;
        } else {
            setCurrentStep(currentStep - 1)
        }
    }


    const fetchMailYTelefono = async (dni: string) => {
        try {
            const data = await getMailyTelefonoByDni(dni);
            if (!data) {
                setErrorObtData(true);
            }
            setTelefonoUser(data.telefono);
            setMailUser(data.mail);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMailYTelefono(false);
        }
    }


    async function sendDniMail() {
        try {
            setIsLoading(true);
            const successDniResponse = await createResetTokenMail(dni);
            if (successDniResponse) {
                setSuccessDni(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    async function sendDniMailSMS() {
        try {
            setIsLoading(true);
            const successDniResponse = await createResetTokenSMS(dni);
            if (successDniResponse) {
                setSuccessDni(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleNextStep = () => {
        if (currentStep === 1 && dni) {
            fetchMailYTelefono(dni);
            setCurrentStep(2)
        }

        if (currentStep === 2 && (mailChecked || smsChecked)) {
            if (mailChecked) {
                sendDniMail();
            } else {
                sendDniMailSMS();
            }
            setCurrentStep(3);
        }

        if (currentStep === 3 && token) {
            setCurrentStep(4);
        }
    };


    const handleDniChange = (value: string) => {
        setDni(value);
    };

    const setMailCheck = () => {
        setMailChecked(true);
        if (smsChecked) {
            setSmsChecked(false);
        }
    }

    const setSmsCheck = () => {
        setSmsChecked(true);
        if (mailChecked) {
            setMailChecked(false);
        }
    }

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Complete los campos", 'Ambos campos son obligatorios.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", 'Las contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 6 || newPassword.length > 20) {
            Alert.alert("Error", 'La contraseña debe tener entre 6 y 20 caracteres.');
            return;
        }

        const data = {
            token: token,
            newPassword: newPassword,
        };

        try {
            setIsLoading(true);
            const successResetResponse = await resetPassword(data);
            if (successResetResponse) {
                setSuccessReset(true);
                setNewPassword("");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000)
            }
            setBackToLoginButton(true);
        } catch (error) {
            console.error(error);
            setFailedReset(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (<LoadingLogoAnimatedTransparent isLoading={isLoading} />)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <Card containerStyle={styles.card}>
                    {currentStep === 1 && (
                        <>
                            <Text h4 style={styles.title}>Restablecer Contraseña</Text>
                            <Text style={styles.descriptionText}>
                                Ingresa tu número de DNI para iniciar el proceso de restablecimiento de contraseña.
                                Te enviaremos un código de seguridad a tu correo electrónico o a tu número de
                                teléfono registrado.
                            </Text>

                            <TextInput
                                placeholder="Ingrese su número DNI"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                returnKeyType="done"
                                onSubmitEditing={() => Keyboard.dismiss()}
                                value={dni}
                                onChangeText={handleDniChange}
                                style={styles.loginInput}
                            />

                            <Button
                                title="Siguiente"
                                loading={isLoading}
                                loadingProps={{ size: 25, color: 'black' }}
                                disabled={!dni}
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonText}
                                containerStyle={styles.buttonContainer}
                                onPress={handleNextStep}
                            />

                            <Button
                                title="Atrás"
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonText}
                                containerStyle={styles.buttonContainer}
                                onPress={handleBack}
                            />
                        </>
                    )}

                    {currentStep === 2 && (
                        <>

                            <Text h4 style={styles.title}>
                                Seleccione el medio por el que desea
                                recibir su código de restablecimiento de contraseña.
                            </Text>

                            {loadingMailYTelefono ? (
                                <Text style={styles.descriptionText}>Buscando datos...</Text>
                            ) : (
                                <>
                                    {errorObtData ? (
                                        <Text style={[styles.descriptionText, { textAlign: "center", color: "red" }]}>
                                            El DNI ingresado no es valido
                                        </Text>
                                    ) : (
                                        <>
                                            <Text style={styles.descriptionText}>Mail: {mailUser}</Text>
                                            <Text style={styles.descriptionText}>Telefono: {telefonoUser}</Text>
                                        </>
                                    )
                                    }
                                </>

                            )}

                            <View style={{
                                width: "85%",
                                alignSelf: 'center',
                                paddingVertical: 20,
                                paddingHorizontal: 10,
                                marginBottom: 10,
                                backgroundColor: "#fff",
                                borderRadius: 12,
                                elevation: 3
                            }}>
                                <CheckBox
                                    title="Enviar código por correo electrónico"
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o"
                                    checked={mailChecked === true}
                                    onPress={setMailCheck}
                                />
                                <CheckBox
                                    title="Enviar código por teléfono móvil"
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o"
                                    checked={smsChecked === true}
                                    onPress={setSmsCheck}
                                />
                            </View>

                            <Button
                                title="Enviar código"
                                disabled={(!smsChecked && !mailChecked) || errorObtData}
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonText}
                                containerStyle={styles.buttonContainer}
                                onPress={handleNextStep}
                            />

                            <Button
                                title="Atrás"
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonText}
                                containerStyle={styles.buttonContainer}
                                onPress={handleBack}
                            />

                        </>
                    )
                    }

                    {
                        currentStep === 3 && (
                            <>
                                <Text h4 style={styles.title}>Nueva Contraseña</Text>

                                <Text style={styles.descriptionText}>
                                    Introduce el código que hemos enviado a tu correo electrónico o a tu teléfono móvil.
                                    Este código es necesario para verificar tu identidad y continuar con el restablecimiento
                                    de tu contraseña.
                                </Text>

                                <TextInput
                                    placeholder="Código recibido"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={token}
                                    onChangeText={setToken}
                                    style={styles.loginInput}
                                />

                                <Text style={styles.timerText}>
                                    El código de seguridad tiene una validez de 10 minutos.
                                    Si el tiempo expira, tendrás que solicitar uno nuevo.
                                </Text>

                                <Button
                                    title="Cargar Código de Seguridad"
                                    disabled={!token}
                                    loading={isLoading}
                                    loadingProps={{ size: 25, color: 'black' }}
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    containerStyle={styles.buttonContainer}
                                    onPress={handleNextStep}
                                />

                                <Button
                                    title="Atrás"
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    containerStyle={styles.buttonContainer}
                                    onPress={handleBack}
                                />
                            </>
                        )
                    }

                    {
                        currentStep === 4 && (
                            <>
                                <Text h4 style={styles.title}>Nueva Contraseña</Text>
                                <Text style={styles.descriptionText}>
                                    Ahora, ingresa tu nueva contraseña y asegúrate de que sea segura y fácil de recordar.
                                    Luego, confirma tu nueva contraseña en el campo correspondiente. Ambas contraseñas
                                    deben coincidir para poder restablecerla.
                                </Text>

                                <PasswordInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Nueva Contraseña"
                                    containerStyle={{ width: '100%' }}
                                    inputStyle={styles.loginInput}
                                    eyeColor={"#999"}
                                    backgroundEyeColor={styles.loginInput.backgroundColor}
                                    maxLength={21}
                                />

                                <PasswordInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirmar Contraseña"
                                    containerStyle={{ width: '100%' }}
                                    inputStyle={styles.loginInput}
                                    eyeColor={"#999"}
                                    backgroundEyeColor={styles.loginInput.backgroundColor}
                                    maxLength={21}
                                />

                                <Text style={styles.hintText}>La contraseña debe tener entre 6 y 20 caracteres.</Text>
                                <Button
                                    title="Restablecer Contraseña"
                                    disabled={!newPassword || !confirmPassword || !token}
                                    loading={isLoading}
                                    loadingProps={{ size: 25, color: 'black' }}
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    containerStyle={styles.buttonContainer}
                                    onPress={handleResetPassword}
                                />

                                <Button
                                    title="Atrás"
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    containerStyle={styles.buttonContainer}
                                    onPress={handleBack}
                                />
                            </>
                        )
                    }
                </Card >

                <SuccessToast
                    message="Código enviado, en breve recibirá el código de seguridad"
                    visible={successDni}
                    onHide={() => setSuccessDni(false)}
                />

                <SuccessToast
                    message="¡Contraseña Cambiada!"
                    visible={successReset}
                    onHide={() => setSuccessReset(false)}
                />

                <FailedToast
                    message="¡No se pudo cambiar contraseña reintente luego!"
                    visible={failedReset}
                    onHide={() => setFailedReset(false)}
                />

                <ConfirmationDialog
                    visible={openBackConfirmationDialog}
                    title={"Volver atrás?"}
                    description={"Si sale deberá volver a empezar el proceso de recuperar contraseña"}
                    confirmText={"Si, volver"}
                    onConfirm={() => {
                        setDni("")
                        setOpenBackConfirmationDialog(false);
                        router.push("/auth/login");
                    }}
                    onCancel={() => setOpenBackConfirmationDialog(false)}
                />
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    loginInput: {
        borderRadius: 8,
        backgroundColor: '#F0F1F3',
        width: '100%',
        padding: 12,
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 15,
    },
    button: {
        backgroundColor: principalColor,
        borderRadius: 8,
        paddingVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 15,
    },
    outlineButton: {
        borderColor: principalColor,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
    },
    outlineButtonText: {
        fontSize: 18,
        color: '#1E73BE',
    },
    hintText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 15,
    },
    descriptionText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        textAlign: 'left',
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    timerText: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 15,
        color: '#FF0000',
    },
});

export default ResetPassword;
