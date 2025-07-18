// type para obtener datos para el usuario que quiere editarse, lo usa el admin para editar
type UsuariosItemResponse = {
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    nombreTipoUsuario: string;
    nombreCuadrilla: string;
    mail: string;
    telefono: string;
    fechaNacimiento: string;
    nombreBarrio: string;
    nombreCalle: string;
    numeroCalle: string;
    manzana: string;
    lote: string;
}

// type usado para cuando el usuario se edita a el mismo
type UpdateUsuarioPerfilRequest = {
    id: number;
    newNombre: string;
    newApellido: string;
    newMail: string;
    newTelefono: string;
    newFechaNacimiento: string;
}

// type usado para cuando el usuario quiere editarse el mismo su domicilio
type UsuarioDomicilioResponse = {
    barrioId: number;
    calle: string;
    numeroCalle: string;
    manzana: string;
    lote: string;
    latitudDomicilio: number;
    longitudDomicilio: number;
}

// type usado par aenviar al backend los datos de domicilio editados por el vecino
type UpdateUsuarioDomicilioRequest = {
    id: number;
    barrioId: number;
    newCalle?: string;
    newNumeroCalle?: string;
    newManzana?: string;
    newLote?: string;
    newLatitudDomicilio: number;
    newLongitudDomicilio: number;
}


type UpdateUsuarioContrasenaRequest = {
    id: number;
    oldPassword: string;
    newPassword: string;
}