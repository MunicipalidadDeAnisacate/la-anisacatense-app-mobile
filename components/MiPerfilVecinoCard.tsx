import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';

const MiPerfilVecinoCard = ({ title, image, onPress, description }) => {
  return (
    <TouchableOpacity onPress={onPress} >
      <Card containerStyle={styles.card}>
        <View style={styles.content}>
          <Image source={image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>
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

export default MiPerfilVecinoCard;
