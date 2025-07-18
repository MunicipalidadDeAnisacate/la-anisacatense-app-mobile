import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, Defs, ClipPath, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width / 4;      // diámetro del círculo
const RADIUS = CIRCLE_SIZE / 2;


interface Props {
    proyectos: ProyectoEnVotacionConRecuento[];
    onVote: (proyectoId: number) => void;
    proyectoIdVotado: number | null;
}


export default function ConsultaCiudanaProgressRecuento({ proyectos, onVote, proyectoIdVotado }: Props) {
    const totalVotos = proyectos.reduce((sum, p) => sum + p.votos, 0) || 1;
    const disabledTouchable = proyectoIdVotado != null;

    return (
        <View style={styles.container}>
            {proyectos.map(p => {
                const porcentaje = p.votos / totalVotos;
                const fillWidth = porcentaje * CIRCLE_SIZE;
                const fillColor = proyectoIdVotado === p.id ? '#4caf50' : '#ccc';

                const getTextSytle = () : any => {
                    if (proyectoIdVotado === p.id){
                        return {color: "#4caf50", fontWeight: 'bold'};
                    }
                    return {color: "#555"};
                }

                return (
                    <TouchableOpacity
                        key={p.id}
                        style={styles.item}
                        activeOpacity={0.7}
                        disabled={disabledTouchable}
                        onPress={() => onVote(p.id)}
                    >
                        <View key={p.id} style={styles.item}>
                            <View style={styles.circleShadow}>
                                <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                                    <Defs>
                                        {/* Definimos el clipPath con forma de círculo */}
                                        <ClipPath id={`clip-${p.id}`}>
                                            <Circle
                                                cx={RADIUS}
                                                cy={RADIUS}
                                                r={RADIUS}
                                            />
                                        </ClipPath>
                                    </Defs>

                                    {/* Fondo blanco */}
                                    <Circle
                                        cx={RADIUS}
                                        cy={RADIUS}
                                        r={RADIUS}
                                        fill="#fff"
                                    />

                                    {/* Rectángulo gris recortado al círculo */}
                                    <Rect
                                        x={0}
                                        y={0}
                                        width={fillWidth}
                                        height={CIRCLE_SIZE}
                                        fill={fillColor}
                                        clipPath={`url(#clip-${p.id})`}
                                    />
                                </Svg>
                            </View>

                            <View style={styles.label}>
                                <Text style={styles.porcentajeText}>
                                    {Math.round(porcentaje * 100)}%
                                </Text>
                            </View>

                            <View style={{ maxWidth: 100 }}>
                                <Text style={[styles.tituloText, getTextSytle()]}>
                                    {p.titulo}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 16,
        marginHorizontal: 30,
    },
    item: {
        alignItems: 'center',
        margin: 8,
    },
    circleShadow: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: '#fff',
        // Android
        elevation: 4,
        // iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    label: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    porcentajeText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    tituloText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
    },
});
