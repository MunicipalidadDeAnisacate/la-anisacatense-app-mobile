import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View, Alert } from "react-native";
import { findOneSolicitud, getAllSolicitudesViveroXSubTipo } from "@/api/petitions";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { Button } from "@rneui/themed";
import FiltersDialog from "@/components/FiltersDialog";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { estadosSolicitudFilters, subTipoReclamosFilters } from "@/constants/filtros";
import SolicitudViveroCard from "@/components/SolicitudViveroCard";
import { router, useLocalSearchParams } from "expo-router";
import { subTiposDeSolicitud } from "@/constants/tiposYSubTiposConst/SubTiposDeSolicitudes";


export default function buscarSolicitudesVivero() {
    const { authData } = useAuth();
    
    const { subTipoStr } = useLocalSearchParams();
    const subTipo = subTipoStr ? JSON.parse(subTipoStr as string) : undefined;
    
    const solicitudesDeVivero = subTiposDeSolicitud.filter(s => s.id === 17 || s.id == 18).map(s => s.title);

    const [solicitudesItems, setSolicitudesItems] = useState<SolicitudViveroItemListResponse[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState<SolicitudViveroItemListResponse[]>([]);
    const pageSize = 60;
    const [openEstadisticasDialog, setOpenEstadisticasDialog] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const [selectedSubTipoReclamo, setSelectedSubTipoReclamo] = useState<string>("Todos");
    const [selectedEstado, setSelectedEstado] = useState<string>("Todos");


    const filters = [
        {
            label: "Sub Tipo de Solicitud",
            selectedValue: selectedSubTipoReclamo,
            options: [
                { label: "Todos los tipos", value: "Todos" },
                ...subTipoReclamosFilters
            ],

            onValueChange: (value: string) => setSelectedSubTipoReclamo(value),
        },
        {
            label: "Estado de Solicitud",
            selectedValue: selectedEstado,
            options: [
                { label: "Todos los tipos", value: "Todos" },
                ...estadosSolicitudFilters
            ],
            onValueChange: (value: string) => setSelectedEstado(value),
        },
    ];


    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                setLoading(true);
                const response = await getAllSolicitudesViveroXSubTipo(subTipo.id, page, pageSize);
                setSolicitudesItems(response.solicitudes);
                setFilteredSolicitudes(response.solicitudes);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (authData.rol === "tecnico") {
            fetchSolicitudes();
        }
    }, [authData.rol, page]);


    const toggleFilters = () => {
        setOpenEstadisticasDialog(!openEstadisticasDialog);
        setShowFilters(!showFilters);
    }


    const applyFilters = (list: SolicitudViveroItemListResponse[]) => {
        let filtered = list;

        if (selectedSubTipoReclamo !== "Todos") {
            filtered = filtered.filter((solicitud) => solicitud.nombreSubTipoReclamo === selectedSubTipoReclamo);
        }

        if (selectedEstado !== "Todos") {
            filtered = filtered.filter((solicitud) => solicitud.nombreEstado === selectedEstado && solicitud.fechaPrimerReclamo != null && solicitud.horaPrimerReclamo != null)
        }

        setFilteredSolicitudes(filtered);
    };

    useEffect(() => {
        applyFilters(solicitudesItems);
    }, [selectedSubTipoReclamo, selectedEstado]);


    const handleSearch = async (query: string) => {
        if (query.trim() === "") {
            setFilteredSolicitudes(solicitudesItems); // Restablece la lista filtrada
        } else {
            // Busca en la lista actual
            const filtered = solicitudesItems.filter(
                (solicitud) => solicitud.id.toString() === query || solicitud.id.toString().includes(query)
            );

            if (filtered.length > 0) {
                setFilteredSolicitudes(filtered);
            } else {
                // Si no está en la página actual, busca en el backend
                setLoading(true);
                try {
                    const solicitud = await findOneSolicitud(query);
                    if (solicitud) {
                        Alert.alert("Solicitud erronea", "Se encontro una solicitud pero no pertenece al area de vivero.")
                        setFilteredSolicitudes([solicitud])
                    } else {
                        setFilteredSolicitudes([]);
                    }
                } catch (error) {
                    console.error("Error buscando el solicitud en el backend", error);
                    setFilteredSolicitudes([]);
                } finally {
                    setLoading(false);
                }
            }
        }
    };


    const navigateToSolicitudInfo = (solicitudId: number) => {
        const datosParaForm = { 
            idSubTipoReclamo: subTipo.id,
            solicitud: {id: solicitudId},
            titleTipoSolicitud: subTipo.title
        }
        router.push({
            pathname: "/solicitudesForms/newSolutionPage",
            params: {inputData: JSON.stringify(datosParaForm)}
        })
    }



    const renderItem = ({ item }: { item: SolicitudViveroItemListResponse }) => {
        return (
            <SolicitudViveroCard
                id={item.id}
                nombreSubTipoReclamo={item.nombreSubTipoReclamo}
                nombreTipoReclamo={item.nombreTipoReclamo}
                nombreEstado={item.nombreEstado}
                tecnico1={item.nombreTecnico1 ? `${item.nombreTecnico1} ${item.apellidoTecnico1}` : undefined}
                tecnico2={item.nombreTecnico2 ? `${item.nombreTecnico2} ${item.apellidoTecnico2}` : undefined}
                fechaArreglo={item.fechaArreglo}
                horaArreglo={item.horaArreglo}
                fechaPrimerReclamo={item.fechaPrimerReclamo}
                horaPrimerReclamo={item.horaPrimerReclamo}
                solicitudesDeVivero={solicitudesDeVivero}
                navigateToSolicitudInfo={navigateToSolicitudInfo}
                nombreVecino={item.nombreVecino}
                apellidoVecino={item.apellidoVecino}
                dniVecino={item.dniVecino}
            />
        )
    };


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoAnimated isLoading={true} />
            ) : filteredSolicitudes?.length > 0 ? (
                <View style={styles.content}>
                    <View style={{ margin: 10 }}>
                        <SearchInput placeholder="Ingrese el nro Solicitud" onSearch={handleSearch} rol={authData.rol} />
                        <Button
                            title={showFilters ? "Ocultar Filtros  " : "Mostrar Filtros  "}
                            onPress={toggleFilters}
                            buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(authData.rol) }]}
                            containerStyle={styles.buttonWrapper}
                            iconPosition="right"
                            icon={<MaterialIcons name="tune" size={24} color="white" />}
                        />
                    </View>

                    <FlatList
                        data={filteredSolicitudes}
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
                    <View style={{ margin: 10 }}>
                        <SearchInput placeholder="Ingrese el nro Solicitud" onSearch={handleSearch} rol={authData.rol} />
                        <Button
                            title={showFilters ? "Ocultar Filtros  " : "Mostrar Filtros  "}
                            onPress={toggleFilters}
                            buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(authData.rol) }]}
                            containerStyle={styles.buttonWrapper}
                            iconPosition="right"
                            icon={<MaterialIcons name="tune" size={24} color="white" />}
                        />
                    </View>

                    <View style={styles.emptyContainer}>

                        <MaterialIcons name="info-outline" size={64} color={getColorByAuthDataRol(authData.rol)} />

                        <Text style={styles.noSolicitudesText}>Aún no hay solicitudes</Text>

                        <Text style={styles.noSolicitudesSubtitle}>
                            Cuando se realicen solicitudes, aparecerán aquí.
                        </Text>

                    </View>

                </View>
            )}

            <FiltersDialog
                visible={openEstadisticasDialog}
                onDismiss={() => setOpenEstadisticasDialog(false)}
                filters={filters}
                onClose={toggleFilters}
                rol={authData.rol}
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
    searchContainer: {
        marginBottom: 20,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
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
    noSolicitudesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
    noSolicitudesSubtitle: {
        marginTop: 5,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    buttonWrapper: {
        marginVertical: 2,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 10,
    },
});
