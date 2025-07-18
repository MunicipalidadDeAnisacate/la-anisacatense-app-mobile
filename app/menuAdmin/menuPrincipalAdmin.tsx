import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useState, useEffect } from "react";
import SuccessToast from "@/components/Toasters/SuccesToast";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { principalColorAdmin } from "@/constants/Colors";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useBackGuard } from "@/hooks/useBackGuard";

const principalColor = principalColorAdmin;

export default function menuPrincipalAdmin() {

    const [openSuccesToastBooleanState, setOpenSuccesToastBooleanState] = useState(false);
    const { logout } = useAuth();

    // Manejo del botón de "Atrás"
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);
    useBackGuard({
        disableGestures: true,
        onBack: () => {
            setOpenConfirmationDialog(true);
            return true;
        }
    });

    const { openSuccesToast } = useLocalSearchParams();

    useEffect(() => {
        const openSuccesToastBoolean = openSuccesToast ? JSON.parse(openSuccesToast as string) : false;
        setOpenSuccesToastBooleanState(openSuccesToastBoolean);
    }, [openSuccesToast]);


    const handleLogout = () => {
        setOpenConfirmationDialog(false)
        logout();
        router.push("/auth/login");
    }


    useEffect(() => {
        const setFalseToast = () => {
            setOpenSuccesToastBooleanState(false);
        };

        const desbloquearToasts = () => {
            setTimeout(setFalseToast, 3000);
        };

        if (openSuccesToastBooleanState) {
            desbloquearToasts();
        }
    }, [openSuccesToastBooleanState]);


    return (
        <SafeAreaView style={styles.menuBody}>
            <Text style={{ fontSize: 25, fontWeight: "bold", color: principalColor, marginBottom: 20 }}> - Sos un Administrador - </Text>
            <View style={styles.menuContainer}>

                <Button
                    title="Ver Solicitudes por Tipo"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/admin/solicitudes/solicitudesXTipo")}
                />

                <Button
                    title="Ver Reparaciones"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/admin/reparaciones/reparaciones")}
                />

                <Button
                    title="Administrar Usuarios"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/admin/usuarios/menuDeUsuarios")}
                />

                <Button
                    title={"Ver Estadísticas"}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/admin/estadisticas/menuDeEstadisticas")}
                />

                <Button
                    title={"Administrar Proyectos"}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/admin/proyectoCiudadanoAdmin/menuProyectoCiudadano")}
                />

                <Button
                    title={"Administrar Consultas Ciudadanas"}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    onPress={() => router.push("/admin/consultaCiudadana/menuConsultaCiudadana")}
                />
                
                <LogoutButton />

                {openSuccesToastBooleanState && (
                    <SuccessToast
                        visible={openSuccesToastBooleanState}
                        message="Solicitud reparada!"
                        onHide={() => setOpenSuccesToastBooleanState(false)}
                    />
                )}
            </View>

            <ConfirmationDialog
                visible={openConfirmationDialog}
                title="Si sales del menú principal, cerrarás sesión. ¿Estás seguro?"
                confirmText="Cerrar sesión"
                onCancel={() => setOpenConfirmationDialog(false)}
                onConfirm={handleLogout}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    menuNombreUsuario: {
        fontSize: 28,
        fontWeight: "bold",
        color: principalColor, //"#1E73BE",
        marginBottom: 20,
    },
    menuBody: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    },
    menuContainer: {
        width: "85%",
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
        color: principalColor, //"#1E73BE",
        marginBottom: 20,
    },
    button: {
        backgroundColor: principalColor,//"#1E73BE",
        borderRadius: 8,
        paddingVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: "white",
    },
    buttonContainer: {
        width: "100%",
        marginBottom: 15,
    },
    outlineButton: {
        borderColor: "#1E73BE",
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 10,
    },
    outlineButtonText: {
        fontSize: 18,
        color: "#1E73BE",
    },
});
