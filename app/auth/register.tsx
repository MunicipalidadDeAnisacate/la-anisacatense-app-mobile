import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { StyleSheet, Text, TextInput, View, SafeAreaView, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { useAuth } from '../../context/AuthContext';
import FailedToast from "@/components/Toasters/FailedToast";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import { Picker } from "@react-native-picker/picker";
import { barrios } from "@/constants/barriosAnisacateList";
import { colorBotonCambioMapType, principalColorVecino } from "@/constants/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DatePickerInput } from "@/components/DatePickerInput";
import getStringFromDateForConsole from "@/functions/dates/getStringFromDateForConsole";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import MapLocationSelector from "@/components/MapLocationSelector";
import { formatDateForBackend } from "@/functions/dates/formatDateForBackendFINAL";
import VisorTerminosYCondiciones from "@/components/terminosYCondiciones.tsx/AccordionTerminosYCondiciones";
import { useExistsCheck } from "@/hooks/useExistsCheck";


export default function Register() {
    const { register } = useAuth();

    /*** Estados de control de scroll ***/
    const [isChildScrollActive, setIsChildScrollActive] = useState(false);

    /*** Estados del formulario (pasos 1, 2, 3) ***/
    const [registerData, setRegisterData] = useState({
        nombre: "",
        apellido: "",
        mail: "",
        telefono: "",
        dni: "",
        password: "",
        confirmPassword: "",
        barrio: "",
        nombreCalle: "",
        nroCalle: "",
        manzana: "",
        lote: "",
        latitudMapa: "",
        longitudMapa: "",
    });
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const [aceptPolicy, setAceptPolicy] = useState<boolean>(false);

    /*** Estados relacionados con ubicación ***/
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<{ latitud: number | null; longitud: number | null }>({
        latitud: null,
        longitud: null,
    });
    const [map, setMap] = useState<boolean>(false);
    const [locationLoaded, setLocationLoaded] = useState<boolean>(false);

    /*** Estados de validación y errores ***/
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<boolean>(false);
    const [dniNoValido, setDniNoValido] = useState(false);
    const [valoresRepetidosBool, setValoresRepetidosBool] = useState<boolean>(false);
    const [valoresRepetidos, setValoresRepetidos] = useState<string>();

    /*** Estados de validacion de repeticion de atributos ***/
    const mailCheck = useExistsCheck(registerData.mail, 'email');
    const dniCheck = useExistsCheck(registerData.dni, 'dni');
    const telefonoCheck = useExistsCheck(registerData.telefono, 'telefono');


    /*** Estado de carga global ***/
    const [isLoading, setIsLoading] = useState(false);


    // funcion que cambia el valor de register data    
    const handleInputChange = (name: string, value: string) => {
        // prohibe que el telefono comience con 0
        if (name === "telefono" && registerData.telefono === "" && value === "0") {
            return;
        }
        if (name === "telefono" || name === "dni") {
            value = value.replaceAll(".", "");
        }

        setRegisterData({ ...registerData, [name]: value });
    };


    const onNext = async (step: number) => {
        const errors: { [key: string]: string } = {}; // Objeto para guardar errores específicos

        if (step === 1) {
            if (!registerData.nombre) errors.nombre = "El nombre es obligatorio.";
            if (!registerData.apellido) errors.apellido = "El apellido es obligatorio.";
            if (!registerData.mail) {
                errors.mail = "El correo es obligatorio.";
            } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerData.mail.toLowerCase())) {
                errors.mail = "El correo no tiene un formato válido.";
            }
            if (!registerData.telefono) errors.telefono = "El teléfono es obligatorio.";
            if (!birthDate) errors.nacimiento = "Ingresar la fecha de nacimiento es obligatorio."
        }

        if (step === 2) {
            if (!registerData.dni) {
                errors.dni = "El DNI es obligatorio.";
            } else if (!/^\d{7,8}$/.test(registerData.dni)) {
                errors.dni = "El DNI debe tener 7 u 8 dígitos.";
            }

            if (!registerData.password) {
                errors.password = "La contraseña es obligatoria.";
            } else if (
                registerData.password.length < 6 ||
                registerData.password.length > 20
            ) {
                errors.password = "La contraseña debe tener entre 6 y 20 caracteres.";
            }

            if (!registerData.confirmPassword) {
                errors.confirmPassword = "La confirmacion de contraseña es obligatoria.";
            } else if (registerData.password !== registerData.confirmPassword) {
                errors.confirmPassword = "La contraseña y su confirmación no coinciden.";
            }
        }

        if (step === 3) {
            const tieneCalleYNumero = registerData.nombreCalle && registerData.nroCalle;
            const tieneManzanaYLote = registerData.manzana && registerData.lote;

            if (!registerData.barrio || registerData.barrio === "") {
                errors.direccion = "Debe completar el barrio donde vive";
            }

            if (!registerData.nombreCalle && !registerData.nroCalle && !registerData.manzana && !registerData.lote) {
                errors.direccion = "Debe completar al menos Calle y Número de Calle, o Manzana y Lote.";
            }

            if (!tieneCalleYNumero && !tieneManzanaYLote) {
                errors.direccion = "Debe completar al menos Calle y Número de Calle, o Manzana y Lote.";
            }
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError(true);
            return;
        } else {
            setFieldErrors({});
            setError(false);
        }

        if (step === 3 && !map) {
            setMap(true);
            setIsLoading(true);
        }
    };

    useEffect(() => {
        if (locationLoaded) {
            setIsLoading(false);
        }
    }, [locationLoaded])


    const handleRegister = async () => {
        const errors: { [key: string]: string } = {};

        if (!ubicacionSeleccionada.latitud || !ubicacionSeleccionada.longitud) {
            errors.ubicacion = "Debe seleccionar una ubicación";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError(true);
            return
        } else {
            setFieldErrors({});
            setError(false);
        }

        setIsLoading(true)
        try {
            setDniNoValido(false);

            const registerRequest = {
                nombre: registerData.nombre.trim(),
                apellido: registerData.apellido.trim(),
                mail: registerData.mail.toLocaleLowerCase().trim(),
                telefono: registerData.telefono,
                fechaNacimiento: birthDate ? formatDateForBackend(birthDate) : undefined,
                dni: registerData.dni,
                password: registerData.password,
                barrio: registerData.barrio,
                nombreCalle: registerData.nombreCalle.trim(),
                numeroCalle: registerData.nroCalle,
                manzana: registerData.manzana,
                lote: registerData.lote,
                latitudeDomicilio: registerData.latitudMapa,
                longitudeDomicilio: registerData.longitudMapa
            };

            const success = await register(registerRequest);

            if (typeof success === 'string') {
                setValoresRepetidosBool(true);
                setValoresRepetidos(success);
                return
            }

            if (success === false) setDniNoValido(true);

            if (success === true) { router.push("/menuVecino/menuPrincipal"); }

        } catch (error) {
            console.error("Error en el proceso de inicio de sesión:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleLocationSelect = (loc: { latitude: number; longitude: number } | null) => {
        if (loc) {
            setUbicacionSeleccionada({
                latitud: loc.latitude,
                longitud: loc.longitude
            });
            setRegisterData({
                ...registerData,
                latitudMapa: loc.latitude.toString(),
                longitudMapa: loc.longitude.toString(),
            });
        } else {
            setUbicacionSeleccionada({ latitud: null, longitud: null });
            setRegisterData({
                ...registerData,
                latitudMapa: "",
                longitudMapa: "",
            });
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={!isChildScrollActive}
                >

                    <Text style={styles.registerTitle}>Registro</Text>

                    <ProgressSteps
                        activeStepIconBorderColor="#61B353"
                        completedStepIconColor="#61B353"
                        activeLabelColor="#61B353"
                        labelFontSize={14}
                        marginBottom={20}
                    >
                        {/* Paso 1 */}
                        <ProgressStep
                            nextBtnStyle={styles.nextButtonStyle}
                            nextBtnTextStyle={styles.buttonText}
                            nextBtnText="Siguiente"

                            nextBtnDisabled={telefonoCheck.isExists || mailCheck.isExists}
                            onNext={() => onNext(1)}
                            errors={error}
                        >
                            <View style={styles.stepContent}>
                                <Text style={styles.stepSubtitle}>Datos Personales</Text>

                                {fieldErrors.nombre && <Text style={styles.errorText}>{fieldErrors.nombre}</Text>}
                                <TextInput
                                    placeholder="Nombre"
                                    placeholderTextColor="#999"
                                    value={registerData.nombre}
                                    onChangeText={(text) =>
                                        handleInputChange("nombre", text)
                                    }
                                    style={styles.input}
                                />

                                {fieldErrors.apellido && <Text style={styles.errorText}>{fieldErrors.apellido}</Text>}
                                <TextInput
                                    placeholder="Apellido"
                                    placeholderTextColor="#999"
                                    value={registerData.apellido}
                                    onChangeText={(text) =>
                                        handleInputChange("apellido", text)
                                    }
                                    style={styles.input}
                                />

                                {fieldErrors.mail && <Text style={styles.errorText}>{fieldErrors.mail}</Text>}
                                {mailCheck.isExists === true && <Text style={styles.errorText}>Este email ya existe</Text>}
                                <TextInput
                                    placeholder="Mail"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    value={registerData.mail}
                                    onChangeText={(text) =>
                                        handleInputChange("mail", text)
                                    }
                                    style={styles.input}
                                />

                                {fieldErrors.telefono && <Text style={styles.errorText}>{fieldErrors.telefono}</Text>}
                                {telefonoCheck.isExists === true && <Text style={styles.errorText}>Este nro. de celular ya existe</Text>}
                                <Text style={{ color: principalColorVecino }}>Ej: 3547888999, sin el "0" y sin el "15"</Text>
                                <TextInput
                                    placeholder="Nro Celular"
                                    placeholderTextColor="#999"
                                    value={registerData.telefono}
                                    returnKeyType="done"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        handleInputChange("telefono", text)
                                    }
                                    }
                                    style={styles.input}
                                />

                                {fieldErrors.nacimiento && <Text style={styles.errorText}>{fieldErrors.nacimiento}</Text>}
                                <DatePickerInput
                                    date={birthDate}
                                    onChange={setBirthDate}
                                    maximumDate={new Date()}
                                    buttonTitle={birthDate ? getStringFromDateForConsole(birthDate) : "Fecha de Nacimiento"}
                                    inputStyle={styles.input}
                                    textStyle={{ color: "#999", fontSize: 18 }}
                                />

                            </View>
                        </ProgressStep>

                        {/* Paso 2 */}
                        <ProgressStep
                            nextBtnStyle={styles.nextButtonStyle}
                            nextBtnTextStyle={styles.buttonText}
                            nextBtnText="Siguiente"

                            previousBtnStyle={styles.previousButtonStyle}
                            previousBtnTextStyle={styles.buttonText}
                            previousBtnText="Atras"

                            nextBtnDisabled={!aceptPolicy || dniCheck.isExists}
                            onNext={() => onNext(2)}
                            errors={error}
                        >
                            <View style={{ marginBottom: 30 }}>
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepSubtitle}>
                                        Identificación
                                    </Text>

                                    {fieldErrors.dni && <Text style={styles.errorText}>{fieldErrors.dni}</Text>}
                                    {dniCheck.isExists === true && <Text style={styles.errorText}>Este nro de D.N.I ya existe</Text>}
                                    <Text style={{ fontSize: 16, color: principalColorVecino }}>Ingresar DNI sin puntos ni comas.</Text>
                                    <TextInput
                                        placeholder="Nro de DNI"
                                        placeholderTextColor="#999"
                                        value={registerData.dni}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        onChangeText={(text) =>
                                            handleInputChange("dni", text)
                                        }
                                        style={styles.input}
                                    />

                                    {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
                                    {fieldErrors.confirmPassword && <Text style={styles.errorText}>{fieldErrors.confirmPassword}</Text>}
                                    <PasswordInput
                                        value={registerData.password}
                                        onChangeText={(text) => handleInputChange("password", text)}
                                        placeholder="Escriba su contraseña"
                                        containerStyle={{ width: '100%' }}
                                        inputStyle={styles.input}
                                        eyeColor={"#999"}
                                        backgroundEyeColor={styles.input.backgroundColor}
                                        maxLength={21}
                                    />

                                    <PasswordInput
                                        value={registerData.confirmPassword}
                                        onChangeText={(text) => handleInputChange("confirmPassword", text)}
                                        placeholder="Confirme su contraseña"
                                        containerStyle={{ width: '100%' }}
                                        inputStyle={styles.input}
                                        eyeColor={"#999"}
                                        backgroundEyeColor={styles.input.backgroundColor}
                                        maxLength={21}
                                    />
                                </View>

                                <VisorTerminosYCondiciones
                                    aceptPolicy={aceptPolicy}
                                    setAceptPolicy={setAceptPolicy}
                                    setIsChildScrollActive={setIsChildScrollActive}
                                />

                            </View>

                        </ProgressStep>

                        {/* Paso 3 */}
                        <ProgressStep
                            nextBtnStyle={styles.nextButtonStyle}
                            nextBtnTextStyle={styles.buttonText}
                            nextBtnText="Siguiente"

                            previousBtnStyle={styles.previousButtonStyle}
                            previousBtnTextStyle={styles.buttonText}
                            previousBtnText="Atras"

                            onNext={() => onNext(3)}
                            errors={error}
                        >
                            <View style={styles.stepContent}>
                                <Text style={styles.stepSubtitle}>
                                    Información del Domicilio
                                </Text>
                                {fieldErrors.direccion && <Text style={styles.errorText}>{fieldErrors.direccion}</Text>}


                                <Text style={{ fontSize: 16, color: principalColorVecino, alignSelf: 'flex-start' }}>Selecciona un Barrio:</Text>
                                <View style={styles.inputPicker}>
                                    <Picker
                                        selectedValue={registerData.barrio}
                                        onValueChange={(itemValue) => handleInputChange("barrio", itemValue)}
                                    >
                                        <Picker.Item value={null} label="Seleccione su Barrio" enabled={registerData.barrio === null} />
                                        {barrios.sort((a, b) => a.name.localeCompare(b.name)).map((barrio) => (
                                            <Picker.Item key={barrio.id} label={barrio.name} value={barrio.id} />
                                        ))}
                                    </Picker>
                                </View>

                                <Text style={styles.cualEsMiBarrioTexto}>
                                    Como se cual es mi barrio?
                                    <Link href={"/maps/mapaCualEsMiBarrio"} style={styles.link}>Presione aquí para consultar su barrio.</Link>
                                </Text>

                                <TextInput
                                    placeholder="Calle"
                                    placeholderTextColor="#999"
                                    value={registerData.nombreCalle}
                                    onChangeText={(text) =>
                                        handleInputChange("nombreCalle", text)
                                    }
                                    style={styles.input}
                                />

                                <TextInput
                                    placeholder="Número de Calle"
                                    placeholderTextColor="#999"
                                    value={registerData.nroCalle}
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    onChangeText={(text) =>
                                        handleInputChange("nroCalle", text)
                                    }
                                    style={styles.input}
                                />

                                <TextInput
                                    placeholder="Manzana"
                                    placeholderTextColor="#999"
                                    value={registerData.manzana}
                                    onChangeText={(text) =>
                                        handleInputChange("manzana", text)
                                    }
                                    style={styles.input}
                                />

                                <TextInput
                                    placeholder="Lote"
                                    placeholderTextColor="#999"
                                    value={registerData.lote}
                                    onChangeText={(text) =>
                                        handleInputChange("lote", text)
                                    }
                                    style={styles.input}
                                />

                                <Text style={{ fontSize: 16, color: principalColorVecino, textAlign: "center" }}>
                                    Por favor, complete <Text style={{ fontWeight: 'bold' }}>Calle y Número de Calle
                                    </Text> o <Text style={{ fontWeight: 'bold' }}>Manzana y Lote</Text>.
                                    También puede completar ambas opciones.
                                </Text>
                            </View>
                        </ProgressStep>

                        {/* Paso 4 */}
                        <ProgressStep
                            nextBtnStyle={styles.nextButtonStyle}
                            nextBtnTextStyle={Platform.OS === "ios" ? styles.registerButtonText : styles.buttonText}
                            finishBtnText="Registrarse"

                            previousBtnStyle={styles.previousButtonStyle}
                            previousBtnTextStyle={styles.buttonText}
                            previousBtnText="Atras"

                            nextBtnDisabled={!ubicacionSeleccionada.latitud || !ubicacionSeleccionada.longitud}
                            onSubmit={handleRegister}
                            errors={error}
                        >
                            <View style={{ marginBottom: 30 }}>
                                <View style={styles.mapStepContent}>

                                    <Text style={styles.stepMapSubtitle}>
                                        Seleccione la ubicación de su domicilio
                                    </Text>

                                    {!map ? (
                                        <View style={{ width: "100%" }}>
                                            <Text>Cargando mapa...</Text>
                                        </View>
                                    ) :
                                        (<View style={{ width: "100%" }}>
                                            <MapLocationSelector
                                                onLocationSelect={handleLocationSelect}
                                                principalColor={principalColorVecino}
                                                secondaryColor={colorBotonCambioMapType}
                                                buttonText="Marcar ubicación"
                                                unselectButtonText="Desmarcar ubicación"
                                                showInstructions={true}
                                                instructionsText="Arrastre el mapa para centrar su domicilio y luego presione el botón para seleccionar."
                                                setLocationLoaded={() => setLocationLoaded(true)}
                                                ubicacionSoloEnAnisacate={true}
                                            />
                                        </View>)
                                    }

                                </View>

                            </View>

                        </ProgressStep>
                    </ProgressSteps>

                    <FailedToast
                        visible={dniNoValido}
                        message={"Los datos ingresados no son validos!"}
                        onHide={() => setDniNoValido(false)}
                    />

                    {valoresRepetidos &&
                        <FailedToast
                            visible={valoresRepetidosBool}
                            message={valoresRepetidos}
                            onHide={() => setValoresRepetidosBool(false)}
                            duration={4500}
                        />
                    }

                    <LoadingLogoAnimatedTransparent isLoading={isLoading} />

                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        justifyContent: "center",
        paddingBottom: 40
    },
    registerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: principalColorVecino,
        marginTop: 10,
        textAlign: "center",
    },
    stepContent: {
        alignSelf: 'center',
        width: "85%",
        paddingVertical: 25,
        paddingHorizontal: 20,
        marginBottom: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
    },
    mapStepContent: {
        alignSelf: 'center',
        width: "85%",
        height: "auto",
        margin: 10,
        paddingVertical: 0,
        paddingHorizontal: 0,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
    },
    stepSubtitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: principalColorVecino,
        marginBottom: 15,
    },
    stepMapSubtitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: principalColorVecino,
        marginVertical: 15,
    },
    headerText: {
        position: 'absolute',
        top: 5,
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: 'black',
        padding: 10,
        borderRadius: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    previousButtonStyle: {
        marginTop: 3,
        backgroundColor: '#1E73BE',
        borderRadius: 8,
        paddingVertical: 10,
        width: 110,
        marginLeft: 5,
        elevation: 2,
    },
    nextButtonStyle: {
        marginTop: 3,
        backgroundColor: '#61B353',
        borderRadius: 8,
        paddingVertical: 10,
        width: 110,
        marginLeft: 5,
        elevation: 2,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'white',
    },
    registerButtonText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
    },
    floatingButtonContainer: {
        alignSelf: 'center',
    },
    buttonContainerList: {
        backgroundColor: '#61B353',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 3,
    },
    buttonContainerDisabled: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 0,
        backgroundColor: '#1E73BE',
    },
    mapInstructions: {
        flex: 0.8,
        textAlign: "left",
        fontSize: 13,
        color: "#555",
        marginVertical: 10,
        marginLeft: 10
    },
    errorMapText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
        color: "red",
        marginVertical: "5%",
    },
    inputPicker: {
        borderRadius: 8,
        backgroundColor: '#F0F1F3',
        width: '100%',
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 15,
    },
    input: {
        borderRadius: 8,
        backgroundColor: '#F0F1F3',
        width: '100%',
        padding: 12,
        textAlign: 'left',
        fontSize: 18,
        marginBottom: 15,
    },
    buttonContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        textAlign: "center",
    },
    cualEsMiBarrioTexto: {
        padding: 5,
        borderWidth: 1,
        borderColor: principalColorVecino,
        borderRadius: 8,
        fontSize: 16,
        color: '#4A4A4A',
        marginBottom: 20,
        textAlign: 'center',
    },
    link: {
        color: principalColorVecino,
        textDecorationLine: 'underline',
    },
});