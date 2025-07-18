import React, { useState, useEffect } from 'react';
import {
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Linking
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import LoadingLogoAnimatedTransparent from '@/components/LoadingLogoAnimatedTransparent';
import { getInformacionProyecto } from '@/api/petitions';
import { Card } from '@rneui/themed';
import ConsultaCiudadanaItemCard from '@/components/ConsultaCiudadanaItemCard';
import { Button } from '@rneui/themed/dist/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function informacionProyecto() {
    const { proyectoIdStr } = useLocalSearchParams();
    const proyectoId = proyectoIdStr ? JSON.parse(proyectoIdStr as string) : null;

    const [proyecto, setProyecto] = useState<InformacionProyectoResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!proyectoId) {
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const data: InformacionProyectoResponse = await getInformacionProyecto(proyectoId);
                setProyecto(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [proyectoId]);

    if (loading) {
        return <LoadingLogoAnimatedTransparent isLoading />;
    }
    if (!proyecto) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>No se pudo cargar la información del proyecto.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.header}>
                    Proyecto #{proyecto.id}
                    {'\n'}{proyecto.titulo}
                </Text>

                {/* Datos básicos */}
                <Card containerStyle={styles.card}>
                    <Text style={styles.subHeader}>Descripción del Proyecto</Text>
                    <Text style={styles.text}>{proyecto.descripcion || 'Sin descripción'}</Text>
                </Card>

                {/* Datos del archivo adjunto */}
                {proyecto.archivoUrl && (
                    <Card containerStyle={styles.card}>
                        <Text style={styles.subHeader}>Archivo adjunto del Proyecto</Text>
                        <Button
                            title="Ver archivo adjunto"
                            icon={
                                <MaterialCommunityIcons
                                    name="file-document-outline"
                                    size={25}
                                    color="white"
                                />
                            }
                            buttonStyle={styles.button}
                            containerStyle={styles.buttonWrapper}
                            titleStyle={styles.buttonText}
                            onPress={() => Linking.openURL(proyecto.archivoUrl ? proyecto.archivoUrl : "")}
                        />
                    </Card>
                )}

                {/* Datos del usuario */}
                <Card containerStyle={styles.card}>
                    <Text style={styles.subHeader}>Información del Autor</Text>
                    <Text style={styles.text}>{proyecto.nombreUsuario} {proyecto.apellidoUsuario}</Text>
                    <Text style={styles.text}>DNI: {proyecto.dniUsuario}</Text>
                    {proyecto.mailUsuario && <Text style={styles.text}>Email: {proyecto.mailUsuario}</Text>}
                    {proyecto.telefonoUsuario && <Text style={styles.text}>Telefono: {proyecto.telefonoUsuario}</Text>}
                </Card>

                {/* Elecciones asociadas */}
                {proyecto.eleccionDeProyectoList && proyecto.eleccionDeProyectoList.length > 0 && (
                    <Card containerStyle={[styles.card, { backgroundColor: '#F0F0F0', paddingBottom: 25 }]}>
                        <Text style={styles.subHeader}>Consultas Ciudadanas Asociadas</Text>
                        {proyecto.eleccionDeProyectoList.map(e => (
                            <ConsultaCiudadanaItemCard
                                id={e.id}
                                titulo={e.titulo}
                                fechaInicio={e.fechaInicio}
                                horaInicio={e.horaInicio}
                                fechaCierre={e.fechaCierre}
                                horaCierre={e.horaCierre}
                                onPress={() => {
                                    router.push({
                                        pathname: "/admin/eleccionesCiudadanas/nuevaEleccion",
                                        params: { eleccionIdStr: JSON.stringify(e.id) }
                                    })
                                }}
                            />
                        ))}
                    </Card>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    scrollContent: { padding: 16 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    card: {
        borderRadius: 8,
        padding: 10,
        marginVertical: 13,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        elevation: 2,
    },
    subHeader: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    text: { fontSize: 16, marginBottom: 4, color: '#333' },
    link: { fontSize: 16, color: '#1E90FF', marginBottom: 4 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 20, fontSize: 16 },
    eleccionCard: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 6,
        backgroundColor: '#FAFAFA',
    },
    eleccionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    eleccionButtonContainer: { marginTop: 8, alignSelf: 'flex-start' },
    buttonWrapper: {
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    }
});
