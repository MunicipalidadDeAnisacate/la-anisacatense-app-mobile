import { principalColorAdmin } from "@/constants/Colors";
import { Card, Image } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const principalColor = principalColorAdmin;

const operaciones = [
    { id: 1, operation: "Buscar, Modificar o Eliminar", image: require("../../../assets/images/menuAdmin/buscar-usuario.png") },
    { id: 2, operation: "Agregar", image: require("../../../assets/images/menuAdmin/agregar-usuario.png") }
];


export default function operacionesSobreUsuarios() {
    const { tipoUsuarioParam } = useLocalSearchParams();
    const tipoUsuario = tipoUsuarioParam ? JSON.parse(tipoUsuarioParam as string) : null;


    const setAndNavigate = (idOperation: number) => {
        if (idOperation === 1) {
            router.push({
                pathname: "/admin/usuarios/usuarios",
                params: { tipoUsuarioId: JSON.stringify(tipoUsuario.id) }
            })
        } else if (idOperation === 2) {
            router.push({
                pathname: "/admin/usuarios/usuarioCreateForm",
                params: { tipoUsuarioId: JSON.stringify(tipoUsuario.id) }
            })
        }
    }


    const renderItemOperacionesPorUsuario = ({ item }) => (
        <TouchableOpacity onPress={() => setAndNavigate(item.id)}>
            <Card containerStyle={styles.card}>
                <View style={styles.content}>
                    <Image source={item.image} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.operation} {tipoUsuario.title}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ margin: 5, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: principalColor }}>Administrar {tipoUsuario.title}</Text>
            </View>
            <FlatList
                data={operaciones}
                renderItem={renderItemOperacionesPorUsuario}
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
