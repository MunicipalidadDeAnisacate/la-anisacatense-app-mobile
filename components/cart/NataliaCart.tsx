import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';


export default function NataliaCart() {
    const pdfUrl = process.env.EXPO_PUBLIC_CART;
    const androidUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    const source = Platform.OS === 'ios'
        ? { uri: pdfUrl }
        : { uri: androidUrl };

    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.container}>
            {loading && (
                <ActivityIndicator style={styles.loader} size="large" color="#1E73BE" />
            )}

            {/* PDF */}
            <WebView
                style={styles.web}
                originWhitelist={['*']}
                source={source}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                androidHardwareAccelerationDisabled={false}
                scalesPageToFit
                allowFileAccess
                allowUniversalAccessFromFileURLs
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1},
    web: { flex: 1},
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -20,
        marginLeft: -20,
        zIndex: 1,
    },
    closeBtn: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 2,
    },
});
