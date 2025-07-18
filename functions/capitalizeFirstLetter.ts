// Función para capitalizar el nombre
export const capitalizeFirst = (str?: string): string => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
};

// Función para capitalizar el nombre y apellido
export const capitalizeAll = (str?: string) => {
    return str ? str.toUpperCase() : '';
};
