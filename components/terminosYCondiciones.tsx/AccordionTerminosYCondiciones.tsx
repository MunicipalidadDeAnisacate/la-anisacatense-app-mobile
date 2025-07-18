import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { TerminosYCondiciones } from './terminosYCondiciones';
import { CheckBox } from "@rneui/themed/dist/CheckBox";


interface VisorProps {
    aceptPolicy: boolean;
    setAceptPolicy: (value: boolean) => void;
    setIsChildScrollActive: (active: boolean) => void;
}

const VisorTerminosYCondiciones: React.FC<VisorProps> = ({ aceptPolicy, setAceptPolicy, setIsChildScrollActive }) => {
    return (
        <View style={styles.wrapperContainer}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Términos y Condiciones</Text>
            </View>

            <ScrollView
                style={styles.fullContainer}
                contentContainerStyle={{ padding: 12 }}
                nestedScrollEnabled={true}
                onTouchStart={() => setIsChildScrollActive(true)}
                onScrollEndDrag={() => setIsChildScrollActive(false)}
                onMomentumScrollEnd={() => setIsChildScrollActive(false)}
            >
                <TerminosYCondiciones />
            </ScrollView>

            <View style={styles.footer}>
                <CheckBox
                    title="Acepto los términos y condiciones"
                    checkedIcon="check-square"
                    uncheckedIcon="square-o"
                    checked={aceptPolicy}
                    onPress={() => setAceptPolicy(!aceptPolicy)}
                    containerStyle={styles.checkContainer}
                    textStyle={styles.checkText}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapperContainer: {
        width: '85%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginVertical: 10,
        overflow: 'hidden',
        height: 275,
    },
    header: {
        backgroundColor: '#fafafa',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    fullContainer: {
        height: 200,
        backgroundColor: '#fff'
    },
    footer: {
        backgroundColor: '#fafafa',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 50,
        justifyContent: 'center',
    },
    checkContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    checkText: {
        fontSize: 14,
        color: '#333',
    },
});

export default VisorTerminosYCondiciones;
