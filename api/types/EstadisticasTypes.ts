// type para las estadisticas, usado en estadisticas generales de solicitudes
type EstadisticasSolicitudesGeneralResponse {
    cantSolicitudesEnProceso: number;
    cantSolicitudesResueltos: number;
    reclamosXSemanaResponse: ReclamosXSemanaResponse[];
}

type ReclamosXSemanaResponse = {
    fechaDesde: string;
    fechaHasta: string;
    cantidadResueltas: number;
}

// type estadisticas solicitudes por barrio
type EstadisticasSolicitudesXBarrioResponse = {
    zona: number;
    nombreBarrio: string;
    cantSolicitudesResueltas: number;
    cantSolicitudesEnProceso: number;
}

// type para las solicitudes por tipo
type EstadisticasSolicitudesXTipoResponse = {
    nombreTipoSolicitud: string;
    cantSolicitudesResueltas: number;
    cantSolicitudesEnProceso: number;
    estadisticasSolicitudesXSubTipo: EstadisticasSolicitudesXSubTipoResponse[];
}

type EstadisticasSolicitudesXSubTipoResponse = {
    idSubTipoSolicitud: number;
    nombreSubTipoSolicitud: number;
    cantSolicitudesResueltas: number;
    cantSolicitudesEnProceso: number;
    cantSolicitudesConCambioFoco?: number;
    cantSolicitudesConCambioFotocelula?: number;
    cantSolicitudesConCambioFusible?: number;
    cantSolicitudesConOtro?: number;
}


type EstadisticasPorVecinoResponse = {
    cantidadVecinosRegistrados: number;
    cantidadVecinosSolicitaron: number;
    vecinosMasSolicitaron: EstadisticasVecinoCantSolicitudesResponse[];
}

type EstadisticasVecinoCantSolicitudesResponse = {
    nombreVecino: string;
    apellidoVecino: string;
    dni: string;
    cantSolicitudesProceso?: number;
    cantSolicitudesResueltas?: number;
}