import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

export const getUserLocation = async () => {
  const LOCATION_OPTIONS = {
    accuracy: Location.Accuracy.Balanced,
    timeout: 15000,
  };

  try {
    // 1. Solicitar permisos
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    // 2. Manejar permisos denegados
    if (status !== 'granted') {
      const result = await new Promise(resolve => {
        Alert.alert(
          'Ubicación requerida',
          'La aplicación necesita acceso a tu ubicación para funcionar correctamente',
          [
            {
              text: 'Abrir Configuración',
              onPress: () => resolve('settings'),
              style: 'destructive',
            },
            {
              text: 'Cancelar',
              onPress: () => resolve('cancel'),
              style: 'cancel',
            },
          ]
        );
      });

      if (result === 'settings') await Linking.openSettings();
      return null;
    }

    // 3. Verificar servicios de ubicación (solo Android)
    if (Platform.OS === 'android' && !(await Location.hasServicesEnabledAsync())) {
      Alert.alert(
        'GPS desactivado',
        'Por favor activa el GPS para obtener tu ubicación precisa',
        [{ text: 'OK', onPress: () => Linking.openSettings() }]
      );
      return null;
    }

    // 4. Obtener ubicación (primero intentar con caché)
    let location = await Location.getLastKnownPositionAsync();
    if (!location) {
      location = await Location.getCurrentPositionAsync(LOCATION_OPTIONS);
    }

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    };

  } catch (error) {
    console.error('Error de ubicación:', error);
    
    let message = 'Error al obtener ubicación';
    if (error.code === 'LOCATION_TIMEOUT') message = 'Tiempo de espera agotado';
    if (error.code === 'LOCATION_UNAVAILABLE') message = 'Servicio no disponible';

    Alert.alert(
      'Error de ubicación',
      `${message}. Verifica: 
      - Conexión a internet
      - GPS activado
      - Permisos de ubicación`,
      [{ text: 'Entendido' }]
    );
    
    return null;
  }
};
