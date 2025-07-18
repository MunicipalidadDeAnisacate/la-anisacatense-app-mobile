import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Overlay, ListItem } from '@rneui/themed';
import { MapType } from 'react-native-maps';

type MapOverlayProps = {
  isVisible: boolean;
  toggleOverlay: () => void;
  mapType: string;
  selectMapType: (type: MapType) => void;
};

const MapOverlay: React.FC<MapOverlayProps> = ({ isVisible, toggleOverlay, mapType, selectMapType }) => {
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={toggleOverlay}
      overlayStyle={styles.overlayStyle}
    >
      <View style={styles.overlayContent}>
        <Text style={styles.titleText}>Seleccione tipo de mapa</Text>

        <ListItem
          onPress={() => selectMapType("standard")}
          containerStyle={mapType === "standard" ? styles.ListItemSelected : styles.listItem}
        >
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Mapa Estándar</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem
          onPress={() => selectMapType("hybrid")}
          containerStyle={mapType !== "standard" ? styles.ListItemSelected : styles.listItem}
        >
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Mapa Satelital</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  overlayContent: {},
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 5,
  },
  ListItemSelected: {
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#B8B8B8',
  },
  listItemTitle: {
    color: '#1E73BE',
    fontSize: 16,
    width: '100%',
  },
});

export default MapOverlay;
