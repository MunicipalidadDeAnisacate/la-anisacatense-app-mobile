import React from 'react';
import { Modal, View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from '@rneui/themed';
import { getColorByAuthDataRol } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';


interface ConfirmationModalProps {
    visible: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}


const ConfirmationDialog: React.FC<ConfirmationModalProps> = ({
    visible,
    title = "Confirmación",
    description = "Esta seguro que desea continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel
}) => {
    const { authData } = useAuth();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    
                    <View style={styles.buttonContainer}>
                        <Button
                            title={cancelText}
                            onPress={onCancel}
                            buttonStyle={[
                                styles.cancelButton,
                                Platform.OS === 'ios' && styles.iosButtonFix
                            ]}
                            titleStyle={[
                                styles.cancelButtonText,
                                Platform.OS === 'ios' && styles.iosTextFix
                            ]}
                        />
                        <Button
                            title={confirmText}
                            onPress={onConfirm}
                            buttonStyle={[
                                styles.confirmButton,
                                Platform.OS === 'ios' && styles.iosButtonFix,
                                {backgroundColor: getColorByAuthDataRol(authData.rol || null)}
                            ]}
                            titleStyle={[
                                styles.confirmButtonText,
                                Platform.OS === 'ios' && styles.iosTextFix
                            ]}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmationDialog;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 20,
    },
    iosButtonFix: {
        minHeight: 44,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    iosTextFix: {
        fontSize: 17,
        fontWeight: '600',
        includeFontPadding: false,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        minHeight: Platform.OS === 'ios' ? 75 : 65,
        paddingVertical: 5,
        gap: 12,
        alignContent:"center"
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
    },
    confirmButton: {
        flex: 1,
        //backgroundColor: '#1E73BE',
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#1E293B',
        fontSize: 16,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
