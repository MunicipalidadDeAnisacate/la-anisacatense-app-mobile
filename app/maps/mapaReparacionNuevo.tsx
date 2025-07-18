import React, { useState, useEffect, useRef } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Alert, Image, Platform } from 'react-native';
import MapView, { MapType, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@rneui/themed';
import { useAuth } from '@/context/AuthContext';
import { getUserLocation } from '@/functions/locationUtils';
import MapOverlay from '@/components/MapOverlay';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import { FAB } from '@rneui/themed/dist/FAB';
import OnlyTextFailedToast from '@/components/Toasters/OnlyTextFailedToast';
import { estaDentroDeAnisacate, obtenerIdBarrio } from '@/constants/localizar'
import NewPosteForm from '../solicitudesForms/NewPosteForm';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { createPoste, getAllPostesSinFiltro } from '@/api/petitions';
import { colorBotonCambioMapType } from '@/constants/Colors';


export default function mapaReparacionNuevo() {
    const miniFuncionalImage = require("../../assets/images/nuevasLuces/luz-buena.png");

    const [initialRegion, setInitialRegion] = useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [currentCenter, setCurrentCenter] = useState({ latitude: 0, longitude: 0 });
    const [isMapMoving, setIsMapMoving] = useState(false);
    const [mapType, setMapType] = useState<MapType>("hybrid");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const { idTipoSolicitud, titleTipoSolicitud, flagSetPoste } = useLocalSearchParams();
    const [failedToastKey, setFailedToastKey] = useState(0);
    const [postes, setPostes] = useState([]);
    const [visibleMarkers, setVisibleMarkers] = useState([]);

    const tipoSolicitud = {
        id: Number(idTipoSolicitud),
        title: titleTipoSolicitud as string,
    };

    const flagSetPosteObj = flagSetPoste ? JSON.parse(flagSetPoste.toString()) : false;

    const [userLocationReady, setUserLocationReady] = useState(false);
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
                setCurrentCenter({ latitude: userLocation.latitude, longitude: userLocation.longitude })
            } else {
                Alert.alert("Error", "no se pudo obtener ubicacion")
            }
            setUserLocationReady(true);
        };
        loadUserLocation();
    }, []);

    useEffect(() => {
        const getPostes = async () => {
            try {
                setLoading(true)
                const postesData = await getAllPostesSinFiltro();
                setPostes(postesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if (flagSetPosteObj) {
            getPostes();
        }
    }, [])


    const handleNavigateNewSolution = () => {

        if (!estaDentroDeAnisacate(currentCenter.latitude, currentCenter.longitude)) {
            setFailedToastKey((prev) => prev + 1);
            return;
        }

        const inputData = {
            idTipoSolicitud: tipoSolicitud.id,
            titleTipoSolicitud: tipoSolicitud.title,
            latitud: currentCenter.latitude,
            longitud: currentCenter.longitude,
            idBarrio: obtenerIdBarrio(currentCenter.latitude, currentCenter.longitude)
        };

        router.push({
            pathname: "/solicitudesForms/newSolutionPage",
            params: { inputData: JSON.stringify(inputData) }
        });
    };


    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
    };


    const selectMapType = (type: MapType) => {
        setMapType(type);
        setIsOverlayVisible(false);
    };


    const handleRegionChangeComplete = (region: Region) => {
        setIsMapMoving(false);
        if (flagSetPosteObj) {
            const filteredPostes = postes.filter(poste =>
                poste.latitude >= region.latitude - region.latitudeDelta &&
                poste.latitude <= region.latitude + region.latitudeDelta &&
                poste.longitude >= region.longitude - region.longitudeDelta &&
                poste.longitude <= region.longitude + region.longitudeDelta
            );
            setVisibleMarkers(filteredPostes);
        }
        setCurrentCenter({ latitude: region.latitude, longitude: region.longitude });
    };


    const [openNewPosteForm, setOpenNewPosteForm] = useState<boolean>(false);
    const [nombrePoste, setNombrePoste] = useState<string>("");
    const [nuevoPosteData, setNuevoPosteData] = useState({ latitud: 0, longitud: 0, nombrePoste: "", idBarrio: 0 })
    const handleNewPoste = (nombrePoste: string) => {
        setNombrePoste(nombrePoste);

        setOpenNewPosteForm(false);

        setNuevoPosteData({
            latitud: currentCenter.latitude,
            longitud: currentCenter.longitude,
            nombrePoste: nombrePoste,
            idBarrio: obtenerIdBarrio(currentCenter.latitude, currentCenter.longitude)
        })

        setOpenConfirmationDialog(true);
    }

    const closeNewPosteForm = () => {
        setOpenNewPosteForm(false);
    }

    const [loading, setLoading] = useState<boolean>(false);

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);
    const saveNewPoste = async () => {
        setOpenConfirmationDialog(false)
        setLoading(true);

        try {
            const success = await createPoste(nuevoPosteData);
            if (success) {
                router.push({
                    pathname: "/menuTecnico/menuPrincipalTecnico",
                    params: { openSuccesToast: JSON.stringify(true) }
                })

            } else {
                router.push({
                    pathname: "/menuTecnico/menuPrincipalTecnico",
                    params: { openFailedToast: JSON.stringify(true) }
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    // Se utiliza para centrar bien el mapa
    const mapRef = useRef<MapView | null>(null);
    useEffect(() => {
        if (mapRef.current && userLocationReady) {
            mapRef.current.animateToRegion(initialRegion, 1000);
        }
    }, [initialRegion, userLocationReady]);


    const handleSubmit = () => {

        if (flagSetPoste) {
            setOpenNewPosteForm(true);
            return;
        }

        handleNavigateNewSolution();
    }

    if (!userLocationReady) return <LoadingLogoAnimatedTransparent isLoading={true} />;

    if (loading) return <LoadingLogoAnimatedTransparent isLoading={true} />;

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                region={initialRegion}
                onRegionChange={() => setIsMapMoving(true)}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                showsMyLocationButton={false}
                minZoomLevel={flagSetPosteObj ? 18 : 12}
                mapType={mapType}
            >

                {visibleMarkers.map(poste => (
                    <Marker
                        tracksViewChanges={false}
                        key={poste.id}
                        coordinate={{ latitude: poste.latitude, longitude: poste.longitude }}
                        image={miniFuncionalImage}
                    />
                ))}

            </MapView>


            <View style={styles.markerFixed}>
                {flagSetPoste ? (
                    <Image source={require("../../assets/images/punto-de-mira.png")} style={styles.markerImage} />
                ) : (
                    <Image source={require("../../assets/images/marker.png")} style={styles.markerImage} />
                )}
            </View>

            <View style={[styles.headerTextView, {left: 5, right: 5}]}>
                {flagSetPosteObj ?
                    (<Text style={styles.headerText}>Seleccione ubicación para cargar el poste (HAGA EL MAXIMO ZOOM POSIBLE)</Text>) :
                    (<Text style={styles.headerText}>Seleccione ubicación del reparacion</Text>)
                }
            </View>

            <View style={[styles.fabView, {top: flagSetPoste ? 95 : 65}]}>
                <FAB
                    icon={<Image source={require("../../assets/images/layersIcon.png")} style={styles.icon} />}
                    onPress={() => setIsOverlayVisible(!isOverlayVisible)}
                    color={colorBotonCambioMapType}
                    size='large'
                />
            </View>

            <View style={[styles.buttonBox, { bottom: Platform.OS === "ios" ? 60 : 25 }]}>
                <Button
                    title="Seleccionar ubicación"
                    onPress={handleSubmit}
                    buttonStyle={{ backgroundColor: isMapMoving ? '#cccccc' : '#61B353' }}
                    containerStyle={isMapMoving ? styles.buttonContainerDisabled : styles.buttonContainer}
                    disabled={isMapMoving}
                />
            </View>

            <NewPosteForm
                isVisible={openNewPosteForm}
                onCancel={closeNewPosteForm}
                toggleOverlay={closeNewPosteForm}
                selectNombrePoste={handleNewPoste}
            />

            <MapOverlay
                isVisible={isOverlayVisible}
                toggleOverlay={toggleOverlay}
                mapType={mapType}
                selectMapType={selectMapType}
            />

            <ConfirmationDialog
                visible={openConfirmationDialog}
                title={"Cargar Poste Nuevo"}
                description={`Desea cargar los datos sobre el nuevo poste? Poste: ${nombrePoste}`}
                confirmText={"Cargar Poste"}
                onConfirm={saveNewPoste}
                onCancel={() => setOpenConfirmationDialog(false)}
            />

            {failedToastKey > 0 &&
                < OnlyTextFailedToast
                    key={failedToastKey}
                    visible={true}
                    message='La ubicación seleccionada está fuera de Anisacate.'
                />
            }


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    markerFixed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -40 }],
    },
    markerImage: { 
        width: 50, 
        height: 50, 
        resizeMode: 'contain' 
    },
    headerTextView: {
        position: 'absolute',
        top: 5,
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 10,
    },
    headerText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center"
    },
    buttonBox: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
    },
    buttonContainer: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#61B353',
        elevation: 3,
    },
    buttonContainerDisabled: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#E3E6E8',
    },
    buttonTypeContainer: {
        width: 55,
        height: 50,
        borderRadius: 10,
        padding: 5,
    },
    fabView: {
        position: 'absolute',
        right: 10
    },
    icon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
});
