import { point, polygon, booleanPointInPolygon, distance, nearestPointOnLine, polygonToLine, featureCollection } from "@turf/turf";
import { poligonosBarrios } from "./poligonosBarrios";
import { limitesAnisacateMatriz } from "./limitesAnisacate";

export const obtenerNombreBarrio = (lat: number, lng: number): string => {
    const ubicacionSeleccionada = point([lng, lat]); // Punto del usuario (Longitud, Latitud)

    let barrioEncontrado = null;
    let distanciaMinima = Infinity;
    let barrioMasCercano = null;

    poligonosBarrios.forEach((barrio) => {
        const poligonoBarrio = polygon(barrio.limites);
        const dentro = booleanPointInPolygon(ubicacionSeleccionada, poligonoBarrio);

        if (dentro) {
            barrioEncontrado = barrio;
        } else {
            // Convertir el polígono en líneas antes de usar nearestPointOnLine
            const lineaPoligono = polygonToLine(poligonoBarrio);

            // Verificar si `lineaPoligono` es un FeatureCollection o un Feature
            let lineaParaCalculo: any;
            if (lineaPoligono.type === "FeatureCollection") {
                // Si es una colección, combinar las líneas en una sola
                lineaParaCalculo = featureCollection(lineaPoligono.features);
            } else {
                lineaParaCalculo = lineaPoligono; // Si es una sola línea
            }

            const nearestPoint = nearestPointOnLine(lineaParaCalculo, ubicacionSeleccionada);
            const dist = distance(ubicacionSeleccionada, nearestPoint);

            if (dist < distanciaMinima) {
                distanciaMinima = dist;
                barrioMasCercano = barrio;
            }
        }
    });

    if (barrioEncontrado) {
        return barrioEncontrado.name;
    } else if (barrioMasCercano) {
        return barrioMasCercano.name;
    } else {
        return "";
    }
};

export const estaDentroDeAnisacate = (latitude: number, longitude: number): boolean => {
    const limitesAnisacate = polygon(limitesAnisacateMatriz);

    const ubicacionSeleccionada = point([longitude, latitude]);

    if (!booleanPointInPolygon(ubicacionSeleccionada, limitesAnisacate)) {
        return false
    }

    return true
}

export const obtenerIdBarrio = (lat: number, lng: number): number => {
    const ubicacionSeleccionada = point([lng, lat]); // Punto del usuario (Longitud, Latitud)

    let barrioEncontrado = null;
    let distanciaMinima = Infinity;
    let barrioMasCercano = null;

    poligonosBarrios.forEach((barrio) => {
        const poligonoBarrio = polygon(barrio.limites);
        const dentro = booleanPointInPolygon(ubicacionSeleccionada, poligonoBarrio);

        if (dentro) {
            barrioEncontrado = barrio;
        } else {
            // Convertir el polígono en líneas antes de usar nearestPointOnLine
            const lineaPoligono = polygonToLine(poligonoBarrio);

            // Verificar si `lineaPoligono` es un FeatureCollection o un Feature
            let lineaParaCalculo: any;
            if (lineaPoligono.type === "FeatureCollection") {
                // Si es una colección, combinar las líneas en una sola
                lineaParaCalculo = featureCollection(lineaPoligono.features);
            } else {
                lineaParaCalculo = lineaPoligono; // Si es una sola línea
            }

            const nearestPoint = nearestPointOnLine(lineaParaCalculo, ubicacionSeleccionada);
            const dist = distance(ubicacionSeleccionada, nearestPoint);

            if (dist < distanciaMinima) {
                distanciaMinima = dist;
                barrioMasCercano = barrio;
            }

        }
    });

    if (barrioEncontrado) {
        return barrioEncontrado.id;
    } else if (barrioMasCercano) {
        return barrioMasCercano.id;
    } else {
        return 0;
    }
};