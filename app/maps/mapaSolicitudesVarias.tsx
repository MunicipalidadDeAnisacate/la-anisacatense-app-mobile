import React, { useState, useEffect, useRef } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Alert, Image, Platform } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import { getUserLocation } from '@/functions/locationUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@rneui/themed';
import { useAuth } from '@/context/AuthContext';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import MapOverlay from '@/components/MapOverlay';
import { FAB } from '@rneui/themed/dist/FAB';
import OnlyTextFailedToast from '@/components/Toasters/OnlyTextFailedToast';
import { estaDentroDeAnisacate, obtenerIdBarrio } from '@/constants/localizar';
import { colorBotonCambioMapType } from '@/constants/Colors';
import { SubTipoSolicitud } from '@/constants/tiposYSubTiposConst/SubTiposDeSolicitudes';


export default function MapaSolicitudesVarias() {
    const { authData } = useAuth();

    const [currentCenter, setCurrentCenter] = useState({ latitude: 0, longitude: 0 });
    const [mapType, setMapType] = useState<MapType>("hybrid");
    const [isMapMoving, setIsMapMoving] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [failedToastKey, setFailedToastKey] = useState(0);

    const { subTipo } = useLocalSearchParams();
    const subTipoObj: SubTipoSolicitud = subTipo ? JSON.parse(subTipo as string) : null;

    const [disabledButton, setDisabledButton] = useState<boolean>(false);

    const [initialRegion, setInitialRegion] = useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    });

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
            } else {
                setDisabledButton(true);
                Alert.alert("Error", "no se pudo obtener ubicacion")
            }
            setUserLocationReady(true);
        };
        loadUserLocation();
    }, []);


    const handleRegionChange = (region: Region) => {
        setIsMapMoving(true);
        setCurrentCenter({ latitude: region.latitude, longitude: region.longitude });
    };


    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
    };


    const selectMapType = (type: MapType) => {
        setMapType(type);
        setIsOverlayVisible(false);
    };


    const handleNavigate = () => {

        if (!estaDentroDeAnisacate(currentCenter.latitude, currentCenter.longitude)) {
            setFailedToastKey((prev) => prev + 1);
            return;
        }

        const inputData = {
            idVecino: authData.id,
            idSubTipoReclamo: subTipoObj.id,
            latitud: currentCenter.latitude,
            longitud: currentCenter.longitude,
            idBarrio: obtenerIdBarrio(currentCenter.latitude, currentCenter.longitude)
        }

        router.push({
            pathname: "/solicitudesForms/solicitudForm",
            params: { inputData: JSON.stringify(inputData) }
        })
    }


    // Se utiliza para centrar bien el mapa
    const mapRef = useRef<MapView | null>(null);
    useEffect(() => {
        if (mapRef.current && userLocationReady) {
            mapRef.current.animateToRegion(initialRegion, 1000);
        }
    }, [initialRegion, userLocationReady]);


    if (!userLocationReady) return <LoadingLogoAnimatedTransparent isLoading={true} />;

    return (
        <SafeAreaView style={styles.container}>

            <MapView
                ref={mapRef} // importante para el centrado del mapa
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                region={initialRegion}
                onRegionChangeComplete={() => setIsMapMoving(false)}
                onRegionChange={handleRegionChange}
                showsUserLocation={true}
                showsMyLocationButton={false}
                minZoomLevel={18}
                mapType={mapType}
            >
            </MapView>

            <View style={styles.markerFixed}>
                <Image source={require("../../assets/images/marker.png")} style={styles.markerImage} />
            </View>

            <View style={styles.headerTextView}>
                <Text style={styles.headerText}>Seleccione ubicación de la solicitud</Text>
            </View>

            <View style={styles.fabView}>
                <FAB
                    icon={<Image source={require("../../assets/images/layersIcon.png")} style={styles.icon} />}
                    onPress={() => setIsOverlayVisible(!isOverlayVisible)}
                    color={colorBotonCambioMapType}
                    size="large"
                />
            </View>


            {/* Botón flotante */}
            <View style={[styles.buttonBox, { bottom: Platform.OS === "ios" ? 60 : 25 }]}>
                <Button
                    title={'Seleccionar ubicación'}
                    onPress={handleNavigate}
                    buttonStyle={{ backgroundColor: isMapMoving ? '#cccccc' : '#61B353' }}
                    containerStyle={isMapMoving ? styles.buttonContainerDisabled : styles.buttonContainer}
                    disabled={isMapMoving || disabledButton}
                />
            </View>

            <MapOverlay
                isVisible={isOverlayVisible}
                toggleOverlay={toggleOverlay}
                mapType={mapType}
                selectMapType={selectMapType}
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
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    markerFixed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -40 }],
    },
    markerImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    fabView: {
        position: 'absolute',
        top: 65,
        right: 10
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
        fontWeight: 'bold'
    },
    buttonBox: {
        position: 'absolute',
        left: 20,
        right: 20,
    },
    buttonContainer: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#61B353',
        elevation: 3,
        marginBottom: 10
    },
    buttonContainerList: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#1E73BE',
        elevation: 3,
        marginBottom: 10
    },
    buttonContainerDisabled: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#E3E6E8',
        marginBottom: 10
    },
    buttonTypeContainer: {
        width: 55,
        height: 50,
        borderRadius: 10,
        padding: 5,
    },
    icon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
});
