import { Image, StyleSheet, SafeAreaView, View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { verifyRefreshToken } from "@/api/petitions";
import { useAuth } from "@/context/AuthContext";


export default function Index() {
  const { logout } = useAuth();

  const municipalidadEscudo = require("../assets/images/escudoAnisacate.png");
  // const personaje = require("../assets/images/anisacatense/anisacatense.png");

  useEffect(() => {
    const verifySession = async () => {
      try {
        const status = await verifyRefreshToken();
        if (status !== 200) {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setTimeout(()=> router.push('/auth/login'), 1500);
      }
    };

    verifySession();
  }, [router]);


  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={municipalidadEscudo}
        style={styles.imagenCentrada}
        resizeMode="contain"
      />

      <View style={styles.ovaloDecorativo}></View>

      {/* <Image
        source={personaje}
        style={styles.personaje}
        resizeMode="contain"
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E73BE",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imagenCentrada: {
    position: "absolute",
    top: "35%",
    width: "80%",
    height: "20%",
  },
  // personaje: {
  //   position: "absolute",
  //   bottom: "-24%",
  //   left: "45%",
  //   width: "75%",
  //   height: "75%"
  // },
  ovaloDecorativo: {
    position: "absolute",
    left: "-10%",
    top: "45%",
    width: 1000,
    height: 1000,
    borderRadius: 700,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
