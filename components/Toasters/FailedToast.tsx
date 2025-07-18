import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

interface FailedToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
}

const FailedToast: React.FC<FailedToastProps> = ({ visible, message, onHide, duration = 3000 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (visible) {
      // Animación de aparición
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Reproducir la animación una vez
        animationRef.current?.play();
      });

      // Animación de desaparición después del tiempo especificado
      const timeout = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      // Limpiar el temporizador
      return () => clearTimeout(timeout);
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <LottieView
        ref={animationRef}
        style={styles.animation}
        loop={false}
        source={require('../../assets/animations/FailedToastAnimation.json')}
      />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    maxWidth: "70%",
    position: 'absolute',
    alignSelf: 'center',
    bottom: '40%',
    backgroundColor: '#ff4e4e', // Color rojo de fondo
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  animation: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  toastText: {
    color: '#fff', // Color blanco para el texto
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FailedToast;
