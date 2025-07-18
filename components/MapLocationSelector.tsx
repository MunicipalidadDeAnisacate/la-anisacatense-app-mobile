import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { Button, FAB } from "@rneui/themed";
import MapView, { Region, Marker, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import MapOverlay from "@/components/MapOverlay";
import { getUserLocation } from "@/functions/locationUtils";
import OnlyTextFailedToast from "./Toasters/OnlyTextFailedToast";
import { estaDentroDeAnisacate } from "@/constants/localizar";

const windowWidth = Dimensions.get('window').width;
const MAP_HEIGHT = 360;

const PIN_SIZE = 45;

interface Props {
    onLocationSelect: (loc: { latitude: number; longitude: number } | null) => void;
    initialCoordinates?: { latitude: number; longitude: number };
    buttonText?: string;
    unselectButtonText?: string;
    principalColor?: string;
    secondaryColor?: string;
    markerImage?: any;
    showInstructions?: boolean;
    instructionsText?: string;
    mapHeight?: number;
    mapWidth?: number;
    setLocationLoaded?: () => void;
    ubicacionSoloEnAnisacate?: boolean;
}

export default function MapLocationSelector({
    onLocationSelect,
    initialCoordinates,
    buttonText = "Marcar ubicación",
    unselectButtonText = "Desmarcar ubicación",
    principalColor = "#61B353",
    secondaryColor = "#1E73BE",
    markerImage = require("../assets/images/markerMini.png"),
    showInstructions = true,
    instructionsText = "Arrastre el mapa para centrar su domicilio y luego presione el botón para seleccionar.",
    mapHeight = 360,
    mapWidth = windowWidth - 40,
    setLocationLoaded,
    ubicacionSoloEnAnisacate = false
}: Props) {

    // Estado de región y centro
    const [region, setRegion] = useState<Region>({
        latitude: initialCoordinates?.latitude ?? -31.712395,
        longitude: initialCoordinates?.longitude ?? -64.403717,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const [currentCenter, setCurrentCenter] = useState({
        latitude: region.latitude,
        longitude: region.longitude,
    });

    const [fijarMarker, setFijarMarker] = useState<{ latitude: number, longitude: number } | null>(
        initialCoordinates
            ? { latitude: initialCoordinates.latitude, longitude: initialCoordinates.longitude }
            : null
    );

    const [mapType, setMapType] = useState<MapType>("standard");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [failedToastKey, setFailedToastKey] = useState(0);


    // Obtener ubicación si no hay inicial
    useEffect(() => {
        (async () => {
            if (!initialCoordinates) {
                // si NO hay coords iniciales, pido permiso y obtengo user location
                const userLocation = await getUserLocation();
                if (userLocation) {
                    const coords = {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                    };
                    setRegion(r => ({ ...r, ...coords }));
                    setCurrentCenter(coords);

                    if (setLocationLoaded) {
                        setLocationLoaded();
                    }
                }
            }
        })();
    }, [initialCoordinates]);


    // Conmutar selección
    const handleLocationToggle = () => {
        if (fijarMarker) {
            setFijarMarker(null)
            onLocationSelect(null);
        } else {

            if (ubicacionSoloEnAnisacate && !estaDentroDeAnisacate(currentCenter.latitude, currentCenter.longitude)) {
                setFailedToastKey((prev) => prev + 1);
                return;
            }

            setFijarMarker({ latitude: currentCenter.latitude, longitude: currentCenter.longitude })
            onLocationSelect(currentCenter);
            setSuccessMessage("¡Ubicación seleccionada con éxito!");
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    const hasLocation = fijarMarker !== null;


    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
    };

    const selectMapType = (type: MapType) => {
        setMapType(type);
        setIsOverlayVisible(false);
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={[styles.map, { width: mapWidth, height: mapHeight }]}
                region={region}
                mapType={mapType}
                onRegionChange={r => setCurrentCenter({ latitude: r.latitude, longitude: r.longitude })}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >
                {fijarMarker &&
                    <Marker
                        coordinate={fijarMarker}
                    >
                        <Image
                            source={markerImage}
                            style={{
                                width: PIN_SIZE - 12,
                                height: PIN_SIZE - 10,
                                resizeMode: 'contain',
                            }}
                        />
                    </Marker>

                }
            </MapView>

            {!fijarMarker &&
                <Image
                    source={markerImage}
                    style={{
                        position: 'absolute',
                        width: PIN_SIZE - 2,
                        height: PIN_SIZE - 2,
                        top: ((mapHeight / 2) - (PIN_SIZE / 2)) - 20,
                        left: (mapWidth / 2) - (PIN_SIZE / 2),
                        resizeMode: 'contain',
                    }}
                />
            }

            {/* Indicaciones */}
            <View style={{ height: 110, flexDirection: "column", justifyContent: "space-between" }}>
                <View style={{
                    marginTop: 8,
                    height: 50,
                    paddingHorizontal: 8,
                    flexDirection: "row",
                    justifyContent: "space-between"

                }}>
                    <View style={styles.messageContainer}>
                        {hasLocation && successMessage ? (
                            <Text style={styles.successText}>{successMessage}</Text>
                        ) : showInstructions ? (
                            <Text style={styles.mapInstructions}>{instructionsText}</Text>
                        ) : null}
                    </View>
                    <View style={styles.fabContainer}>
                        <FAB
                            icon={<Image source={require("../assets/images/layersIcon.png")} style={styles.icon} />}
                            onPress={() => setIsOverlayVisible(v => !v)}
                            color={secondaryColor}
                            size="small"
                        />
                    </View>
                </View>

                {/* Botón de marcar/desmarcar */}
                <Button
                    title={hasLocation ? unselectButtonText : buttonText}
                    buttonStyle={{
                        ...styles.mapButton,
                        backgroundColor: hasLocation ? 'red' : principalColor
                    }}
                    onPress={handleLocationToggle}
                />
            </View>

            {/* Overlay para cambiar tipo de mapa */}
            {isOverlayVisible && (
                <MapOverlay
                    isVisible={isOverlayVisible}
                    toggleOverlay={toggleOverlay}
                    mapType={mapType}
                    selectMapType={selectMapType}
                />
            )}

            {failedToastKey > 0 &&
                <OnlyTextFailedToast
                    key={failedToastKey}
                    visible={true}
                    message='La ubicación seleccionada está fuera de Anisacate.'
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: MAP_HEIGHT + 110,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    map: {
        width: "100%",
        height: MAP_HEIGHT,
    },
    centerMarker: {
        position: 'absolute',
        top: MAP_HEIGHT / 2 - 45,
        left: Dimensions.get("window").width / 2 - 45,
        width: 48,
        height: 48,
        resizeMode: 'contain',
    },
    messageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%"
    },
    fabContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "20%"
    },
    mapInstructions: {
        fontSize: 13,
        color: '#555',
        textAlign: 'left',
    },
    successText: {
        fontSize: 14,
        color: '#61B353',
    },
    mapButton: {
        borderRadius: 0,
        paddingVertical: 10,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    }
});
