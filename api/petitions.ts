import axios from "axios";
import { BASE_URL, BASE_URL_WS } from "./urls";
import getFechaActual from "../functions/dates/getFechaActual";
import { router } from "expo-router";
import { Client } from '@stomp/stompjs';
import { deleteTokens, getAccessToken, getRefreshToken, saveTokens } from "@/tokensStorage/tokenStorage";


interface LoginState {
  dni: string;
  password: string;
}

interface RegisterValues {
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
  fechaNacimiento: Date;
  dni: string;
  password: string;
  barrio: number;
  nombreCalle: string;
  numeroCalle: string;
  manzana: string;
  lote: string;
  latitudeDomicilio: number;
  longitudeDomicilio: number;
}


export interface InfoReclamoLuminariaUsuario {
  nombreUsuario: string;
  apellidoUsuario: string;
  fechaReclamo: any;
  horaReclamo: any;
}

export interface PosteResponse {
  idPoste: number;
  nombrePoste: string;
  estadoPoste: number;
  latitude: number;
  longitude: number;
  idReclamo?: number;
  usuarios?: InfoReclamoLuminariaUsuario[];
}

export interface DecodedToken {
  apellido: string;
  id: number;
  nombre: string;
  rol: string;
}

export interface TecnicoResponse {
  id: number;
  nombre: string;
  apellido: string;
}

export interface VecinoResponse {
  dni: string;
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
  nombreCalle?: string;
  numeroCalle?: string;
  manzana?: string;
  lote?: string;
  fechaReclamo: any;
  horaReclamo: any;
}

export interface SolicitudesVariasResponse {
  id: number;
  nombreSubTipoReclamo: string;
  nroSubTipoReclamo: number;
  nombreTipoReclamo: string;
  latitudReclamo: number;
  longitudReclamo: number;
  nombreEstado: string;
  vecinoDtoList: VecinoResponse[];
}


export interface InformacionReclamo {
  reclamoId: number;
  nombreSubTipoReclamo: string;
  nroSubTipoReclamo: number;
  nombreEstado: string;
  nombreTipoReclamo: string;
  latitudReclamo?: number;
  longitudReclamo?: number;
  nombrePoste?: string;
  observacionReclamo?: string;
  fotoReclamo?: string;
  nombreBarrio: string;
  observacionArreglo?: string;
  fotoArreglo?: string;
  nombreAnimal?: string;
  nombreTecnico1?: string;
  apellidoTecnico1?: string;
  nombreTecnico2?: string;
  apellidoTecnico2?: string;
  horaArreglo?: string;
  fechaArreglo?: string;
  vecinos: VecinoResponse[];
  arreglosPoste?: string[];
}

export interface MisSolicitudesReparadas {
  id: number;
  nombrePoste?: string;
  nombreSubTipoReclamo: string;
  nombreTipoReclamo: string;
  fechaArreglo: any;
  horaArreglo: any;
  nombreEstadoReclamo: string;
  nombreTecnico1: string;
  apellidoTecnico1: string;
  nombreTecnico2: string;
  apellidoTecnico2: string;
  latitud?: number;
  longitud?: number;
  nombreBarrio?: string;
  nombreAnimal?: string;
}

export interface MisReparaciones {
  id: number;
  nombrePoste?: string;
  nombreTipoReclamo: string;
  nombreBarrio?: string;
  nombreAnimal?: string;
  latitud?: number;
  longitud?: number;
  fechaArreglo: any;
  horaArreglo: any;
  nombreTecnico1: number;
  apellidoTecnico1: number;
  nombreTecnico2?: number;
  apellidoTecnico2?: number;
}


// Crear instancia de axios
const apiClient = axios.create({
  baseURL: BASE_URL,
});


