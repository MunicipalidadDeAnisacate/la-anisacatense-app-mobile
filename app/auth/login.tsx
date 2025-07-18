import { Link, router, SplashScreen, useFocusEffect, useNavigation } from "expo-router";
import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { Image, StyleSheet, Text, TextInput, View, BackHandler, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { Button, Icon } from '@rneui/themed';
import * as Font from 'expo-font';
import { useAuth } from '../../context/AuthContext';
import { principalColorVecino } from "@/constants/Colors";
import { PasswordInput } from "@/components/inputs/PasswordInput";


export default function login() {
    const navigation = useNavigation();
    const escudoConPersonaje = require("../../assets/images/anisacatense/fotoLoginAnisacatense.png");
    const { login, authData } = useAuth();
    const [dni, setDni] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [dniNoValido, setDniNoValido] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);


    useEffect(() => {
        const prepareApp = async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync({
                    "RockSalt-Regular": require("../../assets/fonts/RockSalt-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Error cargando recursos:", error);
            } finally {
                await SplashScreen.hideAsync();
            }
        };

        prepareApp();
    }, []);


    useEffect(() => {
        if (authData?.rol) {
            navigateToMenu();
        }
    }, [authData]);


    const navigateToMenu = () => {
        if (authData?.rol === "vecino") {
            router.push("/menuVecino/menuPrincipal");
        } else if (authData?.rol === "tecnico") {
            router.push("/menuTecnico/menuPrincipalTecnico");
        } else if (authData?.rol === "admin") {
            router.push("/menuAdmin/menuPrincipalAdmin");
        }
    };


    const handleDniChange = (value: string) => {
        setDniNoValido(false);
        setDni(value.replace(/\D/g, ''));
    };


    const handlePassChange = (value: string) => {
        setPassword(value);
    }


    const handleSubmit = async () => {
        setIsLoading(true);
        if ((!dni || !/^\d+$/.test(dni)) || !password) {
            setDniNoValido(true);
            setIsLoading(false);
            return;
        }

        try {
            const loginRequest = {
                dni: dni,
                password: password
            };
            const success = await login(loginRequest);
            if (!success) setDniNoValido(true);
        } catch (error) {
            console.error("Error en el proceso de inicio de sesión:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useLayoutEffect(() => {
        navigation.setOptions({
            gestureEnabled: false,
            animation: 'none',
        });
    }, [navigation]);
    const handleBackPress = useCallback(() => {
        return true;
    }, []);
    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
            return () => backHandler.remove();
        }, [handleBackPress])
    );


    if (!fontsLoaded) {
        return (
            <View style={styles.loginBody}>
            </View>
        );
    }


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <View style={styles.loginBody}>

                <Image
                    source={escudoConPersonaje}
                    style={styles.loginImagenEscudo}
                    resizeMode="contain"
                />

                <View style={styles.loginContainer}>
                    <Text style={styles.appName}>La Anisacatense</Text>
                    <Text style={styles.loginTitulo}>Iniciar Sesión</Text>
                    {dniNoValido && <Text style={styles.errorText}>DNI o Contraseña no válidas</Text>}
                    <TextInput
                        placeholder="Ingrese su DNI"
                        placeholderTextColor="#999"
                        value={dni}
                        onChangeText={handleDniChange}
                        keyboardType="numeric"
                        returnKeyType={"done"}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        style={styles.loginInput}
                    />

                    <View style={styles.passwordContainer}>
                        <PasswordInput
                            value={password}
                            onChangeText={handlePassChange}
                            placeholder="Ingrese su Contraseña"
                            containerStyle={{ width: '100%' }}
                            inputStyle={styles.loginInput}
                            eyeColor={principalColorVecino}
                            backgroundEyeColor={styles.loginInput.backgroundColor}
                        />
                    </View>

                    <Button
                        title="Entrar"
                        loading={isLoading}
                        loadingProps={{ size: 25, color: 'black' }}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonText}
                        containerStyle={styles.buttonContainer}
                        onPress={handleSubmit}
                    />

                    <Text style={styles.registroTexto}>
                        ¿Olvidaste tu contraseña?
                        <Link href={"/auth/resetPassword"} style={styles.link}>Recuperar contraseña</Link>
                    </Text>

                    <Text style={styles.registroTexto}>¿Nuevo en el sistema? Regístrate primero</Text>

                    <Button
                        title="Registrarse"
                        type="outline"
                        loadingProps={{ size: 25, color: 'black' }}
                        buttonStyle={styles.outlineButton}
                        titleStyle={styles.outlineButtonText}
                        containerStyle={styles.buttonContainer}
                        onPress={() => router.push("/auth/register")}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    loginBody: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F3F4F6',
    },
    loginImagenEscudo: {
        width: '90%',
        height: '18%',
    },
    loginTitulo: {
        textAlign:"center",
        width:"100%",
        fontSize: 22,
        fontWeight: 'bold',
        color: principalColorVecino,
        marginBottom: 20,
    },
    loginContainer: {
        width: "85%",
        paddingVertical: 25,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
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
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        top: 12,
    },
    button: {
        backgroundColor: principalColorVecino,
        borderRadius: 8,
        paddingVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    buttonContainer: {
        width: "100%",
        marginBottom: 15,
    },
    outlineButton: {
        borderColor: principalColorVecino,
        borderWidth: 2,
        borderRadius: 8,
    },
    outlineButtonText: {
        fontSize: 18,
        color: principalColorVecino,
    },
    registroTexto: {
        fontSize: 14,
        color: '#4A4A4A',
        marginVertical: 8,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    appName: {
        fontSize: 22,
        color: principalColorVecino,
        fontFamily: 'RockSalt-Regular',
        textAlign: 'center',
    },
    link: {
        color: principalColorVecino,
        textDecorationLine: 'underline',
    },
    personaje: {
        position: "absolute",
        bottom: "30%",
        left: "40%",
        width: "90%",
        height: "90%",
        elevation: 2
    },
});
