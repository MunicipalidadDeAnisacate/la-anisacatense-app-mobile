/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Variaciones de celeste
const celesteNuevo = "#4FC3F7";
const verdeEscudoMunicipalidad = "#61B353";
const azulEscudoMunicipalidad = "#1E73BE";
const rosaAdmin = "#FFADBB"

export const colorBotonCambioMapType = azulEscudoMunicipalidad; 
export const colorBotonNuevaSolicitud = verdeEscudoMunicipalidad;

export const principalColorVecino = celesteNuevo;
export const principalColorTecnico = verdeEscudoMunicipalidad;
export const principalColorAdmin = rosaAdmin;

// func usada en varios botones para que el color del background se adapte al rol del user
export const getColorByAuthDataRol = (rol: string): string => {
  switch (rol) {
    case "vecino":
      return principalColorVecino;
    case "tecnico":
      return principalColorTecnico;
    case "admin":
      return principalColorAdmin;
    default:
      return principalColorVecino;
  }
}