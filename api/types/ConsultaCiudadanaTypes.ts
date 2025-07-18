// Request del back para crear la eleccion
type CreateConsultaCiudadanaRequest = {
    titulo: string;
    descripcion: string;
    fechaInicio: string;
    horaInicio: string;
    fechaCierre: string;
    horaCierre: string;
    mostrarRecuento: boolean;
    proyectosId: number[];
}

// Response de item de consulta para flatlist o para ver desde informacion de proyecto
type ConsultaCiudadanaItemResponse = {
    id: number;
    titulo: string;
    fechaInicio: string;
    horaInicio: string;
    fechaCierre: string;
    horaCierre: string;
}


// informacion sobre consulta ciudadana accedida por el vecino
type InformacionConsultaCiudadanaActivaResponse = {
    id: number;
    titulo: string;
    proyectoIdVotado: number;
    mostrarRecuento: boolean;
    descripcion?: string;
    fechaInicio: string;
    horaInicio: string;
    fechaCierre: string;
    horaCierre: string;
    proyectos: ProyectoEnEleccionResponse[];
}