import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import RootLayout from './RootLayout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Text, TextInput } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { ProyectosProvider } from '@/context/ProyectosContext';


// Desactiva la modificacion de tamanos de fuentes.
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;


export default function ContextWrapper() {

  return (
    <AuthProvider>
      <ProyectosProvider>
        <GestureHandlerRootView style={styles.container}>
          <PaperProvider>
            <RootLayout />
          </PaperProvider>
        </GestureHandlerRootView>
      </ProyectosProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});