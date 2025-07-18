import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import { getMisSolicitudesResueltas, MisSolicitudesReparadas } from "@/api/petitions";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import ReparacionCard from "@/components/ReparacionCard";
import Pagination from "@/components/Pagination";

export default function MisSolicitudesResueltas() {
    const { authData } = useAuth();

    const [solicitudesResueltas, setSolicitudesResueltas] = useState<MisSolicitudesReparadas[]>([]);
    const [isLoadingSolicitudesResueltas, setIsLoadingSolicitudesResueltas] = useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 10;


    useEffect(() => {
        const fetchMisSolicitudesSolucionadas = async () => {
            setIsLoadingSolicitudesResueltas(true)
            try {
                const data = await getMisSolicitudesResueltas(authData.id, page, pageSize);
                setSolicitudesResueltas(data.solicitudesResueltas);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingSolicitudesResueltas(false);
            }
        };
        fetchMisSolicitudesSolucionadas();
    }, [page]);


    const renderItem = ({ item }: { item: MisSolicitudesReparadas }) => (
        <ReparacionCard
            id={item.id}
            nombrePoste={item.nombrePoste} // opcional
            nombreBarrio={item.nombreBarrio}
            latitud={item.latitud}
            longitud={item.longitud}
            nombreTipoReclamo={item.nombreTipoReclamo}
            nombreSubTipoReclamo={item.nombreSubTipoReclamo}
            fechaArreglo={item.fechaArreglo}
            horaArreglo={item.horaArreglo}
            nombreEstadoReclamo={item.nombreEstadoReclamo}
            tecnico1={`${item.nombreTecnico1} ${item.apellidoTecnico1}`}
            tecnico2={item.nombreTecnico2 ? `${item.nombreTecnico2} ${item.apellidoTecnico2}` : undefined}
            nombreAnimal={item.nombreAnimal}
        />
    );


    return (
        <SafeAreaView style={styles.container}>
            { isLoadingSolicitudesResueltas ? (
                <LoadingLogoAnimated isLoading={true} />
            ) : ( solicitudesResueltas?.length > 0 ) ? (
                <>

                    <FlatList
                        data={solicitudesResueltas}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{paddingBottom: 65}}
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
                    <MaterialIcons name="info-outline" size={64} color="#4B9CD3" />
                    <Text style={styles.noReparacionesText}>Aún no hay Solicitudes Resueltas</Text>
                    <Text style={styles.noReparacionesSubtitle}>
                        Cuando se arreglen solicitudes, aparecerán aquí.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop:5,
        paddingRight:5,
        paddingLeft:5,
        paddingBottom: 10,
    },
    noReparacionesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    noReparacionesSubtitle: {
        marginTop: 5,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    }
});
