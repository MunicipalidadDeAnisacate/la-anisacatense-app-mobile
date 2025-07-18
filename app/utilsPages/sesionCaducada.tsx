import { principalColorVecino } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Card } from "@rneui/themed";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { BackHandler, SafeAreaView, StyleSheet, Text, View } from "react-native";


export default function sesionCaducada() {
    const { logout } = useAuth();


    const handleBackPress = useCallback(() => {
        return true;
    }, []);
    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
            return () => backHandler.remove();
        }, [handleBackPress])
    );


    const handleExit = () => {
        logout();
        router.push("/auth/login");
    }


    return (
        <SafeAreaView style={[styles.container]}>
            <Card containerStyle={styles.card}>

                <Text style={styles.title}>¡Sesión Expirada!</Text>

                <Text style={styles.message}>
                    Por su seguridad, la sesión ha caducado.
                    Por favor, inicia sesión nuevamente para continuar.
                </Text>

                <Button
                    title="Volver a ingresar"
                    onPress={handleExit}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    containerStyle={styles.buttonContainer}
                    icon={
                        <MaterialIcons
                            name="exit-to-app"
                            size={24}
                            color="white"
                            style={styles.buttonIcon}
                        />
                    }
                    iconPosition="right"
                />
            </Card>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: principalColorVecino
    },
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        width: "85%",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold',
        color: '#1E73BE',
    },
    message: {
        fontSize: 16,
        color: "#4A4A4A",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 30,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 30,
        backgroundColor: "#1E73BE"
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 10,
    },
    buttonContainer: {
        width: "100%",
        marginVertical: 10,
    },
    buttonIcon: {
        marginLeft: 10,
    },
})