// tipo que necesita el backend para cargar el voto en una consulta ciudadana
type PreferenciaRequest = {
    consultaId: number;
    proyectoId: number;
    usuarioId: number;
    fecha: string;
    hora: string;
}