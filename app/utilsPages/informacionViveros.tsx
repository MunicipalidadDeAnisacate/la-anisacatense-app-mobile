import { principalColorVecino } from "@/constants/Colors";
import { useBackGuard } from "@/hooks/useBackGuard";
import { Button } from "@rneui/themed/dist/Button";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View, Linking } from "react-native";


const ubicacionesZoonosis = [
  { key: 1, nombre: "Vivero Municipal", linkUbi: "https://maps.app.goo.gl/uKN1EzDUeqLnswsK9" },
  { key: 2, nombre: "Vivero La Marianita", linkUbi: "https://maps.app.goo.gl/mzP2a2NFCxoudLJC8" }
];

export default function InformacionViveros() {
  const { subTipoTitleStr } = useLocalSearchParams();

  const openLink = (url: string) => Linking.openURL(url);


  useBackGuard({
    disableGestures: true,
    onBack: () => {
      router.push("/menuVecino/menuPrincipal");
      return true;
    },
  })


  const getQueRetira = (str: string): string => {
    const sinPrefijo = str.replace(/^reservar\s+/i, '').toLowerCase();
    const primeraPalabra = sinPrefijo.split(' ')[0];
    const articulo = primeraPalabra.endsWith('as') ? 'las' : 'los';
    return `${articulo} ${sinPrefijo}`;
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Reserva confirmada!</Text>

        <Text style={styles.subtitle}>
          Ya podés retirar {getQueRetira(subTipoTitleStr.toString())}
        </Text>

        <View style={styles.scheduleBox}>
          <Text style={styles.scheduleText}>Horario de retiro:</Text>
          <Text style={styles.scheduleText}>Lunes a viernes</Text>
          <Text style={styles.scheduleText}>9:00 a 13:00 hs</Text>
        </View>

        <Text style={styles.sectionTitle}>Ubicaciones de Viveros</Text>

        {ubicacionesZoonosis.map((ubicacion) => (
          <Button
            key={ubicacion.key}
            title={ubicacion.nombre}
            onPress={() => openLink(ubicacion.linkUbi)}
            icon={{
              name: 'map-marker',
              type: 'font-awesome',
              color: 'white',
              size: 20,
            }}
            buttonStyle={styles.locationButton}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
            iconContainerStyle={styles.iconContainer}
          />
        ))}

        <Button
          title={"Volver al inicio"}
          onPress={() => router.push("/menuVecino/menuPrincipal")}
          buttonStyle={styles.goHomeButton}
          containerStyle={[styles.buttonContainer, {marginTop: 50}]}
          titleStyle={styles.buttonText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: principalColorVecino,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  scheduleBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '500',
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  locationButton: {
    backgroundColor: principalColorVecino,
    paddingVertical: 16,
  },
  goHomeButton: {
    backgroundColor: 'gray',
    borderRadius: 8,
    paddingVertical: 13,
  },
  buttonContainer: {
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  iconContainer: {
    marginRight: 8,
  },
});