import React, { useState, useEffect, useRef } from 'react';
import { Text, Image, SafeAreaView, View, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';
import { getLucesTecnico, getLucesVecino, iniciarSolicitud, PosteResponse } from '../../api/petitions';
import { Button } from '@rneui/themed';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useAuth } from '@/context/AuthContext';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import MapOverlay from '@/components/MapOverlay';
import { getUserLocation } from '@/functions/locationUtils';
import ListadoSolicitudesLuminaria from '@/components/ListadoSolicitudesLuminaria';
import { FAB } from '@rneui/themed/dist/FAB';
import { getMarkerTitle } from "../../functions/fromMap/getMarkerTitle";
import { colorBotonCambioMapType } from '@/constants/Colors';


const MapaLuminaria = () => {
  const { authData } = useAuth();

  const { subTipo } = useLocalSearchParams();
  const subTipoObj = subTipo ? JSON.parse(subTipo as string) : null;

  const { solicitudComoVecinoStr } = useLocalSearchParams();
  const solicitudComoVecino: boolean = solicitudComoVecinoStr ? JSON.parse(solicitudComoVecinoStr as string) : false;

  const miniFuncionalImage = require("../../assets/images/nuevasLuces/luz-buena.png");
  const miniNoFuncionalImage = require("../../assets/images/nuevasLuces/luz-rota.png");

  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState<MapType>("hybrid");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // Estado para mostrar el overlay
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [postes, setPostes] = useState<PosteResponse[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<PosteResponse[]>([]);
  const [posteSeleccionado, setPosteSeleccionado] = useState<PosteResponse | null>(null);
  const [userLocationReady, setUserLocationReady] = useState(false);
  const [openListadoSolicitudes, setOpenListadoSolicitudes] = useState<boolean>(false);
  const solicitudesFiltradas = postes.filter(poste => poste.idReclamo);


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
    const fetchMarkersVecino = async () => {
      try {
        const postesData = await getLucesVecino(authData.id, subTipoObj.id);
        setPostes(postesData);
        setLoading(false)
      } catch (error) {
        console.error("Error al traer postes:", error);
        setLoading(false)
      }
    };

    if (userLocationReady && authData.rol == "vecino") {
      fetchMarkersVecino();
    }
  }, [userLocationReady])


  useEffect(() => {
    const fetchMarkersTecnico = async () => {
      try {
        const postesData = await getLucesTecnico(subTipoObj.id);
        setPostes(postesData);
        setLoading(false)
      } catch (error) {
        console.error("Error al traer postes:", error);
        setLoading(false)
      }
    };

    if (userLocationReady && authData.rol == "tecnico") {
      fetchMarkersTecnico();
    }

  }, [userLocationReady]);


  const onRegionChangeComplete = (region: Region) => {
    const filteredPostes = postes.filter(poste =>
      poste.latitude >= region.latitude - region.latitudeDelta &&
      poste.latitude <= region.latitude + region.latitudeDelta &&
      poste.longitude >= region.longitude - region.longitudeDelta &&
      poste.longitude <= region.longitude + region.longitudeDelta
    );
    setVisibleMarkers(filteredPostes);
  };


  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };


  const selectMapType = (type: MapType) => {
    setMapType(type);
    setIsOverlayVisible(false);
  };

  const closeConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false)
  }


  // Funcion de vecino para solicitar reparacion
  const handleSubmit = async () => {
    setIsConfirmationDialogOpen(false);
    setLoading(true)

    try {

      if (!posteSeleccionado || !subTipoObj) {
        Alert.alert("No hay poste seleccionado!");
        return
      }

      const inputData = {
        idVecino: authData.id,
        idSubTipoReclamo: subTipoObj.id,
        idPoste: posteSeleccionado.idPoste
      }

      const success = await iniciarSolicitud(inputData);

      if (success) {
        router.push({
          pathname: authData.rol === "tecnico" ? "/menuTecnico/menuTipoSolicitudTecnico" : "/menuVecino/menuPrincipal",
          params: { openSuccesToast: JSON.stringify(true) }
        });
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      router.push({
        pathname: authData.rol === "tecnico" ? "/menuTecnico/menuPrincipalTecnico" : "/menuVecino/menuPrincipal",
        params: { openFailedToast: JSON.stringify(true) }
      });
      console.error("Solicitud fallida")
    }
  }


  // Funcion de tecnico para reparar poste
  const handleRepair = () => {
    setIsConfirmationDialogOpen(false);
    if (!posteSeleccionado || !subTipoObj) {
      Alert.alert("No hay poste seleccionado!");
      return
    }

    const inputData = {
      idTecnico: authData.id,
      titleTipoSolicitud: subTipoObj.title,
      idSubTipoReclamo: subTipoObj.id,
      idPoste: posteSeleccionado.idPoste,
      nombrePoste: posteSeleccionado.nombrePoste
    }

    router.push({
      pathname: "/solicitudesForms/newSolutionPage",
      params: { inputData: JSON.stringify(inputData) }
    });
  }


  // Se utiliza para centrar bien el mapa
  const mapRef = useRef<MapView | null>(null);
  useEffect(() => {
    if (mapRef.current && userLocationReady) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  }, [initialRegion, userLocationReady]);


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
    setPosteSeleccionado(null)
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
        minZoomLevel={18}
        onRegionChangeComplete={onRegionChangeComplete}
        onRegionChange={onRegionChangeComplete}
        onPress={() => setPosteSeleccionado(null)}
        mapType={mapType}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
      >
        {visibleMarkers.map(poste => (
          <Marker
            key={poste.idPoste}
            tracksViewChanges={false}
            coordinate={{ latitude: poste.latitude, longitude: poste.longitude }}
            title={getMarkerTitle(authData.rol, poste.estadoPoste, poste.nombrePoste)}
            onPress={(e) => {
              e.stopPropagation();
              setPosteSeleccionado(poste);
            }}
            image={(poste.estadoPoste === 2) ? (miniNoFuncionalImage) : (miniFuncionalImage)}
          />
        ))}
      </MapView>


      {/* Encabezado flotante */}
      <View style={styles.headerTextView}>
        {authData.rol === "tecnico" ?
          (<Text style={styles.headerText}>Seleccione la luminaria a arreglar</Text>) :
          (<Text style={styles.headerText}>Seleccione la luminaria defectuosa</Text>)
        }
      </View>

      <View style={styles.fabView}>
        <FAB
          icon={<Image source={require("../../assets/images/layersIcon.png")} style={styles.icon} />}
          onPress={() => setIsOverlayVisible(!isOverlayVisible)}
          color={colorBotonCambioMapType}
          size='large'
        />
      </View>

      <View style={[styles.buttonBox, { bottom: Platform.OS === "ios" ? 60 : 25 }]}>
        {(authData.rol === "vecino" || solicitudComoVecino) &&
          <Button
            disabled={!posteSeleccionado || (posteSeleccionado.estadoPoste === 2)}
            title={(authData.rol == "tecnico") ? "Solicitar reparación como vecino" : 'Solicitar reparación'}
            onPress={() => setIsConfirmationDialogOpen(true)}
            containerStyle={(posteSeleccionado && posteSeleccionado.estadoPoste === 1) ? styles.buttonContainer : styles.buttonContainerDisabled}
            buttonStyle={{ backgroundColor: '#61B353' }}
          />
        }

        {(authData.rol == "tecnico" && !solicitudComoVecino) &&
          <>
            <Button
              title={'Ver listado de Solicitudes'}
              onPress={() => setOpenListadoSolicitudes(true)}
              containerStyle={styles.buttonListContainer}
              buttonStyle={{ backgroundColor: '#1E73BE' }}
            />
            <Button
              disabled={!posteSeleccionado || (posteSeleccionado.estadoPoste === 1)}
              title={'Reparar'}
              onPress={() => setIsConfirmationDialogOpen(true)}
              containerStyle={(posteSeleccionado && posteSeleccionado.estadoPoste === 2) ? styles.buttonContainer : styles.buttonContainerDisabled}
              buttonStyle={{ backgroundColor: '#61B353' }}
            />
          </>
        }

      </View>

      <ListadoSolicitudesLuminaria
        solicitudes={solicitudesFiltradas}
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

      {!solicitudComoVecino &&
        < ConfirmationDialog
          visible={isConfirmationDialogOpen}
          description={(authData.rol === "vecino") ? (`Desea solicitar reparación del poste: ${posteSeleccionado?.nombrePoste}?`) : (`Desea reparar el poste seleccionado? Poste:${posteSeleccionado?.nombrePoste}`)}
          onCancel={closeConfirmationDialog}
          onConfirm={(authData.rol === "vecino") ? (handleSubmit) : (handleRepair)}
        />
      }

      {(solicitudComoVecino) && (authData.rol === "tecnico") &&
        <ConfirmationDialog
          visible={isConfirmationDialogOpen}
          description={`Desea solicitar como vecino reparación del poste: ${posteSeleccionado?.nombrePoste}?`}
          onCancel={closeConfirmationDialog}
          onConfirm={handleSubmit}
        />
      }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 25,
    height: 25,
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
  buttonListContainer: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1E73BE',
    elevation: 3,
    marginBottom: 10
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
    top: 65,
    right: 10
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  cluster: {
    backgroundColor: '#61B353',
    borderRadius: 20,
    padding: 10,
    minWidth: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapaLuminaria;