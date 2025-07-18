import React, { useState } from 'react';
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
import { principalColorVecino } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { patchContrasenaUsuario } from '@/api/petitions';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useBackGuard } from '@/hooks/useBackGuard';
import { PasswordInput } from '@/components/inputs/PasswordInput';

export default function EditarMiContrasena() {
  const { authData } = useAuth();
  const primaryColor = principalColorVecino;

  useBackGuard({
    disableGestures: true,
    onBack: () => {
      setConfirmCancel(true);
      return true;
    }
  })

  // --- Estados del formulario de contraseña ---
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // --- UI / Feedback ---
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failedVisible, setFailedVisible] = useState(false);
  const [failedVisibleIncorrectP, setFailedVisibleIncorrectP] = useState<boolean>(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  // --- Validación básica ---
  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!currentPassword.trim()) {
      errors.push('Debes ingresar tu contraseña actual.');
    }
    if (!newPassword.trim()) {
      errors.push('Debes ingresar la nueva contraseña.');
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      errors.push('La contraseña debe tener entre 6 y 20 caracteres.');
    }
    if (newPassword !== confirmPassword) {
      errors.push('La nueva contraseña y su confirmación no coinciden.');
    }
    return errors;
  };

  const onSavePress = () => {
    const errors = validateForm();
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
      const success = await patchContrasenaUsuario({
        id: authData.id,
        oldPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      });

      if (typeof (success) === "boolean") {
        if (success) {
          setSuccessVisible(true);
          setTimeout(() => router.back(), 3000);
        } else {
          setFailedVisible(true);
        }
      } else {
        setFailedVisibleIncorrectP(true);
      }

    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      setFailedVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingLogoAnimatedTransparent isLoading={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingLogoAnimatedTransparent isLoading />}

      <KeyboardAwareScrollView contentContainerStyle={styles.form}>
        <Text style={[styles.title, { color: primaryColor }]}>
          Cambiar Contraseña
        </Text>

        {/* Contraseña Actual */}
        <View style={styles.field}>
          <Text style={styles.label}>Contraseña Actual</Text>
          <PasswordInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Ingresa tu contraseña actual"
            containerStyle={{ width: '100%' }}
            inputStyle={styles.input}
            eyeColor={styles.input.borderColor}
            backgroundEyeColor={styles.input.backgroundColor}
          />
        </View>

        {/* Nueva Contraseña */}
        <View style={styles.field}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Ingresa la nueva contraseña"
            containerStyle={{ width: '100%' }}
            inputStyle={styles.input}
            eyeColor={styles.input.borderColor}
            backgroundEyeColor={styles.input.backgroundColor}
            maxLength={21}
          />
        </View>

        {/* Confirmar Nueva Contraseña */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite la nueva contraseña"
            containerStyle={{ width: '100%' }}
            inputStyle={styles.input}
            eyeColor={styles.input.borderColor}
            backgroundEyeColor={styles.input.backgroundColor}
            maxLength={21}
          />
        </View>

        <View style={[styles.field, { marginTop: 20 }]}>
          <Text style={styles.registroTexto}>
            ¿Olvidaste tu contraseña?
            <Link href={"/auth/resetPassword"} style={[styles.link, { color: primaryColor }]}>Recuperar contraseña</Link>
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            title="Guardar Contraseña"
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
        title="¿Cambiar contraseña?"
        description="Se actualizará tu contraseña. ¿Deseas continuar?"
        confirmText="Sí, cambiar"
        cancelText="Cancelar"
        onConfirm={handleSave}
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
        message="Contraseña actualizada con éxito"
        onHide={() => setSuccessVisible(false)}
      />

      <FailedToast
        visible={failedVisible}
        message={"Error al actualizar la contraseña. Intenta de nuevo."}
        onHide={() => setFailedVisible(false)}
      />

      <FailedToast
        visible={failedVisibleIncorrectP}
        message={"La contraseña actual ingresada no es correcta."}
        onHide={() => setFailedVisibleIncorrectP(false)}
        duration={4500}
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
  registroTexto: {
    fontSize: 14,
    color: '#4A4A4A',
    marginVertical: 8,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
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
