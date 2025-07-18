import { getMisSolicitudesVecino } from "@/api/petitions";
import LoadingLogoPulse from "@/components/LoadingLogoAnimated";
import Pagination from "@/components/Pagination";
import SolicitudCard from "@/components/SolicitudCard";
import { principalColorAdmin } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const principalColor = principalColorAdmin;


export default function usuarioActivity() {
    const { authData } = useAuth();

    const { usuarioStr } = useLocalSearchParams();
    const usuario = usuarioStr ? JSON.parse(usuarioStr as string) : {};

    const [solicitudesVecino, setSolicitudesVecino] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getMisSolicitudesVecino(usuario.id, page, pageSize);
                setSolicitudesVecino(response.solicitudes);
                setTotalPages(response.totalPages);
            } catch (error) {
                setSolicitudesVecino([]);
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (authData.rol === "admin") {
            fetchData();
        }
    }, [page, authData.rol])


    const renderItem = ({ item }: { item: MisSolicitudesResponse }) => (
        <SolicitudCard
            id={item.id}
            nombreTipoReclamo={item.nombreTipoReclamo}
            nombreSubTipoReclamo={item.nombreSubTipoReclamo}
            nombrePoste={item.nombrePoste}
            latitud={item.latitud}
            longitud={item.longitud}
            nombreBarrio={item.nombreBarrio}
            fechaReclamo={item.fechaReclamo}
            horaReclamo={item.horaReclamo}
            fechaArreglo={item.fechaArreglo}
            horaArreglo={item.horaArreglo}
            nombreEstadoReclamo={item.nombreEstadoReclamo}
            rol={authData.rol}
        />
    );


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoPulse isLoading={true} />
            ) : (
                <ScrollView>
                    <View style={styles.header}>
                        <Text style={styles.title}>Información del Vecino</Text>
                        <View style={styles.card}>
                            <Text style={styles.infoText}>{usuario.nombre} {usuario.apellido}</Text>
                            <Text style={styles.infoSubText}>DNI: {usuario.dni}</Text>
                            <Text style={styles.infoSubText}>
                                Tipo Usuario: {usuario.nombreTipoUsuario}{" "}
                                {usuario.nombreTipoUsuario === "tecnico" && usuario.nombreCuadrilla && (
                                    <Text>- Cuadrilla de {usuario.nombreCuadrilla}</Text>
                                )}
                            </Text>
                            {usuario.mail && <Text style={styles.infoSubText}>Email: {usuario.mail}</Text>}
                            {usuario.telefono && <Text style={styles.infoSubText}>Teléfono: {usuario.telefono}</Text>}
                            {usuario.nombreBarrio && <Text style={styles.infoSubText}>Barrio: {usuario.nombreBarrio}</Text>}
                            {usuario.nombreCalle && usuario.numeroCalle && (
                                <Text style={styles.infoSubText}>
                                    Dirección: {usuario.nombreCalle} {usuario.numeroCalle}
                                </Text>
                            )}
                            {usuario.manzana && usuario.lote && (
                                <Text style={styles.infoSubText}>
                                    Manzana: {usuario.manzana} - Lote: {usuario.lote}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.sectionTitle}>Solicitudes del Vecino</Text>

                        <View>
                            {solicitudesVecino.length > 0 ? (
                                <>
                                    <FlatList
                                        data={solicitudesVecino}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        scrollEnabled={false}
                                        contentContainerStyle={{ paddingBottom: 65 }}
                                    />
                                    <View style={{ alignContent: "center" }}>
                                        <Pagination
                                            currentPage={page}
                                            totalPages={totalPages}
                                            onPageChange={(newPage) => setPage(newPage)}
                                            rol={authData.rol}
                                        />
                                    </View>
                                </>

                            ) : (
                                <View style={styles.emptyContainer}>
                                    <MaterialIcons name="info-outline" size={64} color="#1E73BE" />
                                    <Text style={styles.noSolicitudesText}>Aún no hay solicitudes</Text>
                                    <Text style={styles.noSolicitudesSubtitle}>
                                        Cuando el vecino realice solicitudes, aparecerán aquí.
                                    </Text>
                                </View>
                            )}
                        </View>

                    </View>
                </ScrollView>

            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    header: {
        padding: 20,
        backgroundColor: principalColor,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        elevation: 3,
    },
    infoText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    infoSubText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    body: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    noSolicitudesText: {
        fontSize: 18,
        color: "#333",
        marginTop: 10,
    },
    noSolicitudesSubtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 5,
    },
});