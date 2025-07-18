import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface OnlyTextFailedToastProps {
    visible: boolean;
    message: string;
    duration?: number; // Duración en milisegundos
}

const OnlyTextFailedToast: React.FC<OnlyTextFailedToastProps> = ({ visible, message, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(visible);
    const opacity = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timeout = setTimeout(() => {
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setIsVisible(false));
            }, duration);

            return () => clearTimeout(timeout);
        }
    }, [visible, duration, opacity]);

    if (!isVisible) return null;

    return (
        <Animated.View style={[styles.toast, { opacity }]}>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: "23%",
        left: "10%",
        right: "10%",
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    message: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default OnlyTextFailedToast;
