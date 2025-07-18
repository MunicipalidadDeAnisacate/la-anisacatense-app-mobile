// type que envia el vecino al backend para generar una nueva solicitud
type CreateSolicitudRequest = {
    idVecino: number;
    idSubTipoReclamo: number;
    horaReclamo: string;
    fechaReclamo: string;
    idAnimal?: number;
    posteId?: number;
    idBarrio?: number;
    fotoReclamo?: any;
    observacionReclamo?: string;
    latitud?: number;
    longitud?: number;
}

// type usado por los tecnicos para cargar modificacion/actualizacion de solicitud
type UpdateSolicitudRequest = {
    idReclamo: number;
    idSubTipoReclamo: number;
    tecnico1Id: number;
    fechaArreglo: string;
    horaArreglo: string;
    tecnico2Id?: number;
    posteId?: number;
    tiposReparacionesIds?: number[];
    observacionArreglo?: string;
    fotografiaArreglo?: any;
}


// type usado en solicitudesVivero
type SolicitudViveroItemListResponse = {
    id: number;
    nombreSubTipoReclamo: string;
    nombreTipoReclamo: string;
    nombreEstado: string;
    nombreTecnico1?: string;
    apellidoTecnico1?: string;
    nombreTecnico2?: string;
    apellidoTecnico2?: string;
    fechaArreglo?: string;
    horaArreglo?: string;
    nombreVecino: string;
    apellidoVecino: string;
    dniVecino: string;
    fechaPrimerReclamo: string;
    horaPrimerReclamo: string;
}


// type usado en mis solicitudes del vecino
type MisSolicitudesResponse = {
    id: number;
    nombreTipoReclamo: string;
    nombreSubTipoReclamo: string;
    nombreEstadoReclamo: string;
    fechaReclamo: string;
    horaReclamo: string;
    // opcionales
    nombrePoste?: string;
    nombreAnimal?: string;
    fechaArreglo?: string;
    horaArreglo?: string;
    latitud?: number;
    longitud?: number;
    nombreBarrio?: string;
}


type SolicitudItemListResponse = {
    id: number;
    nombreSubTipoReclamo: string;
    nombreTipoReclamo: string;
    nombreEstado: string;
    fechaPrimerReclamo: string;
    horaPrimerReclamo: string;
    // opcional
    nombreBarrio?: string;
    nombrePoste?: string;
    nombreAnimal?: string;
    nombreTecnico1?: string;
    apellidoTecnico1?: string;
    nombreTecnico2?: string;
    apellidoTecnico2?: string;
    fechaArreglo?: string;
    horaArreglo?: string;
    nombreVecino?: string;
    apellidoVecino?: string;
}