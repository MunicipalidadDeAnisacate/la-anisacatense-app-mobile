import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

interface SuccessToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ visible, message, onHide, duration = 3000 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (visible) {
      // Aparece el toast
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        animationRef.current?.play();
      });

      
      timeout = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [visible, duration, opacity, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <LottieView
        ref={animationRef}
        style={styles.animation}
        loop={false}
        source={require('../../assets/animations/newCheck.json')}
      />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    maxWidth: '70%',
    position: 'absolute',
    alignSelf: 'center',
    bottom: '40%',
    backgroundColor: '#28a745',
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  animation: {
    width: 65,
    height: 65,
  },
  toastText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SuccessToast;