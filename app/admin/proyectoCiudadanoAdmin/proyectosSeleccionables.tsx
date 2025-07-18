import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import Pagination from "@/components/Pagination";
import { Button } from "@rneui/themed";
import { getColorByAuthDataRol, principalColorAdmin, principalColorTecnico } from "@/constants/Colors";
import { getAllProyectos } from "@/api/petitions";
import ProyectoCardSeleccionable from "@/components/ProyectoCardSeleccionable";
import { router } from "expo-router";

const principalColor = principalColorAdmin;

export default function proyectosSeleccionables() {
    const { authData } = useAuth();

    const [proyectos, setProyectos] = useState<ProyectoResponse[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 30;


    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                setLoading(true);
                const response = await getAllProyectos(page, pageSize);
                setProyectos(response.proyectos);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (authData.rol === "admin") {
            fetchProyectos();
        }
    }, [authData.rol, page]);


    const renderItem = ({ item }: { item: ProyectoResponse }) => (
        <ProyectoCardSeleccionable
            proyecto={item}
        />
    );


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoAnimated isLoading={true} />
            ) : proyectos?.length > 0 ? (
                <View style={styles.content}>
                    <View style={styles.buttonAbsoluteView}>
                        <Button
                            title="Confirmar selección"
                            buttonStyle={[styles.button, { backgroundColor: principalColorTecnico }]}
                            containerStyle={styles.buttonSpacing}
                            onPress={() => router.back()}
                        />
                    </View>

                    <FlatList
                        data={proyectos}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                    />

                    <View style={{ alignContent: 'center' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                            rol={authData.rol}
                        />
                    </View>

                </View>
            ) : (
                <View style={styles.content}>

                    <View style={styles.emptyContainer}>

                        <MaterialIcons name="info-outline" size={64} color={getColorByAuthDataRol(authData.rol)} />

                        <Text style={styles.noProyectoText}>Aún no hay Proyectos</Text>

                        <Text style={styles.noProyectosSubtitle}>
                            Cuando se agreguen proyectos, aparecerán aquí.
                        </Text>

                    </View>

                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    content: {
        flex: 1,
        padding: 5,
    },
    listContainer: {
        paddingBottom: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    noProyectoText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
    noProyectosSubtitle: {
        marginTop: 5,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    buttonSpacing: {
        marginBottom: 10,
    },
    button: {
        backgroundColor: principalColor,
        margin: 5,
        borderRadius: 8,
        paddingVertical: 10,
        elevation: 3
    },
    buttonAbsoluteView: {
        width: "95%",
        alignSelf:"center"
    }
});
