import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Dimensions } from 'react-native';

interface LoadingScreenProps {
    isLoading: boolean;
    message?: string;
    color?: string;
    size?: 'small' | 'large';
}

const LoadingSpinner: React.FC<LoadingScreenProps> = ({
    isLoading,
    message = 'Cargando...',
    color = '#3498db',
    size = 'large',
}) => {
    if (!isLoading) return null;

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    message: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default LoadingSpinner;
