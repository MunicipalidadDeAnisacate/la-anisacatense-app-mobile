import { StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function LogoutButton() {
    const { logout } = useAuth();
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const logoutAndExit = async () => {
        try {
            logout();
            router.push("/auth/login");
        } catch (error) {
            console.error(error);
        } finally {
            setIsDialogVisible(false);
        }
    };

    return (
        <>
            <Button
                title="Cerrar Sesión"
                type="outline"
                buttonStyle={styles.outlineButton}
                titleStyle={styles.outlineButtonText}
                containerStyle={styles.buttonContainer}
                onPress={() => setIsDialogVisible(true)}
            />

            <ConfirmationDialog
                visible={isDialogVisible}
                title="¿Estás seguro de que quieres cerrar sesión?"
                confirmText="Cerrar sesión"
                onCancel={() => setIsDialogVisible(false)}
                onConfirm={logoutAndExit}
            />
        </>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%",
        marginBottom: 10,
    },
    outlineButton: {
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 10,
    },
    outlineButtonText: {
        fontSize: 18,
        color: "red"
    },
});
