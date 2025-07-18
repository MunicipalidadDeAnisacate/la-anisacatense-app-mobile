import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity, Linking, Platform } from "react-native";
import { Button } from "@rneui/themed";
import { useState, useEffect } from "react";
import SuccessToast from "@/components/Toasters/SuccesToast";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { colorBotonNuevaSolicitud, principalColorVecino } from "@/constants/Colors";
import { useBackGuard } from "@/hooks/useBackGuard";
import { capitalizeAll } from "@/functions/capitalizeFirstLetter";

const principalColor = principalColorVecino;

export default function MenuPrincipal() {
    const laAnisacatense = require("../../assets/images/anisacatense/fondoCircular.png");

    const facebookIcon = require("../../assets/images/redes/facebook.png");
    const instragramIcon = require("../../assets/images/redes/instagram.png");
    const webSiteIcon = require("../../assets/images/redes/website.png")

    const [nombreUsuario, setNombreUsuario] = useState('');
    const [openSuccesToastBooleanState, setOpenSuccesToastBooleanState] = useState(false);
    const { authData, logout } = useAuth();

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);

    useBackGuard({
        disableGestures: true,
        onBack: () => {
            setOpenConfirmationDialog(true);
            return true;
        }
    });

    // Local Params
    const { openSuccesToast } = useLocalSearchParams();

    useEffect(() => {
        const openSuccesToastBoolean = openSuccesToast ? JSON.parse(openSuccesToast as string) : false;
        setOpenSuccesToastBooleanState(openSuccesToastBoolean);
    }, [openSuccesToast]);


    useEffect(() => {
        const fetchUserData = async () => {
            const nombre = authData.nombre;
            setNombreUsuario(capitalizeAll(nombre));
        };

        const setFalseToast = () => {
            setOpenSuccesToastBooleanState(false);
        };

        const desbloquearToasts = () => {
            setTimeout(setFalseToast, 3000);
        };

        fetchUserData();
        if (openSuccesToastBooleanState) {
            desbloquearToasts();
        }
    }, [openSuccesToastBooleanState]);


    const handleLogout = () => {
        setOpenConfirmationDialog(false)
        logout();
        router.push("/auth/login");
    }


    const handlePressSocial = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error al abrir el enlace:', error);
        }
    };


    return (
        <SafeAreaView style={styles.menuBody}>

            <Image
                source={laAnisacatense}
                style={styles.personaje}
                resizeMode="contain"
            />

            <View style={styles.menuContainer}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.menuNombreUsuario}>¡Hola {nombreUsuario}!</Text>
                </View>

                <Button
                    title="Nueva Solicitud"
                    buttonStyle={[styles.button, { backgroundColor: colorBotonNuevaSolicitud }]}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/menuVecino/menuTipoSolicitud")}
                />

                <Button
                    title="Mis Solicitudes"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/misSolicitudesVecino/misSolicitudes")}
                />

                <Button
                    title="Consulta ciudadana"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/consultaCiudadana/consultaCiudadana")}
                />

                <Button
                    title="Comparte tu idea"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/proyectoCiudadano/nuevoProyecto")}
                />

                <Button
                    title="Mi perfil"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/menuVecino/menuMiPerfil")}
                />

                <LogoutButton />
            </View>

            <View style={{
                position: 'absolute',
                bottom: Platform.OS === "ios" ? 60 : 25,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    onPress={() => handlePressSocial('https://www.facebook.com/MunicipalidadDeAnisacate/')}
                >
                    <Image
                        source={facebookIcon}
                        style={styles.redesIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handlePressSocial('https://anisacatemunicipio.gob.ar/')}
                >
                    <Image
                        source={webSiteIcon}
                        style={styles.redesIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handlePressSocial('https://www.instagram.com/municipalidaddeanisacate/')}
                >
                    <Image
                        source={instragramIcon}
                        style={styles.redesIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>


            <ConfirmationDialog
                visible={openConfirmationDialog}
                title="Si sales del menú principal, cerrarás sesión. ¿Estás seguro?"
                confirmText="Cerrar sesión"
                onCancel={() => setOpenConfirmationDialog(false)}
                onConfirm={handleLogout}
            />

            {openSuccesToastBooleanState && (
                <SuccessToast
                    visible={openSuccesToastBooleanState}
                    message="Solicitud realizada!"
                    onHide={() => setOpenSuccesToastBooleanState(false)}
                />
            )}

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    personaje: {
        position: "absolute",
        top: "1%",
        width: "40%",
        height: "20%",
    },
    menuNombreUsuario: {
        fontSize: 28,
        fontWeight: 'bold',
        color: principalColor,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    menuBody: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    },
    menuContainer: {
        width: "85%",
        height: "auto",
        // paddingVertical: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 3,
    },
    menuTitulo: {
        fontSize: 28,
        fontWeight: "bold",
        color: principalColor,
        marginBottom: 20,
    },
    button: {
        backgroundColor: principalColor,
        borderRadius: 8,
        paddingVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: "white",
    },
    buttonContainer: {
        width: "100%",
        //marginBottom: 15,
        marginBottom: 10,
    },
    redesIcon: {
        marginHorizontal: 10,
        width: 40,
        height: 40,
    }
});