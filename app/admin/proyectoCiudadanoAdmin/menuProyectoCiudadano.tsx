import { Card } from "@rneui/themed";
import { router } from "expo-router";
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const opcionesProyecto = [
    { id: 1, title: "Ver Proyectos", pathname: "/admin/proyectoCiudadanoAdmin/proyectos", image: require("../../../assets/images/menuAdmin/proyecto.png") },
    { id: 2, title: "Nuevo Proyecto", pathname: "/proyectoCiudadano/nuevoProyecto", image: require("../../../assets/images/menuAdmin/agregar.png") },
];

export default function menuDeProyectoCiudadano() {
    const setAndNavigate = (estadistica: any) => {
        router.push({
            pathname: estadistica.pathname
        })
    }


    const renderItemsProyectos = ({ item }) => (
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
                data={opcionesProyecto}
                renderItem={renderItemsProyectos}
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