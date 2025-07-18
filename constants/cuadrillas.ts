export const cuadrillas = [
    { id: 1, name: "Cuadrilla de Alumbrado", nameFromBack: "Alumbrado" },
    { id: 2, name: "Cuadrilla de Residuos", nameFromBack: "Residuos" },
    { id: 3, name: "Cuadrilla de Agua", nameFromBack: "Agua" },
    { id: 4, name: "Cuadrilla de Recolección de poda y maleza", nameFromBack: "Recoleccion de poda y maleza en via publica" },
    { id: 5, name: "Cuadrilla de Calles", nameFromBack: "Calles" },
    { id: 6, name: "Cuadrilla de Zoonosis", nameFromBack: "Zoonosis" }
];


export const getCuadrillaIdFromName = (nameFromBack: string): number => {
    const cuadrilla = cuadrillas.find(c => c.nameFromBack === nameFromBack || nameFromBack.includes(c.nameFromBack));
    return cuadrilla ? cuadrilla.id : 0;
}