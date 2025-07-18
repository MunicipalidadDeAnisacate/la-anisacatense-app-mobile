import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import { findOneReparacion, getAllReparaciones, getAllReparacionesXTipo, getAllTecnicos, TecnicoResponse } from "@/api/petitions";
import LoadingLogoAnimated from "@/components/LoadingLogoAnimated";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { Button } from "@rneui/themed";
import ReparacionCardAdmin from "@/components/ReparacionCardAdmin";
import FiltersDialog from "@/components/FiltersDialog";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { barriosFilters, tiposReclamosFilters } from "@/constants/filtros";
import RNPickerSelect from 'react-native-picker-select';
import { pickerSelectStyles } from "@/styles/pickerStyles";


// Cambiar tipo
type Reparacion = {
    id: number;
    nombrePoste?: string;
    nombreAnimal?: string;
    nombreTipoReclamo: string;
    fechaArreglo: string;
    horaArreglo: string;
    nombreTecnico1: string;
    apellidoTecnico1: string;
    nombreTecnico2: string;
    apellidoTecnico2: string;
    latitud?: string;
    longitud?: string;
    nombreBarrio?: string;
};


export default function Reparaciones() {
    const { authData } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const [reparacionesItems, setReparacionesItems] = useState<Reparacion[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filteredReparaciones, setFilteredReparaciones] = useState<Reparacion[]>([]);
    const pageSize = 20;

    const [openFiltersDialog, setOpenFiltersDialog] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const isSearchingRef = useRef(false);

    const [selectedBarrio, setSelectedBarrio] = useState<string>("0");
    const [selectedTipoReclamoId, setSelectedTipoReclamoId] = useState<string>(String(tiposReclamosFilters[0].id));
    const [selectedTecnico, setSelectedTecnico] = useState<string>("0");
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
        {
            label: "Técnico",
            selectedValue: selectedTecnico,
            options: [
                { label: "Todos los técnicos", value: "0" },
                ...tecnicos.map(t => ({
                    label: t.label,
                    value: String(t.id)
                }))
            ],
            onValueChange: (value: string) => setSelectedTecnico(value),
        },
        {
            label: "Por fecha",
            selectedValue: selectedFechaReparacion,
            options: [
                { label: "Todos", value: "0" },
                { label: "Hoy", value: "1" },
                { label: "Ultima semana", value: "7" },
                { label: "Ultimos 30 días", value: "30" },
                { label: "Ultimos 60 días", value: "60" }
            ],
            onValueChange: setSelectedFechaReparacion,
        }
    ];


    const fetchReparaciones = async () => {
        setLoading(true);

        const tipoId = selectedTipoReclamoId !== "0" ? parseInt(selectedTipoReclamoId) : null;
        const barrioId = selectedBarrio !== "0" ? parseInt(selectedBarrio) : null;
        const tecnicoId = selectedTecnico !== "0" ? parseInt(selectedTecnico) : null;
        const fechaDesde = selectedFechaReparacion !== "0" ? parseInt(selectedFechaReparacion) : null;

        try {
            let response;

            response = await getAllReparacionesXTipo(
                page,
                pageSize,
                { barrioId, tipoId, tecnicoId, fechaDesde }
            );

            setReparacionesItems(response.reparaciones);
            setFilteredReparaciones(response.reparaciones);
            setTotalPages(response.totalPages);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const fetchOneReparacion = async (query: string) => {
        setLoading(true);
        try {
            const reparacion = await findOneReparacion(query);
            if (reparacion) {
                clearFilters();
                setFilteredReparaciones([reparacion]);
            } else {
                setFilteredReparaciones([]);
            }
        } catch (error) {
            setFilteredReparaciones([]);
        } finally {
            setLoading(false);
        }
    }

    // fetch inicial de tecnicos
    useEffect(() => {
        (async () => {
            try {
                const response = await getAllTecnicos();
                const tecnicosFiltrados = response
                    .map((tecnico: TecnicoResponse) => ({
                        id: tecnico.id,
                        label: `${tecnico.nombre} ${tecnico.apellido}`,
                        value: `${tecnico.nombre} ${tecnico.apellido}`
                    }));
                setTecnicos(tecnicosFiltrados);
            } catch (error) {
                console.error("Error al obtener técnicos", error);
            }
        })()
    }, []);


    useEffect(() => {
        if (isSearchingRef.current) return;
        clearAndFetch()
    }, [selectedTipoReclamoId]);


    useEffect(() => {
        if (isSearchingRef.current) return;
        if (authData.rol === "admin" || authData.rol === "tecnico") {
            fetchReparaciones();
        }
    }, [authData.rol, page]);


    const clearAndFetch = () => {
        isSearchingRef.current = false;

        setSelectedBarrio("0");
        setSelectedTecnico("0");

        fetchReparaciones();
    }


    const clearFilters = () => {
        setSelectedTipoReclamoId("0")
        setSelectedBarrio("0");
        setSelectedTecnico("0");
    }


    const toggleFilters = () => {
        const willOpen = !openFiltersDialog;
        setOpenFiltersDialog(willOpen);
        setShowFilters(willOpen);

        // si estamos cerrando y hay filtros, recargá:
        if (!willOpen) {
            setPage(0);
            fetchReparaciones();
        }
    };


    const handleSearch = async (query: string) => {
        if (query.trim() === "") {
            isSearchingRef.current = false;
            setFilteredReparaciones(reparacionesItems); // Restablece la lista filtrada
        } else {
            isSearchingRef.current = true;
            // Busca en la lista actual
            const filtered = reparacionesItems.filter(
                (reparacion) => reparacion.id.toString() === query || reparacion.id.toString().includes(query)
            );

            if (filtered.length > 0) {
                setFilteredReparaciones(filtered);
            } else {
                // Si no está en la página actual, busca en el backend
                fetchOneReparacion(query);
            }
        }
    };


    const renderItem = ({ item }: { item: Reparacion }) => (
        <ReparacionCardAdmin
            id={item.id}
            nombreTipoReclamo={item.nombreTipoReclamo}
            nombrePoste={item.nombrePoste}
            nombreAnimal={item.nombreAnimal}
            nombreBarrio={item.nombreBarrio}
            fechaReparacion={item.fechaArreglo}
            horaReparacion={item.horaArreglo}
            tecnico1={`${item.nombreTecnico1} ${item.apellidoTecnico1}`}
            tecnico2={item.nombreTecnico2 ? `${item.nombreTecnico2} ${item.apellidoTecnico2}` : undefined}
        />
    );


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoAnimated isLoading={true} />
            ) : filteredReparaciones?.length > 0 ? (
                <View style={styles.content}>
                    <View style={{ margin: 10 }}>
                        <SearchInput placeholder="Ingrese el nro Reparacion" onSearch={handleSearch} rol={authData.rol} />
                        {authData.rol == "admin" && (
                            <View style={styles.filterRow}>
                                <View style={styles.pickerContainer}>
                                    <RNPickerSelect
                                        value={selectedTipoReclamoId}
                                        onValueChange={(value) => setSelectedTipoReclamoId(value)}
                                        items={tiposReclamosFilters.map(option => ({
                                            label: option.label,
                                            value: String(option.id),
                                        }))}
                                        placeholder={{}}  // Deshabilita el placeholder por defecto si lo deseas
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

                        )}
                    </View>

                    <FlatList
                        data={filteredReparaciones}
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
                        <SearchInput placeholder="Ingrese el nro Reparacion" onSearch={handleSearch} rol={authData.rol} />
                        {authData.rol == "admin" && (
                            <View style={styles.filterRow}>
                                <View style={styles.pickerContainer}>
                                    <RNPickerSelect
                                        value={selectedTipoReclamoId}
                                        onValueChange={(value) => setSelectedTipoReclamoId(value)}
                                        items={tiposReclamosFilters.map(option => ({
                                            label: option.label,
                                            value: String(option.id),
                                        }))}
                                        placeholder={{}}  // Deshabilita el placeholder por defecto si lo deseas
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
                        )}
                    </View>

                    <View style={styles.emptyContainer}>

                        <MaterialIcons name="info-outline" size={64} color={getColorByAuthDataRol(authData.rol)} />

                        <Text style={styles.noReparacionesText}>Aún no hay Reparaciones</Text>

                        <Text style={styles.noReparacionesSubtitle}>
                            Cuando se realicen reparaciones, aparecerán aquí.
                        </Text>

                    </View>

                </View>
            )}

            <FiltersDialog
                visible={openFiltersDialog}
                onDismiss={() => setOpenFiltersDialog(false)}
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
    listContainer: {
        paddingBottom: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    noReparacionesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
    noReparacionesSubtitle: {
        marginTop: 5,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    buttonWrapper: {
        marginVertical: 2,
    },
    button: {
        borderRadius: 8,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});