import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface LoadingLogoPulseProps {
  isLoading: boolean;
  size?: number;
  message?: string;
}

const LoadingLogoAnimatedTransparent: React.FC<LoadingLogoPulseProps> = ({
  isLoading,
  size = 60,
  message = "Cargando..."
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logo = require("../assets/images/soloEscudoAnisacate.png");

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLoading, pulseAnim]);

  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Animated.Image
          source={logo}
          style={[
            styles.logo,
            {
              width: size,
              height: size,
              transform: [{ scale: pulseAnim }]
            },
          ]}
        />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingLogoAnimatedTransparent;
