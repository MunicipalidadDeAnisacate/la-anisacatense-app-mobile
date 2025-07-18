// hooks/useBackGuard.ts
import { useCallback, useLayoutEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useNavigation, router, useFocusEffect } from 'expo-router';

/**
 * Hook para interceptar la acción “ir atrás”.
 *
 * @param opts – configuración
 *   • onBack      : callback => true  → consumimos back;  false → se propaga
 *   • disableGestures: desactiva el “swipe-back” en iOS
 */
export type BackGuardOptions = {
  onBack?: () => boolean | void;
  disableGestures?: boolean;
  fallbackRoute?: string;
};

export const useBackGuard = ({
  onBack,
  disableGestures = false,
  fallbackRoute,
}: BackGuardOptions = {}) => {
  const nav = useNavigation();

  // 1. Desactivar gestures iOS *solo en esta pantalla*
  useLayoutEffect(() => {
    if (disableGestures && Platform.OS === 'ios') {
      nav.setOptions({ gestureEnabled: false });
    }
    // No hace falta revertir: al desmontar la pantalla se vuelve a la config por defecto.
  }, [disableGestures, nav]);

  // 2. HW_Back en Android *solo mientras la pantalla está enfocada*
  useFocusEffect(
    useCallback(() => {
      const handler = () => {
        if (onBack) {
          // si devuelve true, consume evento; false → deja pasar
          const result = onBack();
          return result === undefined ? true : !!result;
        }
        if (fallbackRoute) {
          router.replace(fallbackRoute);
          return true;
        }
        return false; // propaga al nav por defecto
      };

      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        handler
      );
      return () => sub.remove();
    }, [onBack, fallbackRoute])
  );
};