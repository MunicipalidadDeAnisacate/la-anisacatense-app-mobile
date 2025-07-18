import { Card, Image } from "@rneui/themed";
import { router } from "expo-router";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const tipoUsuariosItems = [
    { id: 1, title: "Vecino", image: require("../../../assets/images/menuAdmin/vecino.png") },
    { id: 2, title: "Técnico", image: require("../../../assets/images/menuAdmin/tecnico.png") },
    { id: 3, title: "Administrador", image: require("../../../assets/images/menuAdmin/administrador.png") }
];


export default function menuDeUsuarios() {


    const setAndNavigate = (tipoUsuario: any) => {
        router.push({
            pathname: "/admin/usuarios/operacionesSobreUsuarios",
            params: { tipoUsuarioParam: JSON.stringify(tipoUsuario) }
        })
    }


    const renderItemTipoUsuario = ({ item }) => (
        <TouchableOpacity onPress={() => setAndNavigate(item)}>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <Image source={item.image} style={styles.image} />
                    <View style={styles.textContainer}>
                        {item.id === 3 ? (
                            <Text style={styles.title}>Administrar {item.title}es</Text>
                        ) : (
                            <Text style={styles.title}>Administrar {item.title}s</Text>
                        )}

                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>

            <FlatList
                data={tipoUsuariosItems}
                renderItem={renderItemTipoUsuario}
                keyExtractor={(item) => item.id.toString()}
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

});
