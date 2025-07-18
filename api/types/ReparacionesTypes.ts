type InformacionReparacionResponse = {
    id: number;
    nombreTipoReclamo: string;
    nombreBarrio: string;
    nombreTecnico1: string;
    apellidoTecnico1: string;
    nombreTecnico2?: string;
    apellidoTecnico2?: string;
    fechaArreglo: string;
    horaArreglo: string;
    observacionArreglo?: string;
    fotoArreglo?: string;
    nombrePoste?: string;
}

type CreateReparacionRequest = {
    tipoReclamoId: number;
    latitudReclamo?: number;
    longitudReclamo?: number;
    tecnico1Id: number;
    tecnico2Id?: number;
    fechaArreglo: string;
    horaArreglo: string;
    observacionArreglo?: string;
    fotoArreglo?: any;
    posteId?: number;
    idBarrio: number;
}