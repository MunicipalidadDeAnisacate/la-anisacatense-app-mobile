export const tiposUsuarios = [
    { id: 1, name: "Vecino", nameFromBack: "vecino" },
    { id: 2, name: "Técnico", nameFromBack: "tecnico" },
    { id: 3, name: "Administrador", nameFromBack: "admin" }
];

export const getTipoUsuarioIdFromName = (nameFromBack: string): number => {
    const tipoUsuario = tiposUsuarios.find(tu => tu.nameFromBack === nameFromBack);
    return tipoUsuario ? tipoUsuario.id : 0;
}

export const getTipoUsuarioName = (id: number): string => {
    const tipoUsuario = tiposUsuarios.find(tu => tu.id === id);
    return tipoUsuario ? tipoUsuario.name : "";
}