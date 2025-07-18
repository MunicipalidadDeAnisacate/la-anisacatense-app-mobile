import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

export const pickFile = async (maxSizeMB: number) => {
    try {
        const res = await DocumentPicker.getDocumentAsync({
            type: [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ],
            copyToCacheDirectory: true,
        });
        if (!res.canceled && res.assets?.length) {
            const asset = res.assets[0];
            const MAX_SIZE = maxSizeMB * 1024 * 1024; // 5 MB
            if (asset.size > MAX_SIZE) {
                Alert.alert("Archivo muy grande", `Selecciona un archivo menor a ${maxSizeMB} MB.`);
                return;
            }
            return { uri:asset.uri, name: asset.name, type: asset.mimeType ?? "application/octet-stream" };
        }
    } catch (e) {
        Alert.alert("Error con archivo", "Hubo un error cargando el archivo, por favor reintente.");
        console.error("Error al seleccionar documento:", e);
    }
}