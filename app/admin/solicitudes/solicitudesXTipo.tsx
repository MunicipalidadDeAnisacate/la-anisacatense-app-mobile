import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View, Alert } from "react-native";
import { findOneSolicitud, getAllSolicitudesXTipo, getAllTecnicos, TecnicoResponse } from "@/api/petitions";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import SolicitudCardAdmin from "@/components/SolicitudCardAdmin";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { Button } from "@rneui/themed";
import FiltersDialog from "@/components/FiltersDialog";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { barriosFilters, estadosSolicitudFilters, subtiposPorTipoFilters, tiposReclamosFilters } from "@/constants/filtros";
import RNPickerSelect from 'react-native-picker-select';
import { pickerSelectStyles } from "../../../styles/pickerStyles.js"


export default function SolicitudesXTipo() {
    const { authData } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);


    const [solicitudesItems, setSolicitudesItems] = useState<SolicitudItemListResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState<SolicitudItemListResponse[]>([]);
    const pageSize = 30;

    const [openFiltersDialog, setOpenFiltersDialog] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const isSearchingRef = useRef(false);

    // Valor por defecto: Todos los tipos (el primer elemento de tipoReclamoOptions)
    const [selectedTipoReclamoId, setSelectedTipoReclamoId] = useState<string>(String(tiposReclamosFilters[0].id));
    const [selectedSubTipoReclamo, setSelectedSubTipoReclamo] = useState<string>("0");
    const [selectedBarrio, setSelectedBarrio] = useState<string>("0");
    const [selectedEstado, setSelectedEstado] = useState<string>("0");
    const [selectedTecnico, setSelectedTecnico] = useState<string>("0");
    const [selectedFechaReclamo, setSelectedFechaReclamo] = useState<string>("0");
    const [selectedFechaReparacion, setSelectedFechaReparacion] = useState<string>("0");

    const [tecnicos, setTecnicos] = useState<{ id: number, label: string; value: string }[]>([]);

    const filters = [
        {
            label: "Barrio",
            selectedValue: selectedBarrio,
            options: [
                { label: "Todos los barrios", value: "0" },
                ...barriosFilters.map(b => ({
                    label: b.label,
                    value: String(b.id)
                }))
            ],
            onValueChange: (value: string) => setSelectedBarrio(value),
        },
        ...(selectedTipoReclamoId !== "0" ? [{
            label: "Sub Tipo de Solicitud",
            selectedValue: selectedSubTipoReclamo,
            options: [
                { label: "Todos los tipos", value: "0" },
                ...((subtiposPorTipoFilters[parseInt(selectedTipoReclamoId)] || []) as Array<{ label: string; value: number }>)
                    .map(st => ({
                        label: st.label,
                        value: String(st.value)
                    }))
            ],
            onValueChange: setSelectedSubTipoReclamo,
        }] : []),
        {
            label: "Estado de Solicitud",
            selectedValue: selectedEstado,
            options: [
                { label: "Todos", value: "0" },
                ...estadosSolicitudFilters.map(e => ({
                    label: e.label,
                    value: String(e.id)
                }))
            ],
            onValueChange: setSelectedEstado,
        },
        ...(selectedEstado !== "1" ? [
            {
                label: "Técnico",
                selectedValue: selectedTecnico,
                options: [
                    { label: "Todos", value: "0" },
                    ...tecnicos.map(t => ({
                        label: t.label,
                        value: String(t.id)
                    }))
                ],
                onValueChange: setSelectedTecnico,
            }
        ] : []),
        {
            label: "Por fecha de Reclamo",
            selectedValue: selectedFechaReclamo,
            options: [
                { label: "Todos", value: "0" },
                { label: "Hoy", value: "1" },
                { label: "Ultima semana", value: "7" },
                { label: "Ultimos 30 días", value: "30" },
                { label: "Ultimos 60 días", value: "60" }
            ],
            onValueChange: setSelectedFechaReclamo,
        },
        ...(selectedEstado !== "1" ? [{
            label: "Por fecha de Reparación",
            selectedValue: selectedFechaReparacion,
            options: [
                { label: "Todos", value: "0" },
                { label: "Hoy", value: "1" },
                { label: "Ultima semana", value: "7" },
                { label: "Ultimos 30 días", value: "30" },
                { label: "Ultimos 60 días", value: "60" }
            ],
            onValueChange: setSelectedFechaReparacion,
        }] : []
        )
    ];


    const fetchSolicitudes = async () => {
        setLoading(true);

        const tipoId = selectedTipoReclamoId !== "0" ? parseInt(selectedTipoReclamoId) : null;
        const barrioId = selectedBarrio !== "0" ? parseInt(selectedBarrio) : null;
        const subTipoId = selectedSubTipoReclamo !== "0" ? parseInt(selectedSubTipoReclamo) : null;
        const estadoId = selectedEstado !== "0" ? parseInt(selectedEstado) : null;
        const tecnicoId = selectedTecnico !== "0" ? Number(selectedTecnico) : null;
        const fechaReclamo = selectedFechaReclamo !== "0" ? parseInt(selectedFechaReclamo) : null;
        const fechaReparacion = selectedFechaReparacion !== "0" ? parseInt(selectedFechaReparacion) : null;

        try {
            const response = await getAllSolicitudesXTipo(
                page,
                pageSize,
                { barrioId, tipoId, subTipoId, estadoId, tecnicoId, fechaReclamo, fechaReparacion }
            );
            setSolicitudesItems(response.reclamos);
            setFilteredSolicitudes(response.reclamos);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const fetchOneSolicitud = async (query: string) => {
        setLoading(true);

        try {
            const solicitud = await findOneSolicitud(query);
            if (solicitud) {
                clearFilters();
            }
            setFilteredSolicitudes(solicitud ? [solicitud] : []);
        } catch (error) {
            setFilteredSolicitudes([]);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        (async () => {
            try {
                const response = await getAllTecnicos();
                const tecnicosFiltrados = response.map((tecnico: TecnicoResponse) => ({
                    id: tecnico.id,
                    label: `${tecnico.nombre} ${tecnico.apellido}`,
                    value: `${tecnico.nombre} ${tecnico.apellido}`
                }));
                setTecnicos(tecnicosFiltrados);
            } catch (error) {
                console.error("Error al obtener técnicos", error);
            }
        })()
    }, [])


    useEffect(() => {
        setSelectedTecnico("0")
    }, [selectedEstado])


    useEffect(() => {
        if (isSearchingRef.current) return;
        clearAndFetch()
    }, [selectedTipoReclamoId]);


    useEffect(() => {
        if (isSearchingRef.current) return;
        if (authData.rol === "admin" || authData.rol === "tecnico") {
            fetchSolicitudes();
        }
    }, [authData.rol, page]);


    const clearAndFetch = () => {
        isSearchingRef.current = false;

        setSelectedSubTipoReclamo("0");
        setSelectedBarrio("0");
        setSelectedEstado("0");
        setSelectedTecnico("0");
        setSelectedFechaReclamo("0");

        fetchSolicitudes();
    }


    const clearFilters = () => {
        setSelectedTipoReclamoId("0")
        setSelectedSubTipoReclamo("0");
        setSelectedBarrio("0");
        setSelectedEstado("0");
        setSelectedTecnico("0");
        setSelectedFechaReclamo("0");
    }


    const toggleFilters = () => {
        const willOpen = !openFiltersDialog;
        setOpenFiltersDialog(willOpen);
        setShowFilters(willOpen);

        // si estamos cerrando y hay filtros, recargá:
        if (!willOpen) {
            setPage(0);
            fetchSolicitudes();
        }
    };


    const handleSearch = async (query: string) => {
        if (query.trim() === "") {
            isSearchingRef.current = false;
            setFilteredSolicitudes(solicitudesItems);
        } else {
            isSearchingRef.current = true;

            const filtered = solicitudesItems.filter(
                (solicitud) => (solicitud.id.toString() === query || solicitud.id.toString().includes(query))
            );

            if (filtered.length > 0) {
                setFilteredSolicitudes(filtered);
            } else {
                fetchOneSolicitud(query);
            }
        }
    };


    const renderItem = ({ item }: { item: SolicitudItemListResponse }) => {
        return (
            <SolicitudCardAdmin
                id={item.id}
                nombreTipoReclamo={item.nombreTipoReclamo}
                nombreSubTipoReclamo={item.nombreSubTipoReclamo}
                nombrePoste={item.nombrePoste}
                nombreAnimal={item.nombreAnimal}
                nombreBarrio={item.nombreBarrio}
                fechaPrimerReclamo={item.fechaPrimerReclamo}
                horaPrimerReclamo={item.horaPrimerReclamo}
                fechaArreglo={item.fechaArreglo}
                horaArreglo={item.horaArreglo}
                nombreEstado={item.nombreEstado}
                tecnico1={item.nombreTecnico1 ? `${item.nombreTecnico1} ${item.apellidoTecnico1}` : undefined}
                tecnico2={item.nombreTecnico2 ? `${item.nombreTecnico2} ${item.apellidoTecnico2}` : undefined}
                nombreVecino={item.nombreVecino}
                apellidoVecino={item.apellidoVecino}
            />
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoAnimated isLoading={true} />
            ) : filteredSolicitudes?.length > 0 ? (
                <View style={styles.content}>
                    <View style={{ margin: 10 }}>
                        <SearchInput placeholder="Ingrese el nro Solicitud" onSearch={handleSearch} rol={authData.rol} />

                        <View style={styles.filterRow}>
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    value={selectedTipoReclamoId}
                                    onValueChange={(value) => setSelectedTipoReclamoId(value)}
                                    items={tiposReclamosFilters.map(option => ({
                                        label: option.label,
                                        value: String(option.id),
                                    }))}
                                    placeholder={{}}
                                    useNativeAndroidPickerStyle={false}
                                    style={pickerSelectStyles}
                                    Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc" /></View>}
                                    fixAndroidTouchableBug={true}
                                />
                            </View>
                            <View style={styles.filterButton}>
                                <Button
                                    icon={<MaterialIcons name="tune" size={24} color="white" />}
                                    onPress={toggleFilters}
                                    buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(authData.rol) }]}
                                />
                            </View>
                        </View>

                    </View>

                    <FlatList
                        data={filteredSolicitudes}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                    />

                    <View style={{ alignItems: 'center' }}>
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
                        <View style={styles.filterRow}>
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    value={selectedTipoReclamoId}
                                    onValueChange={(value) => setSelectedTipoReclamoId(value)}
                                    items={tiposReclamosFilters.map(option => ({
                                        label: option.label,
                                        value: String(option.id),
                                    }))}
                                    placeholder={{}}
                                    useNativeAndroidPickerStyle={false}
                                    style={pickerSelectStyles}
                                    Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc" /></View>}
                                    fixAndroidTouchableBug={true}
                                />
                            </View>
                            <View style={styles.filterButton}>
                                <Button
                                    icon={<MaterialIcons name="tune" size={24} color="white" />}
                                    onPress={toggleFilters}
                                    buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(authData.rol) }]}
                                />
                            </View>
                        </View>
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
                visible={openFiltersDialog}
                onDismiss={() => setOpenFiltersDialog(false)}
                filters={parseInt(selectedTipoReclamoId) === 0 ? filters.filter(f => f.label !== "Sub Tipo de Solicitud") : filters}
                onClose={toggleFilters}
                rol={authData.rol}
            />
        </SafeAreaView>
    );
};


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
    filter: {
        marginVertical: 2,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    buttonWrapper: {
        marginVertical: 2,
    },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginVertical: 8,
    },
    pickerContainer: {
        width: "80%",
        height: 50,
    },
    filterButton: {
        width: "19%",
        height: 50,
    },
    button: {
        borderRadius: 8,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
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
});