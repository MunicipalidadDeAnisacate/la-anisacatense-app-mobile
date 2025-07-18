import React, { useState, useEffect, useCallback } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '@rneui/themed';
import RNPickerSelect from 'react-native-picker-select';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import SuccessToast from '@/components/Toasters/SuccesToast';
import FailedToast from '@/components/Toasters/FailedToast';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { getColorByAuthDataRol } from '@/constants/Colors';
import { barrios } from '@/constants/barriosAnisacateList';
import { useAuth } from '@/context/AuthContext';
import { getDomicilioUsuario, patchDomicilioUsuario } from '@/api/petitions';
import { router } from 'expo-router';
import { validateEditDomicilioUser } from '@/functions/formsValidation/userDomicilioModifValidation';
import MapLocationSelector from '@/components/MapLocationSelector';
import LoadingLogoPulse from '@/components/LoadingLogoAnimated';
import { useBackGuard } from '@/hooks/useBackGuard';
import { MaterialIcons } from '@expo/vector-icons';
import { pickerSelectStyles } from '@/styles/pickerStyles';


export default function EditarDomicilio() {
    const { authData } = useAuth();
    const primaryColor = getColorByAuthDataRol(authData.rol);

    useBackGuard({
        disableGestures: true,
        onBack: () => {
            setConfirmCancel(true);
            return true;
        }
    })

    // --- UI state ---
    const [loading, setLoading] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [failedVisible, setFailedVisible] = useState(false);
    const [confirmSave, setConfirmSave] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);

    // --- Domicilio state ---
    const [barrioId, setBarrioId] = useState<number | null>(null);
    const [calle, setCalle] = useState('');
    const [numeroCalle, setNumeroCalle] = useState('');
    const [manzana, setManzana] = useState('');
    const [lote, setLote] = useState('');

    const [ubicacionInicial, setUbicacionInicial] = useState<{ latitudInicial: number, longitudInicial: number }>()
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<{ latitud: number, longitud: number } | null>();

    const handleLocationSelect = (location) => {
        if (location == null) {
            setUbicacionSeleccionada(null);
        } else {
            setUbicacionSeleccionada({
                latitud: location.latitude,
                longitud: location.longitude
            });
        }
    };


    // --- Load existing domicilio ---
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getDomicilioUsuario(authData.id);
                setBarrioId(data.barrioId ?? null);
                setCalle(data.calle ?? '');
                setNumeroCalle(data.numeroCalle ?? '');
                setManzana(data.manzana ?? '');
                setLote(data.lote ?? '');
                setUbicacionInicial({
                    latitudInicial: data.latitudDomicilio,
                    longitudInicial: data.longitudDomicilio
                })
                setUbicacionSeleccionada({
                    latitud: data.latitudDomicilio,
                    longitud: data.longitudDomicilio
                })

            } catch (err) {
                console.error('Error obteniendo domicilio', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [authData.id]);



    const onSavePress = useCallback(() => {
        const errors = validateEditDomicilioUser({ barrioId, calle, numeroCalle, manzana, lote, ubicacionSeleccionada });
        if (errors.length > 0) {
            Alert.alert('Domicilio inválido', errors.join('\n'));
        } else {
            setConfirmSave(true);
        }
    }, [barrioId, calle, numeroCalle, manzana, lote, ubicacionSeleccionada]);



    const handleSave = async () => {
        setConfirmSave(false);
        setLoading(true);
        try {
            const payload = {
                id: authData.id,
                barrioId: barrioId ? barrioId : 0,
                newCalle: calle.trim() || undefined,
                newNumeroCalle: numeroCalle.trim() || undefined,
                newManzana: manzana.trim() || undefined,
                newLote: lote.trim() || undefined,
                newLatitudDomicilio: ubicacionSeleccionada ? ubicacionSeleccionada.latitud : 0.0,
                newLongitudDomicilio: ubicacionSeleccionada ? ubicacionSeleccionada.longitud : 0.0,
            };
            const ok = await patchDomicilioUsuario(payload);
            ok ? setSuccessVisible(true) : setFailedVisible(true);
            if (ok) setTimeout(() => router.back(), 2000);
        } catch (err) {
            console.error(err);
            setFailedVisible(true);
        } finally {
            setLoading(false);
        }
    };


    if (loading) { return (<LoadingLogoPulse isLoading={loading} />) }
    return (
        <SafeAreaView style={styles.container}>
            {loading && <LoadingLogoAnimatedTransparent isLoading />}

            <KeyboardAwareScrollView contentContainerStyle={styles.form}>
                <Text style={[styles.title, { color: primaryColor }]}>
                    Editar Domicilio
                </Text>

                {/* Barrio */}
                <View style={styles.field}>
                    <Text style={styles.label}>Barrio</Text>
                    <RNPickerSelect
                        onValueChange={setBarrioId}
                        items={barrios.map(b => ({ label: b.name, value: b.id }))}
                        placeholder={{ label: 'Seleccione barrio', value: null }}
                        value={barrioId}
                        useNativeAndroidPickerStyle={false}
                        style={pickerSelectStyles}
                        Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc"/></View>}
                        fixAndroidTouchableBug={true}
                    />
                </View>

                {/* Calle & Número */}
                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>Calle</Text>
                        <TextInput
                            style={styles.input}
                            value={calle}
                            onChangeText={setCalle}
                            placeholder="Nombre de la calle"
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>Número</Text>
                        <TextInput
                            style={styles.input}
                            value={numeroCalle}
                            onChangeText={setNumeroCalle}
                            placeholder="Número"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Manzana & Lote */}
                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>Manzana</Text>
                        <TextInput
                            style={styles.input}
                            value={manzana}
                            onChangeText={setManzana}
                            placeholder="Manzana"
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>Lote</Text>
                        <TextInput
                            style={styles.input}
                            value={lote}
                            onChangeText={setLote}
                            placeholder="Lote"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Mapa */}
                {ubicacionInicial != null && (
                    <View>
                        <Text style={styles.label}>Ubicación de domicilio</Text>
                        <MapLocationSelector
                            onLocationSelect={handleLocationSelect}
                            initialCoordinates={{
                                latitude: ubicacionInicial.latitudInicial,
                                longitude: ubicacionInicial.longitudInicial
                            }}
                            ubicacionSoloEnAnisacate={true}
                        />
                    </View>
                )}

                {/* Acciones */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Guardar Domicilio"
                        buttonStyle={[styles.button, { backgroundColor: primaryColor }]}
                        onPress={onSavePress}
                    />
                    <Button
                        title="Cancelar"
                        type="outline"
                        buttonStyle={styles.outlineBtn}
                        titleStyle={styles.outlineText}
                        onPress={() => setConfirmCancel(true)}
                    />
                </View>
            </KeyboardAwareScrollView>

            {/* Diálogos */}
            <ConfirmationDialog
                visible={confirmSave}
                title="Confirmar cambios"
                onConfirm={handleSave}
                confirmText="Sí, guardar"
                onCancel={() => setConfirmSave(false)}
            />
            <ConfirmationDialog
                visible={confirmCancel}
                title="Cancelar edición"
                description="¿Descartar cambios?"
                confirmText="Sí, cancelar"
                cancelText="Quedarme"
                onConfirm={() => router.back()}
                onCancel={() => setConfirmCancel(false)}
            />

            {/* Toasts */}
            <SuccessToast
                visible={successVisible}
                message="Domicilio actualizado"
                onHide={() => setSuccessVisible(false)}
            />
            <FailedToast
                visible={failedVisible}
                message="Error al actualizar domicilio"
                onHide={() => setFailedVisible(false)}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6'
    },
    form: {
        padding: 20,
        paddingBottom: 80
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center'
    },
    field: {
        marginBottom: 20
    },
    label: {
        marginBottom: 6,
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    half: {
        width: '48%'
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 15
    },
    outlineBtn: {
        borderColor: '#AAA',
        borderWidth: 1,
        borderRadius: 8
    },
    outlineText: {
        color: '#555'
    },
    buttonContainer: {
        marginTop: 30
    }
});