import MapOverlay from "@/components/MapOverlay";
import { FAB } from "@rneui/themed/dist/FAB";
import { useCallback, useState } from "react";
import { Image, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import MapView, { MapType, Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { poligonosBarrios } from "@/constants/poligonosBarrios";
import { estaDentroDeAnisacate, obtenerNombreBarrio } from "@/constants/localizar";
import { colorBotonCambioMapType } from "@/constants/Colors";

const COLORES = [
    'rgba(255, 99, 132, 0.3)',
    'rgba(54, 162, 235, 0.3)',
    'rgba(255, 206, 86, 0.3)',
    'rgba(75, 192, 192, 0.3)',
    'rgba(153, 102, 255, 0.3)',
    'rgba(255, 159, 64, 0.3)',
    'rgba(255, 99, 71, 0.3)',
    'rgba(60, 179, 113, 0.3)',
    'rgba(100, 149, 237, 0.3)',
    'rgba(240, 128, 128, 0.3)',
    'rgba(218, 112, 214, 0.3)'
];

const MapaCualEsMiBarrio = () => {
    const [mapType, setMapType] = useState<MapType>("standard");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [currentRegion] = useState<Region>({
        latitude: -31.706602,
        longitude: -64.403142,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    });
    const [nombreBarrio, setNombreBarrio] = useState<string>(
        obtenerNombreBarrio(currentRegion.latitude, currentRegion.longitude) || "Desconocido"
    );

    const getColor = useCallback((index: number) => ({
        fill: COLORES[index % COLORES.length],
        stroke: COLORES[index % COLORES.length].replace('0.3', '0.7')
    }), []);

    const handleRegionChangeComplete = useCallback((region: Region) => {
        if (!estaDentroDeAnisacate(region.latitude, region.longitude)) {
            setNombreBarrio("Fuera de Anisacate!");
        } else {
            setNombreBarrio(obtenerNombreBarrio(region.latitude, region.longitude) || "Desconocido");
        }
    }, []);

    const selectMapType = (type: MapType) => {
        setMapType(type);
        setIsOverlayVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={currentRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
                mapType={mapType}
                maxZoomLevel={16}
                minZoomLevel={13}
            >
                {poligonosBarrios.map((barrio, index) => (
                    <Polygon
                        key={barrio.id}
                        coordinates={barrio.limites[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng }))}
                        fillColor={getColor(index).fill}
                        strokeColor={getColor(index).stroke}
                        strokeWidth={1}
                    />
                ))}
            </MapView>

            <View style={styles.headerTextView}>
                <Text style={styles.headerText}>Seleccione su Barrio:</Text>
            </View>

            <View style={styles.markerFixed}>
                <Image
                    source={require("../../assets/images/marker.png")}
                    style={styles.markerImage}
                />
                <View style={styles.barrioBadge}>
                    {nombreBarrio === "Fuera de Anisacate!" ? (
                        <Text style={[styles.barrioText, { color: "red" }]}>{nombreBarrio}</Text>
                    ) : (
                        <Text style={styles.barrioText}>{nombreBarrio}</Text>
                    )}
                </View>
            </View>

            <View style={styles.fabView}>
                <FAB
                    icon={<Image source={require("../../assets/images/layersIcon.png")} style={styles.icon} />}
                    onPress={() => setIsOverlayVisible(!isOverlayVisible)}
                    color={colorBotonCambioMapType}
                    size="large"
                />
            </View>

            {nombreBarrio === "Fuera de Anisacate!" ? (
                <View style={[styles.buttonBox, { backgroundColor: "rgba(255, 0, 0, 0.7)" }]}>
                    <Text style={styles.bottomText}>
                        Debe seleccionar un barrio dentro de Anisacate!
                    </Text>
                </View>
            ) : (
                <View style={styles.buttonBox}>
                    <Text style={styles.bottomText}>Su barrio es {nombreBarrio}</Text>
                </View>
            )}

            <MapOverlay
                isVisible={isOverlayVisible}
                toggleOverlay={() => setIsOverlayVisible(!isOverlayVisible)}
                mapType={mapType}
                selectMapType={selectMapType}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
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
        bottom: Platform.OS === "ios" ? 50 : 30,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 10,
    },
    bottomText: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
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
    barrioBadge: {
        position: 'absolute',
        bottom: '100%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 6,
        borderRadius: 8,
        minWidth: 150,
        elevation: 3,
    },
    barrioText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
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

export default MapaCualEsMiBarrio;
