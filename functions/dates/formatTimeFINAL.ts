// func que se usa para formatear horas seleccionadas en el DateTimePicker, 
// por ejemplo se usa para crear una consulta ciudadana
export const formatTime = (d: Date): string =>
        `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;