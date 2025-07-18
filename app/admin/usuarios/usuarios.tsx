import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { deleteUsuario, findOneUsuario, getAllUsuariosByRol } from "@/api/petitions";
import LoadingLogoPulse from "@/components/LoadingLogoAnimated";
import Pagination from "@/components/Pagination";
import UsuarioCard from "@/components/UsuarioCard";
import SearchInput from "@/components/SearchInput";
import { Button } from "@rneui/themed";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SuccessToast from "@/components/Toasters/SuccesToast";
import FailedToast from "@/components/Toasters/FailedToast";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import FiltersDialog from "@/components/FiltersDialog";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { barriosFilters } from "@/constants/filtros";


type Usuario = {
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    nombreTipoUsuario: string;
    nombreCuadrilla?: string;
    mail?: string;
    telefono?: string;
    fechaNacimiento: Date;
    nombreBarrio?: string;
    nombreCalle?: string;
    numeroCalle?: string;
    manzana?: string;
    lote?: string;
};


export default function Usuarios() {
    const { authData } = useAuth();

    const { tipoUsuarioId } = useLocalSearchParams();
    const tipoUsuarioIdObj = tipoUsuarioId ? JSON.parse(tipoUsuarioId as string) : null;

    const [loading, setLoading] = useState<boolean>(false);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [openEstadisticasDialog, setOpenEstadisticasDialog] = useState<boolean>(false);
    const [selectedBarrio, setSelectedBarrio] = useState<string>("Todos");
    const [selectedTipoUsuario, setSelectedTipoUsuario] = useState<string>("Todos");

    const [openConfirmationDeleteDialog, setOpenConfirmationDeleteDialog] = useState<boolean>(false);

    const [showFilters, setShowFilters] = useState<boolean>(false);

    const pageSize = 50;



    const filters = [
        {
            label: "Barrio",
            selectedValue: selectedBarrio,
            options: [
                { label: "Todos los barrios", value: "Todos" },
                ...barriosFilters
            ],
            onValueChange: (value: string) => setSelectedBarrio(value),
        }
    ];


    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                const response = await getAllUsuariosByRol(tipoUsuarioIdObj, page, pageSize);
                setUsuarios(response.usuarios);
                setFilteredUsuarios(response.usuarios);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };


        if (authData.rol === "admin") {
            fetchUsuarios();
        }
    }, [authData.rol, page]);


    const handleSearch = async (query: string) => {
        if (query.trim() === "") {
            setFilteredUsuarios(usuarios); // Restablece la lista filtrada
        } else {
            const filtered = usuarios.filter(
                (usuario) => usuario.dni && usuario.dni.includes(query)
            );

            if (filtered.length > 0) {
                setFilteredUsuarios(filtered);
            } else {
                setLoading(true);
                try {
                    const usuario = await findOneUsuario(query);
                    if (usuario) {
                        setFilteredUsuarios([usuario]);
                    } else {
                        setFilteredUsuarios([]);
                    }
                } catch (error) {
                    console.error("Error buscando el usuario en el backend", error);
                    setFilteredUsuarios([]);
                } finally {
                    setLoading(false);
                }
            }
        }
    };


    const toggleFilters = () => {
        setOpenEstadisticasDialog(!openEstadisticasDialog);
        setShowFilters(!showFilters);
    }


    const applyFilters = (list: Usuario[]) => {
        let filtered = list;

        if (selectedBarrio !== "Todos") {
            filtered = filtered.filter((usuario) => usuario.nombreBarrio === selectedBarrio);
        }

        setFilteredUsuarios(filtered);
    };


    useEffect(() => {
        applyFilters(usuarios); // Aplica filtros cada vez que cambien
    }, [selectedBarrio, selectedTipoUsuario]);


    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
    const [openSuccessToast, setOpenSuccessToast] = useState<boolean>(false);
    const [openFailedToast, setOpenFailedToast] = useState<boolean>(false);


    const handleDelete = async () => {
        if (!usuarioSeleccionado) return;
        setLoading(true);
        try {

            let success;
            if (usuarioSeleccionado.dni) {
                success = await deleteUsuario(authData.id, usuarioSeleccionado.id);
            } else {
                success = false;
            }

            if (success) {
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.filter((usuario) => usuario.dni !== usuarioSeleccionado.dni)
                );
                setFilteredUsuarios((prevFiltered) =>
                    prevFiltered.filter((usuario) => usuario.dni !== usuarioSeleccionado.dni)
                );
                setOpenSuccessToast(true);
            } else {
                setOpenFailedToast(true);
            }

        } catch (error) {
            console.error("Error eliminando el usuario", error);

        } finally {
            setLoading(false);
            setOpenConfirmationDeleteDialog(false);
            setUsuarioSeleccionado(null);
        }
    };


    const openDeleteDialog = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setOpenConfirmationDeleteDialog(true);
    };


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoadingLogoPulse isLoading={true} />
            ) : filteredUsuarios?.length > 0 ? (
                <View style={styles.content}>
                    <View style={{ margin: 10 }}>
                        <SearchInput placeholder="Ingrese un DNI" onSearch={handleSearch} rol={authData.rol} />
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
                        data={filteredUsuarios}
                        renderItem={({ item }) => <UsuarioCard usuario={item}
                            tipoUsuarioId={tipoUsuarioIdObj}
                            onDelete={() => openDeleteDialog(item)} />}
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
                        <SearchInput placeholder="Ingrese un DNI" onSearch={handleSearch} rol={authData.rol}/>
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

                        {tipoUsuarioIdObj === 1 &&
                            <Text style={styles.noUsuarios}>No se encontraron Vecinos</Text>
                        }

                        {tipoUsuarioIdObj === 2 &&
                            <Text style={styles.noUsuarios}>No se encontraron Técnicos</Text>
                        }

                        {tipoUsuarioIdObj === 3 &&
                            <Text style={styles.noUsuarios}>No se encontraron Administradores</Text>
                        }

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

            <ConfirmationDialog
                visible={openConfirmationDeleteDialog}
                title={`Desea eliminar al usuario ${usuarioSeleccionado?.nombre} ${usuarioSeleccionado?.apellido}?`}
                onCancel={() => {
                    setOpenConfirmationDeleteDialog(false);
                    setUsuarioSeleccionado(null);
                }}
                onConfirm={handleDelete}
            />

            <SuccessToast
                visible={openSuccessToast}
                message={"Usuario eliminado exitosamente!"}
                onHide={() => setOpenSuccessToast(false)}
            />

            <FailedToast
                visible={openFailedToast}
                message={"No se pudo eliminar usuario."}
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
    picker: {
        flex: 1,
        height: 50,
        marginHorizontal: 5,
    },
    listContainer: {
        paddingBottom: 80,
    },
    noUsuarios: {
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
    filterButton: {
        fontSize: 16,
        color: "#007BFF",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});