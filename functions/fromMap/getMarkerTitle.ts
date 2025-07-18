export const getMarkerTitle = (rol: string, estadoPoste: number, nombrePoste: string): string => {
    if (rol === "tecnico") {
      if (estadoPoste === 1) {
        return `Poste operativo: ${nombrePoste}`;
      } else if (estadoPoste === 2) {
        return `Solicitud recibida, poste: ${nombrePoste}`;
      }
    } else if (rol === "vecino") {
      if (estadoPoste === 1) {
        return `Solicitar reparación de poste número: ${nombrePoste}`;
      } else if (estadoPoste === 2) {
        return `Reparación en curso para el poste: ${nombrePoste}`;
      }
    }
    return `Poste desconocido: ${nombrePoste}`;
  };