import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, Image, Platform } from 'react-native';
import MapView, { MapType, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Button } from '@rneui/themed';
import { useAuth } from '@/context/AuthContext';
import { getSolicitudes, SolicitudesVariasResponse } from '@/api/petitions';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import MapOverlay from '@/components/MapOverlay';
import { router, useLocalSearchParams } from "expo-router";
import { getUserLocation } from '@/functions/locationUtils';
import ListadoSolicitudesVarias from '@/components/ListadoSolicitudesVarias';
import { FAB } from '@rneui/themed/dist/FAB';
import { colorBotonCambioMapType } from '@/constants/Colors';

const MapaSolicitudesVariasTecnico = () => {
    const { authData } = useAuth();

    const { subTipo } = useLocalSearchParams();
    const subTipoObj = subTipo ? JSON.parse(subTipo as string) : null

    const [initialRegion, setInitialRegion] = useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [userLocationReady, setUserLocationReady] = useState(false);
    const [solicitudes, setSolicitudes] = useState<SolicitudesVariasResponse[]>([]);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudesVariasResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapType, setMapType] = useState<MapType>("hybrid");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);


    useEffect(() => {
        const loadUserLocation = async () => {
            const userLocation = await getUserLocation();
            if (userLocation) {
                setInitialRegion({
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                });
            } else {
                Alert.alert("Error", "no se pudo obtener ubicacion")
            }
            setUserLocationReady(true);
        };
        loadUserLocation();
    }, []);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const solicitudesData = await getSolicitudes(subTipoObj.id);
                setSolicitudes(solicitudesData);
            } catch (error) {
                console.error("Error al traer solicitudes:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userLocationReady) fetchSolicitudes();
    }, [userLocationReady]);


    const handleNavigateToRepairForm = () => {
        const inputData = {
            idTecnico: authData.id,
            idSubTipoReclamo: subTipoObj.id,
            titleTipoSolicitud: subTipoObj.title,
            solicitud: solicitudSeleccionada,
        };
        router.push({
            pathname: "/solicitudesForms/newSolutionPage",
            params: { inputData: JSON.stringify(inputData) }
        });
    };


    // Cambiar el tipo de mapa
    const toggleOverlay = () => setIsOverlayVisible(!isOverlayVisible);
    const selectMapType = (type: MapType) => {
        setMapType(type);
        setIsOverlayVisible(false);
    };

    // Se utiliza para centrar bien el mapa
    const mapRef = useRef<MapView | null>(null);
    useEffect(() => {
        if (mapRef.current && userLocationReady) {
            mapRef.current.animateToRegion(initialRegion, 1000);
        }
    }, [initialRegion, userLocationReady]);


    const [openListadoSolicitudes, setOpenListadoSolicitudes] = useState<boolean>(false);
    const centrarEnSolicitud = (latitud: number, longitud: number) => {
        setOpenListadoSolicitudes(false)
        mapRef.current?.animateToRegion(
            {
                latitude: latitud,
                longitude: longitud,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            },
            900
        );
        setSolicitudSeleccionada(null)
    };


    if (loading || !userLocationReady) return <LoadingLogoAnimatedTransparent isLoading={true} />;


    return (
        <SafeAreaView style={styles.container}>

            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                region={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={false}
                minZoomLevel={12}
                mapType={mapType}
                onPress={() => setSolicitudSeleccionada(null)}
                toolbarEnabled={false}
                moveOnMarkerPress={false}
            >
                {solicitudes.map(solicitud => (
                    <Marker
                        key={solicitud.id}
                        coordinate={{ latitude: solicitud.latitudReclamo, longitude: solicitud.longitudReclamo }}
                        title={`Solicitud ${solicitud.id}`}
                        onPress={(e) => {
                            e.stopPropagation();
                            setSolicitudSeleccionada(solicitud);
                        }}
                        image={subTipoObj.imageMini}

                    />
                ))}
            </MapView>

            <View style={styles.fabView}>
                <FAB
                    icon={<Image source={require("../../assets/images/layersIcon.png")} style={styles.icon} />}
                    onPress={() => setIsOverlayVisible(!isOverlayVisible)}
                    color={colorBotonCambioMapType}
                    size='large'
                />
            </View>

            <View style={[styles.buttonBox, { bottom: Platform.OS === "ios" ? 60 : 25 }]}>
                <View>
                    <Button
                        title={(solicitudes.length > 0) ? 'Ver listado' : `No hay solicitudes de ${subTipoObj.title}`}
                        onPress={() => setOpenListadoSolicitudes(true)}
                        buttonStyle={{ backgroundColor: !(solicitudes.length > 0) ? '#cccccc' : '#1E73BE' }}
                        containerStyle={!(solicitudes.length > 0) ? styles.buttonContainerDisabled : styles.buttonContainerList}
                        disabled={!(solicitudes.length > 0)}
                    />

                    <Button
                        title="Arreglar"
                        onPress={handleNavigateToRepairForm}
                        buttonStyle={{ backgroundColor: !solicitudSeleccionada ? '#cccccc' : '#61B353' }}
                        containerStyle={!solicitudSeleccionada ? styles.buttonContainerDisabled : styles.buttonContainer}
                        disabled={!solicitudSeleccionada}
                    />
                </View>
            </View>

            <ListadoSolicitudesVarias
                solicitudes={solicitudes}
                onVerEnMapa={centrarEnSolicitud}
                isOpen={openListadoSolicitudes}
                closeBottomSheet={() => setOpenListadoSolicitudes(false)}
            />

            <MapOverlay
                isVisible={isOverlayVisible}
                toggleOverlay={toggleOverlay}
                mapType={mapType}
                selectMapType={selectMapType}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    buttonBox: {
        position: 'absolute',
        left: 20,
        right: 20
    },
    buttonTypeContainer: {
        width: 55,
        height: 50,
        borderRadius: 10,
        padding: 5,
    },
    buttonContainer: {
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#61B353',
        elevation: 3,
        marginBottom: 10
    },
    buttonContainerDisabled: {
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#E3E6E8',
        marginBottom: 10
    },
    buttonContainerList: {
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#1E73BE',
        elevation: 3,
        marginBottom: 10
    },
    fabView: {
        position: 'absolute',
        top: 65,
        right: 10
    },
    icon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
});

export default MapaSolicitudesVariasTecnico;
