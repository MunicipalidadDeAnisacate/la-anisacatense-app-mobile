import { principalColorVecino } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width / 4;
const RADIUS = CIRCLE_SIZE / 2;


interface Props {
    proyectos: ProyectoEnVotacionSinRecuento[];
    onVote: (proyectoId: number) => void;
    proyectoIdVotado: number | null;
}

const celeste = principalColorVecino;
const verde = "#4caf50";
const gris = "#ccc";

export default function ConsultaCiudadanaProgressSinRecuento({ proyectos, onVote, proyectoIdVotado }: Props) {
    const getStrokeColor = (id: number) : string => {
        if (proyectoIdVotado == null){
            return celeste;
        } else if (proyectoIdVotado == id){
            return verde;
        } else {
            return gris;
        }
    }

    return (
        <View style={styles.container}>
            {proyectos.map(p => {
                const isSelected = proyectoIdVotado === p.id;
                const strokeColor = getStrokeColor(p.id);
                const iconName = isSelected ? 'check' : 'close';
                const iconColor = isSelected ? verde : gris;

                return (
                    <TouchableOpacity
                        key={p.id}
                        style={styles.item}
                        activeOpacity={0.7}
                        onPress={() => onVote(p.id)}
                        disabled={proyectoIdVotado != null}
                    >
                        <View style={styles.circleShadow}>
                            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                                <Circle
                                    cx={RADIUS}
                                    cy={RADIUS}
                                    r={RADIUS - 4}
                                    fill={"#fff"}
                                    stroke={strokeColor}
                                    strokeWidth={4}
                                />
                            </Svg>
                            {/* Contenedor centrado */}
                            <View style={styles.iconWrapper}>
                                {proyectoIdVotado == null ?
                                    (
                                        <View style={{ maxWidth: CIRCLE_SIZE - 2 }}>
                                            <Text style={styles.selectionText}>
                                                Selecione aquí
                                            </Text>
                                        </View>
                                    ) : (
                                        <MaterialCommunityIcons
                                            name={iconName}
                                            size={RADIUS}
                                            color={iconColor}
                                        />
                                    )
                                }
                            </View>
                        </View>
                        <View style={styles.titleWrapper}>
                            <Text style={[styles.tituloText, isSelected && styles.selectedText]}>
                                {p.titulo}
                            </Text>
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
        marginHorizontal: 30
    },
    item: {
        width: CIRCLE_SIZE,
        alignItems: 'center',
        marginVertical: 8
    },
    circleShadow: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: RADIUS,
        backgroundColor: '#fff',
        // sombras Android y iOS
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconWrapper: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectionText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
    },
    titleWrapper: {
        marginTop: 8,
        width: CIRCLE_SIZE,
        alignItems: 'center'
    },
    tituloText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555'
    },
    selectedText: {
        color: verde,
        fontWeight: 'bold'
    }
});