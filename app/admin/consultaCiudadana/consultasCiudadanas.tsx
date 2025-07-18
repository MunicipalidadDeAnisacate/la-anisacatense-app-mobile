import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import LoadingLogoPulse from "@/components/LoadingLogoAnimated";
import Pagination from "@/components/Pagination";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SuccessToast from "@/components/Toasters/SuccesToast";
import FailedToast from "@/components/Toasters/FailedToast";
import { MaterialIcons } from "@expo/vector-icons";
import { getColorByAuthDataRol } from "@/constants/Colors";
import ConsultaCiudadanaItemCard from "@/components/ConsultaCiudadanaItemCard";
import { getAllConsultasCiudadanas, patchCerrarConsulta } from "@/api/petitions";


export default function Usuarios() {
    const { authData } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [consultas, setConsultas] = useState<ConsultaCiudadanaItemResponse[]>([]);
    const [consultaSeleccionada, setConsultaSeleccionada] = useState<number | null>(null);

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 50;

    const [openCancelCD, setOpenCancelCD] = useState<boolean>(false);
    const [openSuccessToast, setOpenSuccessToast] = useState<boolean>(false);
    const [openFailedToast, setOpenFailedToast] = useState<boolean>(false);


    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await getAllConsultasCiudadanas(page, pageSize);
                setConsultas(response.consultas);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })()
    }, [page]);


    const handleCerrarConsulta = async () => {
        if (!consultaSeleccionada) return;
        setLoading(true);
        try {
            const success = await patchCerrarConsulta(consultaSeleccionada);
            
            if (success) {
                setConsultas((prev) =>
                    prev.filter((consulta) => consulta.id !== consultaSeleccionada)
                );
                setOpenSuccessToast(true);
            } else {
                setOpenFailedToast(true);
            }
        } catch (error) {
            console.error("Error cerrando la consulta", error);
        } finally {
            setConsultaSeleccionada(null);
            setOpenCancelCD(false);
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: ConsultaCiudadanaItemResponse }) => {
        return (
            <ConsultaCiudadanaItemCard
                id={item.id}
                titulo={item.titulo}
                fechaInicio={item.fechaInicio}
                horaInicio={item.horaInicio}
                fechaCierre={item.fechaCierre}
                horaCierre={item.horaCierre}
                rol={authData.rol}
            />
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoPulse isLoading={true} />
            ) : consultas?.length > 0 ? (
                <View style={styles.content}>
                    <FlatList
                        data={consultas}
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
                        <Text style={styles.noConsultas}>No se encontraron Consultas Ciudadanas</Text>
                    </View>
                </View>
            )}

            <ConfirmationDialog
                visible={openCancelCD}
                title={`Desea cerrar la consulta: ${consultaSeleccionada}?`}
                onCancel={() => {
                    setOpenCancelCD(false);
                    setConsultaSeleccionada(null);
                }}
                onConfirm={handleCerrarConsulta}
            />

            <SuccessToast
                visible={openSuccessToast}
                message={"Consulta ciudadana cerrada exitosamente!"}
                onHide={() => setOpenSuccessToast(false)}
            />

            <FailedToast
                visible={openFailedToast}
                message={"No se pudo eliminar la consulta."}
                onHide={() => setOpenFailedToast(false)}
            />

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
    noConsultas: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonWrapper: {
        marginVertical: 2,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});