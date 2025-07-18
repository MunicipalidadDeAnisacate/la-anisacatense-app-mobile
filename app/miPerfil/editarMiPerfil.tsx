import React, { useState, useEffect } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '@rneui/themed';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import SuccessToast from '@/components/Toasters/SuccesToast';
import FailedToast from '@/components/Toasters/FailedToast';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { DatePickerInput } from '@/components/DatePickerInput';
import { getColorByAuthDataRol } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { findUsuarioById, patchUsuario } from '@/api/petitions';
import getStringFromDateForConsole from '@/functions/dates/getStringFromDateForConsole';
import { router } from 'expo-router';
import { validateEditPerfilUser } from '@/functions/formsValidation/userPerfilModifValidation';
import { parseDateString } from '@/functions/dates/parseDateStringFINAL';
import { formatDateForBackend } from '@/functions/dates/formatDateForBackendFINAL';
import LoadingLogoPulse from '@/components/LoadingLogoAnimated';
import { useBackGuard } from '@/hooks/useBackGuard';

export default function EditarMiPerfil() {
  const { authData } = useAuth();
  const primaryColor = getColorByAuthDataRol(authData.rol);

  useBackGuard({
    disableGestures: true,
    onBack: () => {
      setConfirmCancel(true);
      return true;
    }
  })

  // --- Estados del formulario ---
  const [newNombre, setNewNombre] = useState<string>(authData.nombre);
  const [newApellido, setNewApellido] = useState<string>(authData.apellido);
  const [newEmail, setNewEmail] = useState<string>(authData.mail);
  const [newTelefono, setNewTelefono] = useState<string>(authData.telefono);
  const [newFechaNacimiento, setNewFechaNacimiento] = useState<Date>(new Date());

  // --- UI / Feedback ---
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failedVisible, setFailedVisible] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);


  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await findUsuarioById(authData.id);
        if (data) {
          setNewEmail(data.mail);
          setNewTelefono(data.telefono.slice(3));
          setNewFechaNacimiento(parseDateString(data.fechaNacimiento));
        }
      } catch (err) {
        console.error('Error obteniendo perfil:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [authData.id]);


  const handleChangeTelefono = (char: string): void => {
    if ((newTelefono === "" && char == "0") || (newTelefono === "" && char === " ") || (newTelefono === "" && char === "+")) {
      return;
    }
    const ultimoChar = char.charAt(char.length - 1);
    if ((ultimoChar === "+" || ultimoChar === "." || ultimoChar === "-")) {
      return;
    }
    const primerChar = char.charAt(0);
    if(primerChar === "0" || primerChar === "+"){
      return;
    }
    setNewTelefono(char);
  }


  const onSavePress = () => {
    const errors = validateEditPerfilUser({ nombre: newNombre, apellido: newApellido, email: newEmail, telefono: newTelefono, fechaNacimiento: newFechaNacimiento });
    if (errors.length > 0) {
      Alert.alert('Errores de validación', errors.join('\n'));
      return;
    }
    setConfirmSave(true);
  };


  // --- Manejo de guardado ---
  const handleSave = async () => {
    setConfirmSave(false);
    setLoading(true);
    try {
      const usuario = {
        id: authData.id,
        newNombre: newNombre.toLowerCase().trim(),
        newApellido: newApellido.toLowerCase().trim(),
        newMail: newEmail.toLowerCase().trim(),
        newTelefono: newTelefono.trim(),
        newFechaNacimiento: formatDateForBackend(newFechaNacimiento),
      };

      const success = await patchUsuario(usuario);

      if (success) {
        setSuccessVisible(true);
        setTimeout(() => router.back(), 3000);
      } else {
        setFailedVisible(true);
      }

    } catch (err) {
      console.error('Error editando perfil:', err);
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
          Editar Perfil
        </Text>

        {/* Nombre */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={newNombre}
            onChangeText={setNewNombre}
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#999"
          />
        </View>

        {/* Apellido */}
        <View style={styles.field}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={newApellido}
            onChangeText={setNewApellido}
            placeholder="Ingresa tu apellido"
            placeholderTextColor="#999"
          />
        </View>

        {/* Fecha de Nacimiento */}
        <View style={styles.field}>
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <DatePickerInput
            date={newFechaNacimiento}
            onChange={setNewFechaNacimiento}
            maximumDate={new Date()}
            buttonTitle={getStringFromDateForConsole(newFechaNacimiento)}
            inputStyle={styles.input}
            textStyle={styles.dateText}
            buttonBackgroundColorByRol={getColorByAuthDataRol(authData.rol)}
          />
        </View>

        {/* Teléfono */}
        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={newTelefono}
            onChangeText={handleChangeTelefono}
            placeholder="Ej: +123456789"
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="ejemplo@dominio.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            title="Guardar Cambios"
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

      {/* Diálogos de confirmación */}
      <ConfirmationDialog
        visible={confirmSave}
        title="Guardar cambios?"
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

      {/* Toasters */}
      <SuccessToast
        visible={successVisible}
        message="Perfil actualizado!"
        onHide={() => setSuccessVisible(false)}
      />
      <FailedToast
        visible={failedVisible}
        message="Error al actualizar. Intenta de nuevo."
        onHide={() => setFailedVisible(false)}
      />
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16
  },
  dateText: {
    flex: 1,
    color: '#555',
    fontSize: 16
  },
  buttonContainer: {
    marginTop: 30
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
  }
});
