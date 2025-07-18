import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, CheckBox } from "@rneui/themed";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import { useAuth } from "@/context/AuthContext";
import RNPickerSelect from 'react-native-picker-select';
import {
  getTecnicos,
  setSolicitudToResuelta,
  TecnicoResponse,
  postNewReparacion
} from "@/api/petitions";
import FailedToast from "@/components/Toasters/FailedToast";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useBackGuard } from "@/hooks/useBackGuard";
import { pickImageFromGallery, takePhoto } from "@/functions/imagesForm/takeImage";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { pickerSelectStyles } from "@/styles/pickerStyles";


export default function NewSolutionPage() {
  const { authData } = useAuth();

  useBackGuard({
    disableGestures: true,
    onBack: () => {
      setIsConfirmationCancelReclaimDialogOpen(true);
      return true;
    }
  })

  // Estados para la imagen
  const [photo, setPhoto] = useState<{ uri: string, name: string, type: string } | null>(null);

  // Otros estados
  const [tecnico2, setTecnico2] = useState<number | null>(null);
  const [observacion, setObservacion] = useState("");
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isConfirmationCancelReclaimDialogOpen, setIsConfirmationCancelReclaimDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openFailedToastBooleanState, setOpenFailedToastBooleanState] = useState<boolean>(false);
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);

  // Variables para checkboxes de reparaciones
  const [cambioFoco, setCambioFoco] = useState(false);
  const [cambioFusible, setCambioFusible] = useState(false);
  const [cambioFotocelula, setCambioFotocelula] = useState(false);
  const [otro, setOtro] = useState(false);

  // Obtención de parámetros desde la URL
  const { inputData } = useLocalSearchParams();
  const inputDataObj = inputData ? JSON.parse(inputData as string) : {};


  useEffect(() => {
    const fetchTecnicos = async () => {
      setIsLoading(true);
      try {
        const tecnicosData = await getTecnicos(authData.id, authData.cuadrilla);
        if (tecnicosData) {
          setTecnicos(tecnicosData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTecnicos();
  }, []);



  const pickImageFromGalleryCall = async () => {
    const image = await pickImageFromGallery();
    if (!image) {
      return;
    }
    setPhoto({ uri: image.uri, name: image.name, type: image.type });
  };

  const takePhotoCall = async () => {
    const image = await takePhoto();
    if (!image) {
      return;
    }
    setPhoto({ uri: image.uri, name: image.name, type: image.type });
  };


  const removePhoto = () => {
    if (photo) {
      setPhoto(null);
    }
  };


  const validateReparaciones = (reparacionesList: number[]) => {
    if ((inputDataObj.idPoste) && reparacionesList.filter(e => e !== 0).length <= 0) {
      Alert.alert("Validación", "Por favor, complete con alguna reparación.");
      return false;
    }
    return true;
  };


  const validateTecnico2 = () => {
    if (!tecnico2 || tecnico2 === null) {
      Alert.alert("Validación", 'Por favor, seleccione un segundo técnico o seleccione "No hay otro técnico".');
      return false;
    }
    return true;
  };


  const openConfirmationDialog = () => {
    if (!validateTecnico2()) {
      return
    }

    const reparacionesList: number[] = [
      cambioFoco ? 1 : 0,
      cambioFusible ? 2 : 0,
      cambioFotocelula ? 3 : 0,
      otro ? 4 : 0,
    ];

    if (inputDataObj.idSubTipoReclamo === 1 && !validateReparaciones(reparacionesList)) {
      return;
    }

    setIsConfirmationDialogOpen(true);
  };


  const handleNewSolicitud = async () => {
    setIsLoading(true);
    setIsConfirmationDialogOpen(false);

    const reparacionesList: number[] = [
      cambioFoco ? 1 : 0,
      cambioFusible ? 2 : 0,
      cambioFotocelula ? 3 : 0,
      otro ? 4 : 0,
    ];

    let reparacionData;
    if (inputDataObj.idPoste && inputDataObj.idSubTipoReclamo) {
      reparacionData = {
        posteId: inputDataObj.idPoste,
        idSubTipoReclamo: inputDataObj.idSubTipoReclamo,
        tecnico1Id: authData.id,
        tecnico2Id: Number(tecnico2) === 0 ? undefined : tecnico2,
        observacion: observacion,
        foto: photo ? photo : undefined,
        reparaciones: reparacionesList.filter(e => e !== 0),
      };
    } else {
      reparacionData = {
        idReclamo: inputDataObj.solicitud.id,
        tecnico1Id: authData.id,
        tecnico2Id: Number(tecnico2) === 0 ? undefined : tecnico2,
        observacion: observacion,
        foto: photo ? photo : undefined,
        idBarrio: inputDataObj.idBarrio ? inputDataObj.idBarrio : undefined,
      };
    }

    try {
      const success = await setSolicitudToResuelta(reparacionData);
      if (success) {
        removePhoto();
        router.push({
          pathname: "/menuTecnico/menuPrincipalTecnico",
          params: { openSuccesToast: JSON.stringify(true) },
        });
      } else {
        setOpenFailedToastBooleanState(true);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setIsLoading(false);
      setIsConfirmationDialogOpen(false);
    }
  };


  const handleNewReparacion = async () => {
    setIsLoading(true);
    setIsConfirmationDialogOpen(false);

    const reparacionData = {
      tipoReclamoId: inputDataObj.idTipoSolicitud,
      tecnico1Id: authData.id,
      tecnico2Id: Number(tecnico2) === 0 ? undefined : tecnico2,
      latitudReclamo: inputDataObj.latitud,
      longitudReclamo: inputDataObj.longitud,
      observacionReparacion: observacion,
      fotoReparacion: photo ? photo : undefined,
      idBarrio: inputDataObj.idBarrio,
    };

    try {
      const success = await postNewReparacion(reparacionData);
      if (success) {
        removePhoto();
        router.push({
          pathname: "/menuTecnico/menuPrincipalTecnico",
          params: { openSuccesToast: JSON.stringify(true) },
        });
      } else {
        setOpenFailedToastBooleanState(true);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setIsLoading(false);
      setIsConfirmationDialogOpen(false);
    }
  };


  const handleSubmit = () => {

    if (inputDataObj.solicitud || inputDataObj.idPoste) {
      handleNewSolicitud();
      return;
    }

    if (!inputDataObj.idSubTipoReclamo) {
      handleNewReparacion();
      return;
    }

    setOpenFailedToastBooleanState(true);
    removePhoto();
  };


  const handleCancel = () => {
    removePhoto();
    setIsConfirmationCancelReclaimDialogOpen(false);
    router.back();
  };


  const getConfirmationDialogDescription = (index: number): string => {
    const descriptions = ["¿Desea cargar el reparacion de la solicitud?"]
    return descriptions[index];
  }


  return (
    <SafeAreaView style={styles.container}>
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
        >
          {inputDataObj.titleTipoSolicitud && <Text style={[styles.title, { color: getColorByAuthDataRol(authData.rol) }]}>Nueva Reparación: {inputDataObj.titleTipoSolicitud}</Text>}
          {inputDataObj.idPoste && <Text style={[styles.subtitle, { color: getColorByAuthDataRol(authData.rol) }]}>Poste: {inputDataObj.nombrePoste}</Text>}
          {inputDataObj.solicitud && <Text style={[styles.subtitle, { color: getColorByAuthDataRol(authData.rol) }]}>Nro solicitud: {inputDataObj.solicitud.id}</Text>}

          <Text style={styles.instructions}>
            Complete la información del segundo técnico y
            si desea puede agregar una foto o una descripcion del trabajo realizado.
          </Text>

          <View style={styles.inputContainer}>

            <Text style={styles.label}>Técnico 1:</Text>
            <TextInput
              value={`${authData.nombre} ${authData.apellido}`}
              style={[styles.input, styles.disabledInput]}
              editable={false}
            />

            <View style={{ marginTop: 5 }}>
              <Text style={styles.label}>Técnico 2:</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  value={tecnico2}
                  onValueChange={(value) => setTecnico2(value)}
                  items={[
                    { label: "No hay otro técnico", value: "0" },
                    ...tecnicos.map(tecnico => ({
                      label: `${tecnico.nombre} ${tecnico.apellido}`,
                      value: tecnico.id,
                    })),
                  ]}
                  placeholder={{ label: "Seleccione un técnico", value: null }}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                  Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc" /></View>}
                  fixAndroidTouchableBug={true}
                />
              </View>
            </View>

          </View>

          {(inputDataObj.idSubTipoReclamo == 1) &&
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Selecciones las reparaciones realizadas:</Text>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  title="Cambio de Foco"
                  checkedColor={getColorByAuthDataRol(authData.rol)}
                  checked={cambioFoco}
                  onPress={() => setCambioFoco(!cambioFoco)}
                  containerStyle={styles.checkbox}
                />
                <CheckBox
                  title="Cambio de Fusible"
                  checkedColor={getColorByAuthDataRol(authData.rol)}
                  checked={cambioFusible}
                  onPress={() => setCambioFusible(!cambioFusible)}
                  containerStyle={styles.checkbox}
                />
                <CheckBox
                  title="Cambio de Fotocelula"
                  checkedColor={getColorByAuthDataRol(authData.rol)}
                  checked={cambioFotocelula}
                  onPress={() => setCambioFotocelula(!cambioFotocelula)}
                  containerStyle={styles.checkbox}
                />
                <CheckBox
                  title="Otro"
                  checkedColor={getColorByAuthDataRol(authData.rol)}
                  checked={otro}
                  onPress={() => setOtro(!otro)}
                  containerStyle={styles.checkbox}
                />
              </View>
            </View>
          }

          <View style={styles.imageContainer}>
            <Text style={styles.label}>Cargar Foto: (opcional)</Text>
            {photo ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: photo.uri }} style={styles.image} />
                <TouchableOpacity style={styles.removeButton} onPress={removePhoto}>
                  <Icon name="trash" size={20} color="white" />
                  <Text style={styles.removeButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={pickImageFromGalleryCall}
                >
                  <Icon name="image" size={24} color={getColorByAuthDataRol(authData.rol)} />
                  <Text style={[styles.actionButtonText, { color: getColorByAuthDataRol(authData.rol) }]}>Galería</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={takePhotoCall}>
                  <Icon name="camera" size={24} color={getColorByAuthDataRol(authData.rol)} />
                  <Text style={[styles.actionButtonText, { color: getColorByAuthDataRol(authData.rol) }]}>Cámara</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripcion del trabajo: (opcional)</Text>
            <TextInput
              value={observacion}
              onChangeText={setObservacion}
              style={styles.input}
              multiline={true}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainerView}>
            <Button
              title="Cargar Reparación"
              containerStyle={styles.buttonContainer}
              titleStyle={styles.buttonText}
              buttonStyle={[styles.acceptButton, { backgroundColor: getColorByAuthDataRol(authData.rol) }]}
              onPress={openConfirmationDialog}
            />

            <Button
              title="Cancelar"
              containerStyle={styles.buttonContainer}
              titleStyle={styles.buttonText}
              buttonStyle={styles.cancelButton}
              onPress={() => setIsConfirmationCancelReclaimDialogOpen(true)}
            />

          </View>

          <ConfirmationDialog
            visible={isConfirmationDialogOpen}
            description={getConfirmationDialogDescription(0)}
            onCancel={() => setIsConfirmationDialogOpen(false)}
            onConfirm={handleSubmit}
          />

          <ConfirmationDialog
            title="Cancelar Reparación"
            visible={isConfirmationCancelReclaimDialogOpen}
            description="¿Desea cancelar el reparación? Se perderan los datos ingresados"
            confirmText="Si, volver"
            onCancel={() => setIsConfirmationCancelReclaimDialogOpen(false)}
            onConfirm={handleCancel}
          />

        </KeyboardAwareScrollView>

      </KeyboardAvoidingView>

      <LoadingLogoAnimatedTransparent isLoading={isLoading} />

      <FailedToast
        visible={openFailedToastBooleanState}
        message={"No se pudo cargar reparación, intente mas tarde"}
        onHide={() => setOpenFailedToastBooleanState(false)}
      />

    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 15,
  },
  instructions: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    width: "100%",
    height: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
  },
  picker: {
    height: 50,
    backgroundColor: "transparent",
  },
  imageContainer: {
    marginBottom: 20,
  },
  previewContainer: {
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 5,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    width: "40%",
  },
  actionButtonText: {
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainerView: {
    marginTop: 5,
    marginBottom: 40
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 15,
  },
  acceptButton: {
    backgroundColor: "#1E73BE",
    borderRadius: 8,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: "#808080",
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  checkbox: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    marginVertical: 8,
  },
});

