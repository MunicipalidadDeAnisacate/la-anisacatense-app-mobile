import { Card } from "@rneui/themed";
import { router } from "expo-router";
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const estadisticas = [
    { id: 1, title: "Estadísticas de Solicitudes Generales", pathname: "/admin/estadisticas/estadisticasSolicitudes", image: require("../../../assets/images/menuAdmin/estadisticasSolicitudes.png") },
    { id: 2, title: "Estadísticas de Solicitudes Por Barrio", pathname: "/admin/estadisticas/estadisticasXBarrio", image: require("../../../assets/images/menuAdmin/barrios.png") },
    { id: 3, title: "Estadísticas de Solicitudes Por Tipos y Subtipos", pathname: "/admin/estadisticas/estadisticasSolicitudesXTipo", image: require("../../../assets/images/menuAdmin/tipos-y-subtipos.png") },
    { id: 4, title: "Estadísticas por Vecino", pathname: "/admin/estadisticas/estadisticasXVecino", image: require("../../../assets/images/menuAdmin/estadisticasVecinos.png") },
];

export default function menuDeEstadisticas() {
    const setAndNavigate = (estadistica: any) => {
        router.push({
            pathname: estadistica.pathname
        })
    }


    const renderItemEstadistica = ({ item }) => (
        <TouchableOpacity onPress={() => setAndNavigate(item)}>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <Image source={item.image} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>

            <FlatList
                data={estadisticas}
                renderItem={renderItemEstadistica}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 60 }}
            />

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    card: {
        borderRadius: 10,
        padding: 15,
        alignItems: 'flex-start',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: 80,
        height: 80,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginRight: 10,
    },
    textContainer: {
        width: '70%',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})