import React, { useMemo } from "react";
import { StyleSheet, FlatList, View, Platform, Dimensions } from "react-native";
import { Portal, Dialog, Text, IconButton } from "react-native-paper";
import ReclamoCardTecnico from "./ReclamoCardTecnico";

type VecinoResponse = {
    dni: string;
    nombre: string;
    apellido: string;
    mail: string;
    telefono: string;
    nombreCalle?: string;
    numeroCalle?: string;
    manzana?: string;
    lote?: string;
    fechaReclamo: any;
    horaReclamo: any;
};

type SolicitudesVariasResponse = {
    id: number;
    nombreSubTipoReclamo: string;
    nroSubTipoReclamo: number;
    nombreTipoReclamo: string;
    latitudReclamo: number;
    longitudReclamo: number;
    nombreEstado: string;
    vecinoDtoList: VecinoResponse[];
};

type SolicitudesLuminariaProps = {
    solicitudes: SolicitudesVariasResponse[];
    onVerEnMapa: (lat: number, lng: number, id: number) => void;
    isOpen: boolean;
    closeBottomSheet: () => void;
};

const { height: screenHeight } = Dimensions.get("window");

const ListadoSolicitudesVarias: React.FC<SolicitudesLuminariaProps> = ({
    solicitudes,
    onVerEnMapa,
    isOpen,
    closeBottomSheet,
}) => {

    const sortedSolicitudes = useMemo(() => {
        return solicitudes.slice().sort((a, b) => a.id - b.id);
    }, [solicitudes]);

    return (
        <Portal>
            <Dialog
                visible={isOpen}
                onDismiss={closeBottomSheet}
                style={styles.dialog}
            >

                <View style={styles.headerContainer}>
                    <View style={styles.side} />
                    <Text style={styles.headerTitle}>Solicitudes Actuales</Text>
                    <View style={styles.side}>
                        <IconButton
                            icon="close"
                            iconColor="#fff"
                            size={24}
                            onPress={closeBottomSheet}
                            style={styles.iconButton}
                        />
                    </View>
                </View>

                <Dialog.Content style={styles.content}>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={sortedSolicitudes}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <ReclamoCardTecnico
                                    solicitud={item}
                                    onVerEnMapa={onVerEnMapa}
                                    closeBottomSheet={closeBottomSheet}
                                />
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    No hay solicitudes disponibles.
                                </Text>
                            }
                            style={styles.flatList}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: "#F8FAFC",
        borderRadius: 10,
        maxHeight: "90%",
        // position: "relative",
    },
    headerContainer: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 0,
        paddingVertical: 5,
    },
    side: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: {
        flex: 2,
        fontSize: 20,
        fontWeight: "700",
        textAlign: "left",
        color: "#334155",
    },
    iconButton: {
        backgroundColor: "red",
    },
    content: {
        paddingBottom: 0,
        paddingHorizontal: 0,
        height: Platform.select({
            ios: screenHeight * 0.70,  // iOS un poco menos
            android: screenHeight * 0.75,
        }),
    },
    listContainer: {
        flex: 1,
    },
    flatList: {
        flexGrow: 1
    },
    flatListContent: {
        paddingBottom: 5,
        paddingHorizontal: 10,
    },
    emptyText: {
        textAlign: "center",
        color: "#94A3B8",
        paddingVertical: 20,
    },
});

export default ListadoSolicitudesVarias;
