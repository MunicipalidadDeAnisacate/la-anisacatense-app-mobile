import { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { iniciarSolicitud } from "@/api/petitions";
import LoadingLogoAnimatedTransparent from "@/components/LoadingLogoAnimatedTransparent";
import { useAuth } from "@/context/AuthContext";
import { obtenerIdBarrio } from "@/constants/localizar";
import FailedToast from "@/components/Toasters/FailedToast";
import AnimalsCheckBox from "@/components/AnimalsCheckBoxs";
import { takePhoto, pickImageFromGallery } from "@/functions/imagesForm/takeImage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { capitalizeFirst } from "@/functions/capitalizeFirstLetter";
import { useBackGuard } from "@/hooks/useBackGuard";


export default function NuevaSolicitudForm() {
  const { authData } = useAuth();

  useBackGuard({
    disableGestures: true,
    onBack: () => {
      setIsCancelConfirmationDialogOpen(true);
      return true;
    }
  })

  const [photo, setPhoto] = useState<{ uri: string, name: string, type: string } | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isCancelConfirmationDialogOpen, setIsCancelConfirmationDialogOpen] = useState<boolean>(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkAnimal, setCheckAnimal] = useState<number | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [openFailedToastBooleanState, setOpenFailedToastBooleanState] = useState<boolean>(false);

  const { inputData } = useLocalSearchParams();
  const inputDataObj = inputData ? JSON.parse(inputData as string) : null;


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


  const handleCancel = async () => {
    removePhoto();
    router.back();
  };

  const removePhoto = () => {
    if (photo) {
      setPhoto(null);
    }
  };

  const handleValidate = () => {
    if (inputDataObj.idSubTipoReclamo === 11 && checkAnimal === null) {
      Alert.alert("Validación", "Por favor, complete el animal suelto.");
      return;
    }

    setIsConfirmationDialogOpen(true);
  };


  const handleSubmit = async () => {
    setIsConfirmationDialogOpen(false);
    setIsLoading(true);

    try {

      const inputData = {
        idVecino: inputDataObj.idVecino,
        idSubTipoReclamo: inputDataObj.idSubTipoReclamo,
        latitud: inputDataObj.latitud,
        longitud: inputDataObj.longitud,
        fotoReclamo: photo ? photo : undefined,
        idAnimal: checkAnimal,
        observacionReclamo: observaciones,
        idBarrio: obtenerIdBarrio(inputDataObj.latitud, inputDataObj.longitud)
      };

      const success = await iniciarSolicitud(inputData);

      if (success) {
        removePhoto();

        if (authData.rol === "tecnico") {
          router.push("/menuTecnico/menuTipoSolicitudTecnico");
        } else {
          router.push({
            pathname: "/menuVecino/menuPrincipal",
            params: { openSuccesToast: JSON.stringify(true) },
          });
        }

      } else {
        setOpenFailedToastBooleanState(true);
      }
    } catch (error) {
      console.error("Solicitud fallida:", error);
      setOpenFailedToastBooleanState(true);
    } finally {
      setIsLoading(false);
    }
  };

  const [inputHeight, setInputHeight] = useState(40); // altura mínima


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.container}>
          <Text style={[styles.title, { color: getColorByAuthDataRol(authData.rol) }]}>Nombre de solicitante:</Text>
          {authData && (
            <Text style={styles.subtext}>
              {capitalizeFirst(authData.nombre)} {capitalizeFirst(authData.apellido)}
            </Text>
          )}

          {inputDataObj.idSubTipoReclamo === 11 && (
            <View style={styles.checkboxContainer}>
              <Text style={[styles.title, { color: getColorByAuthDataRol(authData.rol) }]}>Seleccione el animal suelto:</Text>
              <AnimalsCheckBox onAnimalSelect={(animalId) => setCheckAnimal(animalId)} />
            </View>
          )}

          <Text style={[styles.title, { color: getColorByAuthDataRol(authData.rol) }]}>Cargar Foto (opcional)</Text>
          <Text style={styles.subtext}>
            Si desea puede agregar una fotografía del acontecimiento
          </Text>

          <View style={styles.imageContainer}>
            {photo ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: photo.uri }} style={styles.image} />
                <TouchableOpacity style={styles.removeButton} onPress={removePhoto}>
                  <Icon name="trash" size={24} color="white" />
                  <Text style={styles.removeButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionContainer}>

                <TouchableOpacity
                  style={[styles.actionButton, authData.rol === "tecnico" ? { backgroundColor: "#E8F5E9" } : { backgroundColor: "#E3F2FD" }]}
                  onPress={pickImageFromGalleryCall}
                >
                  <Icon name="image" size={24} color={getColorByAuthDataRol(authData.rol)} />
                  <Text style={[styles.actionButtonText, { color: getColorByAuthDataRol(authData.rol) }]}>Galería</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, authData.rol === "tecnico" ? { backgroundColor: "#E8F5E9" } : { backgroundColor: "#E3F2FD" }]}
                  onPress={takePhotoCall}
                >
                  <Icon name="camera" size={24} color={getColorByAuthDataRol(authData.rol)} />
                  <Text style={[styles.actionButtonText, { color: getColorByAuthDataRol(authData.rol) }]}>Cámara</Text>
                </TouchableOpacity>

              </View>
            )}
          </View>


          <View style={{ marginTop: 20 }}>
            <Text style={[styles.title, { color: getColorByAuthDataRol(authData.rol) }]}>Observaciones (opcional):</Text>
            <TextInput
              placeholder="Escriba sus observaciones aquí..."
              placeholderTextColor="#999"
              value={observaciones}
              onChangeText={setObservaciones}
              multiline
              style={{
                minHeight: 40,
                height: inputHeight,
                textAlignVertical: 'top',
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderColor: "#D1D5DB",
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: "#FFFFFF",
                color: "#1F2937",
              }}
              onContentSizeChange={(e) => {
                setInputHeight(e.nativeEvent.contentSize.height);
              }}
              maxLength={250}
            />
          </View>

          <View style={styles.buttonContainerView}>
            <Button
              title="Enviar Solicitud"
              containerStyle={styles.buttonContainer}
              titleStyle={styles.buttonText}
              buttonStyle={[styles.acceptButton, { backgroundColor: getColorByAuthDataRol(authData.rol) }]}
              onPress={handleValidate}
            />
            <Button
              title="Cancelar"
              containerStyle={styles.buttonContainer}
              titleStyle={styles.buttonText}
              buttonStyle={styles.cancelButton}
              onPress={handleCancel}
            />
          </View>

          <ConfirmationDialog
            visible={isConfirmationDialogOpen}
            description="Desea generar la solicitud?"
            onCancel={() => setIsConfirmationDialogOpen(false)}
            onConfirm={handleSubmit}
          />

          <ConfirmationDialog
            title="Cancelar Solicitud?"
            visible={isCancelConfirmationDialogOpen}
            description="¿Desea volver atrás? Se perderan los datos ingresados"
            confirmText="Si, volver"
            onCancel={() => setIsCancelConfirmationDialogOpen(false)}
            onConfirm={handleCancel}
          />

          <LoadingLogoAnimatedTransparent isLoading={isLoading} />
        </SafeAreaView>

        <FailedToast
          visible={openFailedToastBooleanState}
          message={"No se pudo cargar la solicitud, intente luego"}
          onHide={() => setOpenFailedToastBooleanState(false)}
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,
    paddingTop: 10
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    color: "#4A4A4A",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 16,
    color: "#6C757D",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    width: "85%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },
  previewContainer: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5C5C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    width: "40%",
  },
  actionButtonText: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonContainerView: {
    marginTop: 40,
    marginBottom: 40,
    width: "80%"
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 15,
  },
  falseReclaimButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 10
  },
  cancelButton: {
    backgroundColor: 'gray',
    borderRadius: 8,
    paddingVertical: 10,
  },
  acceptButton: {
    borderRadius: 8,
    paddingVertical: 10,
  },
  checkboxContainer: {
    marginBottom: 20,
    width: "100%",
  },
  checkboxText: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  input: {
    maxWidth: "90%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});