apiClient.interceptors.request.use(async (config) => {
  if (config.skipAuthInterceptor) return config;
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


apiClient.interceptors.response.use(
  res => res,
  async (err) => {
    const original = err.config;
    if (original.skipAuthInterceptor) return Promise.reject(err);

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        await saveTokens(data.accessToken, data.refreshToken || refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        await deleteTokens();
        router.push('/utilsPages/sesionCaducada');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);


export const loginPetition = async (state: LoginState): Promise<any> => {
  try {
    const response = await apiClient.post("/auth/login", state);

    if (!response.data.accessToken || !response.data.refreshToken) {
      throw new Error("No se recibieron los tokens");
    }

    return response.data;
  } catch (error) {
    console.error("Error en loginPetition: " + error);
    return null;
  }
};

// Función de registro
export const registerPetition = async (values: RegisterValues): Promise<any> => {
  const data = {
    nombre: values.nombre,
    apellido: values.apellido,
    mail: values.mail,
    telefono: values.telefono,
    fechaNacimiento: values.fechaNacimiento,
    dni: values.dni,
    password: values.password,
    barrioId: values.barrio,
    nombreCalle: values.nombreCalle,
    numeroCalle: values.numeroCalle,
    manzana: values.manzana,
    lote: values.lote,
    latitudeDomicilio: values.latitudeDomicilio,
    longitudeDomicilio: values.longitudeDomicilio,
  };

  try {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
    }
    return false;
  }
};


// funcion para verificar si el refresh token esta vigente, en caso de que no lo que pasa es que va a sesion caducada
export const verifyRefreshToken = async () => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) { return 200; }

  try {
    const response = await apiClient.get(`/auth/heartbeat`, {
      params: { refreshToken },
      skipAuthInterceptor: true,
    });

    return response.status;
  } catch (error) {
    console.error("Error verificando refresh token", error);
    return 400;
  }
}

export const getMailyTelefonoByDni = async (dni: string) => {
  try {
    const response = await apiClient.get(`/auth/mailstelefonos/${dni}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


export const verify = async (field: string, value: string): Promise<boolean | undefined> => {
  try {
    const response = await apiClient.get(`/auth/exists`, {
      params: { [field]: value },
      skipAuthInterceptor: true
    });
    return response.data.exists;
  } catch (error) {
    console.error("Error verificando existencia", error);
  }
}


// Función para obtener todos los postes de luz
export const getLucesVecino = async (idUsuario: number, idSubTipoReclamo: number): Promise<PosteResponse[]> => {

  try {
    const response = await apiClient.get<PosteResponse[]>(`/reclamos/vecino/luminarias/${idUsuario}/${idSubTipoReclamo}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


// Función para obtener todos los postes de luz - tecnico
export const getLucesTecnico = async (idSubTipoReclamo: number): Promise<PosteResponse[]> => {

  try {
    const response = await apiClient.get<PosteResponse[]>(`/reclamos/tecnico/luminarias/${idSubTipoReclamo}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


// Crea el reclamo
export const iniciarSolicitud = async (inputData: any): Promise<boolean> => {
  const fechaActual = getFechaActual();

  if (!inputData.idVecino || !inputData.idSubTipoReclamo) {
    console.error("Faltan parámetros obligatorios");
    return false;
  }

  // en caso de ser una solicitud de luminaria la ubicacion se asocia a un poste, en caso de 
  // ser una solicitud de vivero no se envia coordenadas ni posteId, en otros casos
  // se envian las coordenadas de la ubicacion que selecciono el vecino.
  const data: CreateSolicitudRequest = {
    idVecino: inputData.idVecino,
    idSubTipoReclamo: inputData.idSubTipoReclamo,
    idBarrio: inputData.idBarrio,
    horaReclamo: fechaActual.timeString,
    fechaReclamo: fechaActual.dateLocalDate,
    posteId: inputData.idPoste,
    fotoReclamo: inputData.fotoReclamo,
    latitud: inputData.latitud,
    longitud: inputData.longitud,
    observacionReclamo: inputData.observacionReclamo,
    idAnimal: inputData.idAnimal
  };

  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'fotoReclamo' && value) {
      form.append(key, {
        uri: value.uri,
        name: value.name || 'solicitud.jpg',
        type: value.type || 'image/jpeg'
      } as any);
    } else if (value !== null && value !== undefined) {
      form.append(key, String(value));
    }
  });

  try {
    await apiClient.post(`/reclamos/nuevo`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};


// Obtiene técnicos segun la cuadrilla
export const getTecnicos = async (tecnicoId: string, cuadrilla: string): Promise<TecnicoResponse[]> => {
  try {
    const response = await apiClient.get<TecnicoResponse[]>(`/usuarios/tecnicos/${tecnicoId}/${cuadrilla}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


// Finaliza el reclamo
export const setSolicitudToResuelta = async (repairDetails: any): Promise<boolean> => {
  const fechaActual = getFechaActual();

  const data: UpdateSolicitudRequest = {
    idReclamo: repairDetails.idReclamo,
    idSubTipoReclamo: repairDetails.idSubTipoReclamo,
    posteId: repairDetails.posteId,
    tecnico1Id: repairDetails.tecnico1Id,
    tecnico2Id: repairDetails.tecnico2Id,
    fechaArreglo: fechaActual.dateLocalDate,
    horaArreglo: fechaActual.timeString,
    tiposReparacionesIds: repairDetails.reparaciones,
    fotografiaArreglo: repairDetails.foto,
    observacionArreglo: repairDetails.observacion,
  };

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'fotografiaArreglo' && value) {
      formData.append(key, {
        uri: value.uri,
        name: value.name || 'arreglo.jpg',
        type: value.type || 'image/jpeg'
      } as any);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  try {
    await apiClient.patch(`/reclamos/finalizado`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};


// Obtiene los reclamos del vecino
export const getMisSolicitudesVecino = async (idVecino: number, page: number, size: number): Promise<any> => {
  try {
    const response = await apiClient.get(`/reclamos/vecino/mios/${idVecino}`, {
      params: { page, size }
    });

    if (response?.data?.solicitudes) {
      return response.data;
    } else {
      return { solicitudes: [], totalPages: 0 }
    }

  } catch (error) {
    console.error(error);
    return { solicitudes: [], totalPages: 0 }
  }
};


// Obtiene las solicitudes resueltas por el técnico
export const getMisSolicitudesResueltas = async (tecnicoId: number, page: number, size: number): Promise<any> => {

  try {
    const response = await apiClient.get(`/reclamos/tecnico/mios/${tecnicoId}`,
      { params: { page, size } }
    );

    if (response?.data?.solicitudesResueltas) {
      return response.data;
    } else {
      return { solicitudesResueltas: [], totalPages: 0 };
    }

  } catch (error) {
    console.error(error);
    return { solicitudesResueltas: [], totalPages: 0 }
  }
};


export const getSolicitudes = async (
  idSubTipoReclamo: number
): Promise<SolicitudesVariasResponse[]> => {

  try {
    const response = await apiClient.get<SolicitudesVariasResponse[]>(`/reclamos/tecnico/varias/activos/${idSubTipoReclamo}`);
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return [];
  }
};


export const getInformacionReclamo = async (idReclamo: number): Promise<InformacionReclamo | null> => {

  try {
    const response = await apiClient.get<InformacionReclamo>(`/reclamos/completo/${idReclamo}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return null;
  }
}


// Crea un arreglo/reparacion
export const postNewReparacion = async (newReparacion: any): Promise<boolean> => {
  const fechaActual = getFechaActual();

  const data: CreateReparacionRequest = {
    tipoReclamoId: newReparacion.tipoReclamoId,
    latitudReclamo: newReparacion.latitudReclamo,
    longitudReclamo: newReparacion.longitudReclamo,
    idBarrio: newReparacion.idBarrio,
    tecnico1Id: newReparacion.tecnico1Id,
    tecnico2Id: newReparacion.tecnico2Id,
    fechaArreglo: fechaActual.dateLocalDate,
    horaArreglo: fechaActual.timeString,
    observacionArreglo: newReparacion.observacionReparacion,
    fotoArreglo: newReparacion.fotoReparacion
  };

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'fotoArreglo' && value) {
      formData.append(key, {
        uri: value.uri,
        name: value.name || 'reparacion.jpg',
        type: value.type || 'image/jpeg'
      } as any);
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });


  try {
    await apiClient.post(`/reparaciones`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// func que devuelve los arreglos del tecnico, en "Mis Reparaciones"
export const getAllReparacionesByTecnico = async (tecnicoId: number, page: number, size: number): Promise<any> => {
  try {
    const response = await apiClient.get(`/reparaciones/mios/${tecnicoId}`,
      { params: { page, size } }
    );

    if (response?.data?.reparaciones) {
      return response.data;
    } else {
      return { reparaciones: [], totalPages: 0 }
    }

  } catch (error) {
    console.error("Error al obtener los arreglos:", error);
    return { reparaciones: [], totalPages: 0 }
  }
}


export const getInformacionReparacion = async (reparacionId: number): Promise<InformacionReparacionResponse | null> => {

  try {
    const response = await apiClient.get(`/reparaciones/informacion/${reparacionId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las reparacion: ", error);
    return null;
  }
}



export const createResetTokenMail = async (dni: string) => {
  const data = { dni: dni }
  try {
    await apiClient.post("/auth/mail/create-reset-token", data);
    return true;
  } catch (error) {
    console.error("Error creando token");
    return false;
  }
}

export const createResetTokenSMS = async (dni: string) => {
  const data = { dni: dni }
  try {
    await apiClient.post("/auth/sms/create-reset-token", data);
    return true;
  } catch (error) {
    console.error("Error creando token");
    return false;
  }
}


export const resetPassword = async (inputData: any) => {
  const data = {
    token: inputData.token,
    newPassword: inputData.newPassword
  }
  try {
    await apiClient.post("/auth/reset-password", data);
    return true
  } catch (error) {
    console.error(error)
    return false;
  }
}


export const createPoste = async (nuevoPoste: any) => {
  const fechaActual = getFechaActual();

  const data = {
    nombrePoste: nuevoPoste.nombrePoste,
    idBarrio: nuevoPoste.idBarrio,
    latitud: nuevoPoste.latitud,
    longitud: nuevoPoste.longitud,
    fechaCarga: fechaActual.date,
  }

  try {
    await apiClient.post("/postes", data)
    return true

  } catch (error) {
    console.error(error)
    return false;

  }
}


// funcion de tecnico solo para que pueda visualizar los postes ya creados a la hora de crear uno nuevo
export const getAllPostesSinFiltro = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/postes`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los postes:", error);
    return [];
  }
}


export const getAllSolicitudesXTipo = async (
  page: number,
  size: number,
  filters?: {
    barrioId?: number | null,
    tipoId?: number | null,
    subTipoId?: number | null,
    estadoId?: number | null,
    tecnicoId?: number | null,
    fechaReclamo?: number | null,
    fechaReparacion?: number | null
  }
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  if (filters?.tipoId) params.append('tipoId', filters.tipoId.toString());
  if (filters?.subTipoId) params.append('subTipoId', filters.subTipoId.toString());
  if (filters?.barrioId) params.append('barrioId', filters.barrioId.toString());
  if (filters?.estadoId) params.append('estadoId', filters.estadoId.toString());
  if (filters?.tecnicoId) params.append('tecnicoId', filters.tecnicoId.toString());
  if (filters?.fechaReclamo) params.append("fechaDesdeReclamo", filters.fechaReclamo.toString());
  if (filters?.fechaReparacion) params.append('fechaDesdeReparacion', filters.fechaReparacion.toString());
  if (filters?.fechaReclamo || filters?.fechaReparacion) params.append("today", getFechaActual().dateLocalDate.toString());

  try {
    const response = await apiClient.get(`/reclamos/list?${params.toString()}`);
    if (response?.data?.reclamos) {
      return response.data;
    } else {
      console.error("Respuesta inesperada:", response.data);
      return { reclamos: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return { reclamos: [], totalPages: 0 };
  }

};


export const getAllSolicitudesViveroXSubTipo = async (subTipoReclamoId: number, page: number, size: number) => {
  try {
    const response = await apiClient.get(`/reclamos/vivero/x/subtipo/list`, { params: { subTipoReclamoId, page, size } });
    if (response?.data?.solicitudes) {
      return response.data;
    } else {
      console.error("Respuesta inesperada:", response.data);
      return { solicitudes: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return { solicitudes: [], totalPages: 0 };
  }
}


export const findOneSolicitud = async (id: string) => {
  try {
    const response = await apiClient.get(`/reclamos/${parseInt(id)}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export const getAllUsuariosByRol = async (tipoUsuarioId: number, page: number, size: number) => {
  try {
    const response = await apiClient.get(`/usuarios/roles/${tipoUsuarioId}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return { usuarios: [], totalPages: 0 };
  }
};


export const findOneUsuario = async (dni: string): Promise<UsuariosItemResponse> => {
  try {
    const response = await apiClient.get(`/usuarios/${dni}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuario")
    return null;
  }
}

export const findUsuarioById = async (id: number): Promise<UsuariosItemResponse> => {
  try {
    const response = await apiClient.get(`/usuarios/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuario")
    return null;
  }
}


export const getDomicilioUsuario = async (id: number): Promise<UsuarioDomicilioResponse> => {
  try {
    const response = await apiClient.get(`/usuarios/domicilio/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo domicilio de usuario");
    return null;
  }
}


export const patchUsuarioByAdmin = async (usuario: any): Promise<boolean> => {
  const data = {
    id: usuario.id,
    newDni: usuario.newDni,
    newPassword: usuario.newPassword,
    newNombre: usuario.newNombre,
    newApellido: usuario.newApellido,
    tipoUsuarioId: usuario.tipoUsuarioId,
    cuadrillaId: usuario.cuadrillaId,
    newMail: usuario.newMail,
    newTelefono: usuario.newTelefono,
    newFechaNacimiento: usuario.newFechaNacimiento,
    barrioId: usuario.barrioId,
    newNombreCalle: usuario.newNombreCalle,
    newNumeroCalle: usuario.newNumeroCalle,
    newManzana: usuario.newManzana,
    newLote: usuario.newLote
  }

  try {
    await apiClient.patch(`/usuarios/admin/edit`, data);
    return true;
  } catch (error) {
    console.error("Error editando usuario")
    return false;
  }
}

export const createUsuarioByAdmin = async (usuario: any): Promise<any> => {
  const data = {
    dni: usuario.dni,
    password: usuario.password,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    tipoUsuarioId: usuario.tipoUsuarioId,
    cuadrillaId: usuario.cuadrillaId,
    mail: usuario.mail,
    telefono: usuario.telefono,
    fechaNacimiento: usuario.fechaNacimiento,
    barrioId: usuario.barrioId,
    nombreCalle: usuario.nombreCalle,
    numeroCalle: usuario.numeroCalle,
    manzana: usuario.manzana,
    lote: usuario.lote
  }

  try {
    await apiClient.post(`/usuarios`, data);
    return true;
  } catch (error) {
    console.error("Error creando usuario")
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
    }
    return false;
  }
}


export const patchUsuario = async (usuario: UpdateUsuarioPerfilRequest): Promise<boolean> => {
  const data = {
    id: usuario.id,
    newNombre: usuario.newNombre,
    newApellido: usuario.newApellido,
    newMail: usuario.newMail,
    newTelefono: usuario.newTelefono,
    newFechaNacimiento: usuario.newFechaNacimiento,
  }
  try {
    await apiClient.patch(`/usuarios/perfil/edit`, data);
    return true;
  } catch (error) {
    console.error("Error editando usuario")
    return false;
  }
}


export const patchDomicilioUsuario = async (usuario: UpdateUsuarioDomicilioRequest): Promise<boolean> => {
  const data: UpdateUsuarioDomicilioRequest = {
    id: usuario.id,
    barrioId: usuario.barrioId,
    newCalle: usuario.newCalle,
    newNumeroCalle: usuario.newNumeroCalle,
    newManzana: usuario.newManzana,
    newLote: usuario.newLote,
    newLatitudDomicilio: usuario.newLatitudDomicilio,
    newLongitudDomicilio: usuario.newLongitudDomicilio
  }
  try {
    await apiClient.patch(`/usuarios/domicilio/edit`, data);
    return true;
  } catch (error) {
    console.error("Error editando usuario")
    return false;
  }
}


export const patchContrasenaUsuario = async (data: UpdateUsuarioContrasenaRequest): Promise<any> => {
  try {
    await apiClient.patch(`/usuarios/contrasena/edit`, data);
    return true;
  } catch (error) {
    console.error("Error editando contraseña");
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
    }
    return false;
  }
}


export const getAllTecnicos = async (): Promise<TecnicoResponse[]> => {
  try {
    const response = await apiClient.get<TecnicoResponse[]>(`/usuarios/tecnicos`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


export const deleteUsuario = async (eliminadorId: number, eliminadoId: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/usuarios/${eliminadorId}/${eliminadoId}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


export const getEstadisticasSolicitudes = async (): Promise<EstadisticasSolicitudesGeneralResponse | null> => {
  const fechaDesde = getFechaActual().dateLocalDate;

  try {
    const response = await apiClient.get(`/estadisticas/solicitudes/generales`, { params: { today: fechaDesde, numSemanas: 4 } });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getEstadisticasSolicitudesDesde = async (numSemanas: number): Promise<ReclamosXSemanaResponse[]> => {
  const fechaDesde = getFechaActual().dateLocalDate;

  try {
    const response = await apiClient.get(`/estadisticas/solicitudes/generales/desde`, { params: { today: fechaDesde, numSemanas: numSemanas } });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}


export const getEstadisticasXBarrio = async (tipo: any, subtipo: any): Promise<EstadisticasSolicitudesXBarrioResponse[]> => {
  let url: string = "";
  if (tipo && subtipo) {
    url = `/estadisticas/solicitudes/barrios/${tipo}/${subtipo}`;
  } else if (tipo && !subtipo) {
    if (tipo === "0") {
      return [];
    }
    url = `/estadisticas/solicitudes/barrios/${tipo}`;
  } else {
    url = `/estadisticas/solicitudes/barrios`;
  }

  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}


export const getEstadisticasSolicitudesXTipo = async (): Promise<EstadisticasSolicitudesXTipoResponse[] | null> => {

  try {
    const response = await apiClient.get(`/estadisticas/solicitudes/tipos`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}


export const getEstadisticasSolicitudesLuminariaDesde = async (diasAntes: number): Promise<EstadisticasSolicitudesXSubTipoResponse | null> => {
  const fechaDesde = getFechaActual().dateLocalDate;
  try {
    const response = await apiClient.get(`/estadisticas/solicitudes/tipos/alumbrado`, { params: { diasAntes: diasAntes, fechaDesde: fechaDesde } });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export const getEstadisticasSolicitudesXVecino = async (): Promise<EstadisticasPorVecinoResponse | null> => {
  try {
    const response = await apiClient.get(`/estadisticas/usuarios/solicitudes`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export const getAllReparaciones = async (page: number, size: number): Promise<MisReparaciones[]> => {
  try {
    const response = await apiClient.get(`/reparaciones`, { params: { page, size } });
    if (response?.data?.reparaciones) {
      return response.data;
    } else {
      return { reparaciones: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Error al obtener los reparaciones:", error);
    return { reparaciones: [], totalPages: 0 };
  }
}


export const getAllReparacionesXTipo = async (
  page: number,
  size: number,
  filters?: {
    barrioId?: number | null,
    tipoId?: number | null,
    tecnicoId?: number | null,
    fechaDesde?: number | null
  }
): Promise<{ reparaciones: MisReparaciones[], totalPages: number }> => {

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  if (filters?.barrioId) params.append('barrioId', filters.barrioId.toString());
  if (filters?.tipoId) params.append('tipoId', filters.tipoId.toString())
  if (filters?.tecnicoId) params.append('tecnicoId', filters.tecnicoId.toString());
  if (filters?.fechaDesde) params.append('fechaDesdeReparacion', filters.fechaDesde.toString())
  if (filters?.fechaDesde) params.append("today", getFechaActual().dateLocalDate.toString());

  try {
    const response = await apiClient.get(`/reparaciones/x/tipo?${params.toString()}`);
    if (response?.data?.reparaciones) {
      return response.data;
    } else {
      return { reparaciones: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Error al obtener los reparaciones:", error);
    return { reparaciones: [], totalPages: 0 };
  }
}


export const findOneReparacion = async (id: string) => {
  try {
    const response = await apiClient.get(`/reparaciones/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo reparacion")
    return null;
  }
}


export const getAllProyectos = async (page: number, size: number):
  Promise<{ proyectos: ProyectoResponse[], totalPages: number }> => {

  try {
    const response = await apiClient.get(`/proyectos`, { params: { page, size } });

    if (response?.data?.proyectos) {
      return response.data;
    } else {
      return { proyectos: [], totalPages: 0 };
    }

  } catch {
    console.error("Error cargando proyectos.")
    return { proyectos: [], totalPages: 0 };
  }

}


export const createNewProyecto = async (
  data: CreateProyectoRequest
): Promise<boolean> => {
  try {
    const form = new FormData();
    form.append("titulo", data.titulo);
    form.append("descripcion", data.descripcion);
    form.append("usuarioId", String(data.usuarioId));

    if (data.archivoUrl) {
      form.append("archivoUrl", {
        uri: data.archivoUrl.uri,
        name: data.archivoUrl.name,
        type: data.archivoUrl.type,
      } as any);
    }

    await apiClient.post("/proyectos", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return true;
  } catch (err) {
    console.error("Error cargando proyecto:", err);
    return false;
  }
};


export const getInformacionProyecto = async (id: number): Promise<InformacionProyectoResponse> => {
  try {
    const response = await apiClient.get(`/proyectos/${id}`);
    return response.data;
  } catch {
    console.error("Error cargando proyecto.")
    return null;
  }
}


export const deleteProyecto = async (proyectoId: number): Promise<boolean> => {
  const today = getFechaActual().dateLocalDate;
  try {
    await apiClient.delete(`/proyectos/${proyectoId}`, { params: { today } });
    return true
  } catch (err) {
    console.error("Error eliminando proyecto: ", err);
    return false;
  }
}


export const createNewConsultaCiudadana = async (consulta: CreateConsultaCiudadanaRequest): Promise<boolean> => {
  try {
    await apiClient.post(`/consultasciudadanas`, consulta);
    return true;
  } catch {
    console.error("Error cargando consulta.")
    return false;
  }
}


export const getConsultasCiudadanasActivas = async (): Promise<ConsultaCiudadanaItemResponse[]> => {
  const fechaActual = getFechaActual();
  const today = fechaActual.dateLocalDate;
  const now = fechaActual.timeString;

  try {
    const response = await apiClient.get(`/consultasciudadanas/activas`, { params: { today, now } });
    return response.data;
  } catch {
    console.error("Error cargando consultas activas.")
    return [];
  }
}


export const getAllConsultasCiudadanas = async (page: number, size: number): Promise<{ consultas: ConsultaCiudadanaItemResponse[], totalPages: number }> => {
  try {
    const response = await apiClient.get(`/consultasciudadanas/all`, { params: { page, size } });
    if (response?.data?.consultas) {
      return response.data;
    } else {
      return { consultas: [], totalPages: 0 };
    }
  } catch {
    console.error("Error cargando consultas activas.")
    return { consultas: [], totalPages: 0 };
  }
}


export const getInformacionConsultaCiudadana = async (id: number, usuarioId: number): Promise<InformacionConsultaCiudadanaActivaResponse | null> => {
  try {
    const response = await apiClient.get(`/consultasciudadanas/activas/${id}/${usuarioId}`);
    return response.data;
  } catch {
    console.error("Error cargando consulta.")
    return null;
  }
}


export const getInformacionConsultaCiudadanaAdmin = async (id: number): Promise<InformacionConsultaCiudadanaActivaResponse | null> => {
  try {
    const response = await apiClient.get(`/consultasciudadanas/informacion/${id}`);
    return response.data;
  } catch {
    console.error("Error cargando consulta.")
    return null;
  }
}


export const patchModificarConsulta = async (id: number): Promise<boolean> => {
  try {
    await apiClient.patch(`/consultasciudadanas/mostrarrecuento/${id}`);
    return true;
  } catch {
    console.error("Error modificando consulta.");
    return false;
  }
}


export const patchCerrarConsulta = async (id: number): Promise<boolean> => {
  const fechaActual = getFechaActual();
  const today = fechaActual.dateLocalDate;
  const now = fechaActual.timeString;

  try {
    await apiClient.patch(`/consultasciudadanas/cerrar/${id}`, null, { params: { today, now } });
    return true;
  } catch {
    console.error("Error modificando consulta.");
    return false;
  }
}


export const postPreferencia = async (consultaId: number, proyectoId: number, usuarioId: number): Promise<boolean> => {
  const fechaActual = getFechaActual();

  const data: PreferenciaRequest = {
    consultaId: consultaId,
    proyectoId: proyectoId,
    usuarioId: usuarioId,
    fecha: fechaActual.dateLocalDate,
    hora: fechaActual.timeString
  }

  try {
    await apiClient.post(`${BASE_URL}/preferencias`, data);
    return true;
  } catch {
    console.error("Error cargando preferencia.")
    return false;
  }
}


export function subscribeResultadosConsultaWS(
  consultaId: number,
  onUpdate: (proyectos: { id: number; cantidad: number }[]) => void
): () => void {
  const client = new Client({
    webSocketFactory: () => new WebSocket(`${BASE_URL_WS}/ws`),
    debug: msg => console.debug('[STOMP]', msg),
    reconnectDelay: 5000,
    connectionTimeout: 15000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 0,
    logRawCommunication: true,
    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true,
  });

  client.onConnect = (frame) => {
    const subscription = client.subscribe(
      `/topic/consulta/${consultaId}`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          onUpdate(data.proyectos.map(p => ({
            id: p.id,
            cantidad: p.cantidad
          })));
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    );
  };

  // iniciar conexión
  client.activate();

  // función de limpieza para desuscribirse
  return () => {
    client.deactivate().catch(error => {
      console.error("Error al desconectar:", error);
    });
  };
}