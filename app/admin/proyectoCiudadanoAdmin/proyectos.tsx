import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import Pagination from "@/components/Pagination";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { deleteProyecto, getAllProyectos } from "@/api/petitions";
import ProyectoCard from "@/components/ProyectoCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SuccessToast from "@/components/Toasters/SuccesToast";
import FailedToast from "@/components/Toasters/FailedToast";


export default function proyectos() {
    const { authData } = useAuth();

    const [proyectos, setProyectos] = useState<ProyectoResponse[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 30;

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<ProyectoResponse | null>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openSuccessToast, setOpenSuccessToast] = useState<boolean>(false);
    const [openFailedToast, setOpenFailedToast] = useState<boolean>(false);


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


    const openDeleteDialogFunc = (proyecto: ProyectoResponse) => {
        setProyectoSeleccionado(proyecto);
        setOpenDeleteDialog(true);
    }

    const deleteProyect = async () => {
        if (!proyectoSeleccionado) return;
        setLoading(true);
        try {

            let success;
            if (proyectoSeleccionado.id) {
                success = await deleteProyecto(proyectoSeleccionado.id);
            } else {
                success = false;
            }

            if (success) {
                setProyectos((prevProyectos) =>
                    prevProyectos.filter((proyecto) => proyecto.id !== proyectoSeleccionado.id)
                );
                setOpenSuccessToast(true);
            } else {
                setOpenFailedToast(true);
            }

        } catch (error) {
            console.error("Error eliminando el proyecto", error);
            setOpenFailedToast(true);
        } finally {
            setLoading(false);
            setOpenDeleteDialog(false);
            setProyectoSeleccionado(null);
        }
    }


    const renderItem = ({ item }: { item: ProyectoResponse }) => (
        <ProyectoCard
            proyecto={item}
            onDelete={() => openDeleteDialogFunc(item)}
        />
    );


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoAnimated isLoading={true} />
            ) : proyectos?.length > 0 ? (
                <View style={styles.content}>

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

            <ConfirmationDialog
                visible={openDeleteDialog}
                title="Eliminar el proyecto?"
                description="Solo lo puede eliminar si el proyecto nunca fue asignado a una eleccion."
                confirmText="Eliminar"
                onConfirm={deleteProyect}
                onCancel={() => setOpenDeleteDialog(false)}
            />

            <SuccessToast
                visible={openSuccessToast}
                message={"Proyecto eliminado exitosamente!"}
                onHide={() => setOpenSuccessToast(false)}
            />

            <FailedToast
                visible={openFailedToast}
                message={"No se pudo eliminar proyecto."}
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
        marginVertical: 5,
    },
});
