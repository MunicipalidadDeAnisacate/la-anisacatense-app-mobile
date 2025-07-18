

export const validateEditDomicilioUser = (data: {
    barrioId: number | null;
    calle: string;
    numeroCalle: string;
    manzana: string;
    lote: string;
    ubicacionSeleccionada: { latitud: number, longitud: number } | null | undefined;
}): string[] => {
    const errors: string[] = [];
    
    if (!data.barrioId){
        errors.push('Debes seleccionar un barrio.');
    }

    if (!data.ubicacionSeleccionada || data.ubicacionSeleccionada == null) errors.push(`Debes fijar tu ubicación en el mapa.`);

    const calleNumValid = data.calle.trim().length > 0 && data.numeroCalle.trim().length > 0;
    const mzLtValid = data.manzana.trim().length > 0 && data.lote.trim().length > 0;
    if (!calleNumValid && !mzLtValid) {
        errors.push('Debes completar calle + número, o manzana + lote.');
    }

    return errors;
};