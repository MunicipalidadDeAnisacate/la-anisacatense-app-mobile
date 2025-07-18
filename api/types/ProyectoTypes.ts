// Request del back para crear proyecto
type CreateProyectoRequest = {
    titulo: string;
    descripcion: string;
    usuarioId: number;
    archivoUrl?: {
        uri: string;
        name: string;
        type: string;
    };
}


// Response del back para obtener listado de proyectos
type ProyectoResponse = {
    id: number;
    titulo: string;
    descripcion?: string;
    nombreEstado: string;
    nombreUsuario: string;
    dniUsuario: string;
}

// tipo interno que se usa para el proyecto seleccionado como variable de contexto
type ProyectoSeleccionado = {
    id: number;
    titulo: string;
}


// toda la informacion del proyecto cargado por el vecino traida desde el backend
type InformacionProyectoResponse = {
    id: number;
    titulo: string;
    descripcion?: string;
    archivoUrl?: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    dniUsuario: string;
    mailUsuario?: string;
    telefonoUsuario?: string;
    eleccionDeProyectoList?: ConsultaCiudadanaItemResponse[];
}


// tipo que se accede desde la consulta ciudadana activa, usado con InformacionEleccionActivaResponse
type ProyectoEnEleccionResponse = {
    id: number;
    titulo: string;
    descripcion: string;
    archivoUrl?: string;
    cantidad: number;
}

// se usa a la hora de votar, para poder marcar en tiempo real cuantas votaciones tiene
// cada proyecto
type ProyectoEnVotacionConRecuento = {
    id: number;
    titulo: string;
    votos: number;
}
type ProyectoEnVotacionSinRecuento = {
    id: number;
    titulo: string;
}