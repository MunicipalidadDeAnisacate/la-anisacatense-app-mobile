import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';

const TipoSolicitudMenuCard = ({ title, image, onPress, description, blocked }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={blocked}>
      <Card containerStyle={[styles.card, blocked && styles.disabledCard]}>
        <View style={styles.content}>
          <Image source={image} style={[styles.image, blocked && styles.disabledImage]} />
          <View style={styles.textContainer}>
            <Text style={[styles.title, blocked && styles.disabledTitle]}>
              {title}
            </Text>
            {description && <Text style={styles.description}>{description}</Text>}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'flex-start',
  },
  disabledCard: {
    backgroundColor: '#f0f0f0', // Color de fondo más claro
    borderColor: '#ccc',
    opacity: 0.6,
  },
  disabledImage: {
    opacity: 0.5,
  },
  disabledTitle: {
    color: '#999',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: '30%',
    aspectRatio: 1,
    resizeMode: 'contain',
    marginRight: 10,
  },
  textContainer: {
    width: '70%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
});

export default TipoSolicitudMenuCard;
