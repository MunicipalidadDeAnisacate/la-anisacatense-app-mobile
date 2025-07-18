import { obtenerNombreBarrio } from "@/constants/localizar";

// esta func se consume desde las cards de los vecinos, tecnicos y admins para ver informacion de sus 
// respectivas solicitudes
export const getNombreBarrio = (nombreBarrio: string|undefined, latitud: number|undefined, longitud: number|undefined): string => {
    if (!(nombreBarrio || (latitud && longitud))) {
        return "";
    } else if (nombreBarrio) {
        return nombreBarrio;
    } else if (latitud && longitud) {
        return obtenerNombreBarrio(latitud, longitud);
    }
    return "";
} 
