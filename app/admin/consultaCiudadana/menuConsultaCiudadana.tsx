import { Card } from "@rneui/themed";
import { router } from "expo-router";
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const opcionesConsultaCiudadana = [
    { id: 1, title: "Ver Consultas Ciudadanas", pathname: "/admin/consultaCiudadana/consultasCiudadanas", image: require("../../../assets/images/menuAdmin/consultaCiudadana.png") },
    { id: 2, title: "Nueva Consulta Ciudadana", pathname: "/admin/consultaCiudadana/nuevaConsultaCiudadana", image: require("../../../assets/images/menuAdmin/agregar.png") },
];

export default function menuConsultaCiudadana() {
    const setAndNavigate = (estadistica: any) => {
        router.push({
            pathname: estadistica.pathname
        })
    }


    const renderItemsConsultas = ({ item }) => (
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
                data={opcionesConsultaCiudadana}
                renderItem={renderItemsConsultas}
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