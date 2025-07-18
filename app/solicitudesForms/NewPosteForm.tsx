import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Overlay } from '@rneui/themed';

type NewPosteProps = {
    isVisible: boolean;
    onCancel: () => void;
    toggleOverlay: () => void;
    selectNombrePoste: (nombrePoste: string) => void;
};

const NewPosteForm: React.FC<NewPosteProps> = ({ isVisible, onCancel, toggleOverlay, selectNombrePoste }) => {
    const [nombrePoste, setNombrePoste] = useState<string>("");

    const handleSubmit = () => {
        if (!nombrePoste.trim()) {
            Alert.alert("Error", 'El nombre del poste no puede estar vacío, en caso de que el poste no tenga numero cargar "Sin número"');
            return;
        }
        selectNombrePoste(nombrePoste);
        setNombrePoste("");
    };

    return (
        <Overlay
            isVisible={isVisible}
            onBackdropPress={toggleOverlay}
            overlayStyle={styles.overlayStyle}
        >
            <View style={styles.overlayContent}>
                <Text style={styles.titleText}>Seleccione el nombre del nuevo Poste:</Text>
                <Text style={{marginBottom:12}}>En caso de que el poste no tenga numero cargar "Sin número"</Text>
                <TextInput
                    placeholder="Nombre del Poste"
                    placeholderTextColor="#999"
                    value={nombrePoste}
                    onChangeText={setNombrePoste}
                    style={styles.input}
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Cancelar"
                        onPress={onCancel}
                        type="outline"
                        buttonStyle={styles.cancelButton}
                    />
                    <Button
                        title="Cargar Poste"
                        onPress={handleSubmit}
                        buttonStyle={styles.loadButton}
                    />
                </View>
            </View>
        </Overlay>
    );
};

const styles = StyleSheet.create({
    overlayStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    overlayContent: {
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    loadButton: {
        backgroundColor: '#61B353',
        marginRight: 10,
        borderRadius: 8
    },
    cancelButton: {
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
    },
});

export default NewPosteForm;
