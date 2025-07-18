import { principalColorVecino } from "@/constants/Colors";
import { Button } from "@rneui/themed/dist/Button";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View, Linking } from "react-native";

export default function InformacionContactoWppSolicitud() {
  const { contactoStr } = useLocalSearchParams();
  const contactoList = contactoStr ? JSON.parse(contactoStr as string) : {};
  const contacto = Array.isArray(contactoList) ? contactoList[0] : contactoList;

  const openLink = () => {
    Linking.openURL(contacto.link);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{contacto.title}</Text>
        <Text style={styles.text}>{contacto.description}</Text>

        {contacto.type === "wpp" && (
          <Button
            title={"Contáctenos!"}
            onPress={openLink}
            icon={{
              name: 'whatsapp',
              type: 'font-awesome',
              color: 'white',
            }}
            buttonStyle={styles.whatsappButton}
            containerStyle={[styles.buttonContainer, { marginBottom: 15 }]}
            titleStyle={styles.buttonText}
          />
        )}

        {contacto.type === "ubicacion" && (
          <Button
            title={"Ubicación del D.E.M"}
            onPress={openLink}
            icon={{
              name: 'map-marker',
              type: 'font-awesome',
              color: 'white',
            }}
            buttonStyle={styles.locationButton}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
          />
        )}

        {contacto.type === "form" && (
          <Button
            title={"Completar Formulario"}
            onPress={openLink}
            icon={{
              name: 'file-document-outline',
              type: 'material-community',
              color: 'white',
            }}
            buttonStyle={styles.docsButton}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: principalColorVecino,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginVertical: 30,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingVertical: 15,
  },
  locationButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
  },
  docsButton: {
    backgroundColor: '#7248B9',
    paddingVertical: 15,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});