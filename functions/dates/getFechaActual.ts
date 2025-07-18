// esta funcion se usa en petitions para tomar automaticamente hora y fecha y enviarlas al back
const getFechaActual = (): {
    date: Date;
    timeString: string;
    mes: number;
    dia: number;
    año: number;
    dateLocalDate: string,
    timeStringSinSeconds: string,
    dateFormateadoComoBack: string
} => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dia = now.getDate();
    const año = now.getFullYear();
    const mes = now.getMonth() + 1;

    const d = String(now.getDate()).padStart(2, "0");
    const a = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");

    const timeString = `${hours}:${minutes}:${seconds}`;

    const fecha = {
        date: now,
        timeString: timeString,
        timeStringSinSeconds: `${hours}:${minutes}`,
        mes: mes,
        dia: dia,
        año: año,
        dateLocalDate: `${a}-${m}-${d}`,
        dateFormateadoComoBack: `${d}-${m}-${a}`
    };

    return fecha;
};

export default getFechaActual;
