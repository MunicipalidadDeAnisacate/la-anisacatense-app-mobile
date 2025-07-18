import React from "react";
import { Platform, StyleSheet } from "react-native";

export const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 50,                  // alto fijo
        fontSize: 16,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        textAlignVertical: 'center', // centra verticalmente el texto (iOS)
    },
    inputAndroid: {
        height: 50,
        fontSize: 16,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        textAlignVertical: 'center', // centra verticalmente el texto (Android)
    },
    iconContainer: {
        top: Platform.OS === 'ios' ? 14 : 12,
        right: 10,
    },
    placeholder: {
        color: '#94a3b8',
    },
});