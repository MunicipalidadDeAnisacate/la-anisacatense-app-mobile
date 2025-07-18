import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform, Alert } from 'react-native';
import { heicToJpeg } from 'react-native-heic-converter';

// Límite de tamaño máximo en bytes (5 MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Verifica y solicita permiso de cámara si es necesario.
 * Muestra alerta en caso de denegación.
 * @returns true si está permitido, false en caso contrario.
 */
async function ensureCameraPermission(): Promise<boolean> {
  const { status: existingStatus } = await ImagePicker.getCameraPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permiso denegado',
      'Necesitas habilitar el acceso a la cámara en la configuración del dispositivo.'
    );
    return false;
  }
  return true;
}

/**
 * Verifica y solicita permiso de galería si es necesario.
 * Muestra alerta en caso de denegación.
 * @returns true si está permitido, false en caso contrario.
 */
async function ensureGalleryPermission(): Promise<boolean> {
  const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permiso denegado',
      'Necesitas habilitar el acceso a la galería en la configuración del dispositivo.'
    );
    return false;
  }
  return true;
}

/**
 * Convierte HEIC/HEIF a JPEG en iOS si es necesario.
 */
export async function convertHeicToJpegIfNeeded(uri: string): Promise<string> {
  if (Platform.OS === 'ios' && (uri.toLowerCase().endsWith('.heic') || uri.toLowerCase().endsWith('.heif'))) {
    try {
      return await heicToJpeg(uri);
    } catch (error) {
      console.warn('Error convirtiendo HEIC a JPEG:', error);
    }
  }
  return uri;
}

/**
 * Copia un asset 'ph://' de iOS al cache para que sea accesible.
 */
export async function copyAssetToCache(uri: string): Promise<string> {
  if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
    const fileName = `image_${Date.now()}.jpg`;
    const dest = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  }
  return uri;
}

/**
 * Optimiza una imagen iterativamente hasta que su tamaño sea menor a MAX_IMAGE_SIZE.
 */
export async function optimizeImage(uri: string): Promise<string> {
  let info = await FileSystem.getInfoAsync(uri);
  let quality = 0.8;
  let width = 1024;
  let optimizedUri = uri;

  while (info.size && info.size > MAX_IMAGE_SIZE && quality > 0.2) {
    const result = await ImageManipulator.manipulateAsync(
      optimizedUri,
      [{ resize: { width } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );
    optimizedUri = result.uri;
    info = await FileSystem.getInfoAsync(optimizedUri);
    quality -= 0.1;
    width = Math.round(width * 0.9);
  }
  return optimizedUri;
}

/**
 * Toma una foto con cámara, gestiona permisos, procesa HEIC, copia cache y optimiza tamaño.
 */
export async function takePhoto(): Promise<{ uri: string; name: string; type: string } | null> {
  if (!(await ensureCameraPermission())) return null;

  try {
    const pickerOptions = {
      allowsEditing: false,
      quality: 0.7,
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
    };
    const result = await ImagePicker.launchCameraAsync(pickerOptions);
    if (result.canceled || !result.assets.length) return null;

    let uri = result.assets[0].uri;
    uri = await convertHeicToJpegIfNeeded(uri);
    uri = await copyAssetToCache(uri);
    const info = await FileSystem.getInfoAsync(uri);
    if (info.size && info.size > MAX_IMAGE_SIZE) {
      uri = await optimizeImage(uri);
    }

    const ext = uri.split('.').pop() || 'jpg';
    return { uri, name: `photo_${Date.now()}.${ext}`, type: 'image/jpeg' };
  } catch (error) {
    console.error('Error al tomar foto:', error);
    return null;
  }
}

/**
 * Selecciona imagen de galería, gestiona permisos, procesa HEIC, copia cache y optimiza tamaño.
 */
export async function pickImageFromGallery(): Promise<{ uri: string; name: string; type: string } | null> {
  if (!(await ensureGalleryPermission())) return null;

  try {
    const pickerOptions = {
      allowsEditing: false,
      quality: 0.7,
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
    };
    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (result.canceled || !result.assets.length) return null;

    let uri = result.assets[0].uri;
    uri = await convertHeicToJpegIfNeeded(uri);
    uri = await copyAssetToCache(uri);
    const info = await FileSystem.getInfoAsync(uri);
    if (info.size && info.size > MAX_IMAGE_SIZE) {
      uri = await optimizeImage(uri);
    }

    const ext = uri.split('.').pop() || 'jpg';
    return { uri, name: `photo_${Date.now()}.${ext}`, type: 'image/jpeg' };
  } catch (error) {
    console.error('Error al seleccionar imagen:', error);
    return null;
  }
}