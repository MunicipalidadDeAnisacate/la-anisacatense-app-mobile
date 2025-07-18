import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Card } from '@rneui/themed';
import { Button } from "@rneui/themed/dist/Button";
import { getColorByAuthDataRol } from "@/constants/Colors";
import { router } from "expo-router";

interface ConsultaCiudadanaItemCardProps {
    id: number;
    titulo: string;
    fechaInicio: string;
    horaInicio: string;
    fechaCierre: string;
    horaCierre: string;
    onPress?: () => void;
    rol?: string;
    verInformacionConsulta?: (id: number) => void;
}

const ConsultaCiudadanaItemCard: React.FC<ConsultaCiudadanaItemCardProps> = ({
    id,
    titulo,
    fechaInicio,
    horaInicio,
    fechaCierre,
    horaCierre,
    onPress,
    rol = "vecino",
}) => {

    const navigateToInformacionConsulta = (id: number) => {
        router.push({
            pathname: "/admin/consultaCiudadana/informacionConsultaCiudadanaAdmin",
            params: { idConsultaStr: JSON.stringify(id) }
        })
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Card containerStyle={styles.card}>
                <View key={id} style={styles.content}>
                    <Text style={styles.title}>{titulo}</Text>
                    <Text style={styles.description}>
                        Inicio: {fechaInicio} - {horaInicio}
                    </Text>
                    <Text style={styles.description}>
                        Cierre: {fechaCierre} - {horaCierre}
                    </Text>
                </View>
                <View style={styles.actionsContainter}>
                    {(rol === "admin") &&
                        <Button
                            title="Ver Consulta Ciudadana"
                            onPress={() => navigateToInformacionConsulta(id)}
                            buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(rol) }]}
                            containerStyle={styles.buttonWrapper}
                            titleStyle={styles.informationButtonText}
                        />
                    }
                </View>
            </Card>
        </TouchableOpacity>
    )
}

export default ConsultaCiudadanaItemCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 15,
    },
    content: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
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
    actionsContainter: {
        marginTop: 10,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    buttonWrapper: {
        marginVertical: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        borderRadius: 8,
        paddingVertical: 10,
    },
    informationButtonText: {
        color: 'white',
        fontWeight: '600',
    }
})