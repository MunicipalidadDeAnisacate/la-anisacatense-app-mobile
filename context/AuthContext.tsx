import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginPetition, registerPetition } from '../api/petitions';
import { deleteTokens, getAccessToken, saveTokens } from '@/tokensStorage/tokenStorage';

interface AuthData {
  accessToken: string | null;
  rol: string | null;
  nombre: string | null;
  apellido: string | null;
  id: number | null;
  cuadrilla: string | null
}

interface LoginState {
  dni: string;
  password: string;
}

interface RegisterState {
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


export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({
    accessToken: null, rol: null, nombre: null, apellido: null, id: null, cuadrilla: null
  });

  // Carga inicial
  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (token) {
        const decoded = jwtDecode(token);
        setAuthData({ ...decoded, accessToken: token });
      }
    })();
  }, []);

  const login = async (credentials: LoginState) => {
    const data = await loginPetition(credentials);
    if (!data) return false;

    const { accessToken, refreshToken } = data;
    const decoded = jwtDecode(accessToken);
    setAuthData({ ...decoded, accessToken });
    await saveTokens(accessToken, refreshToken);
    return true;
  };

  const register = async (values: RegisterState) => {
    const data = await registerPetition(values);
    if (data.accessToken && data.refreshToken) {
      const decoded = jwtDecode(data.accessToken);
      setAuthData({ ...decoded, accessToken: data.accessToken });
      await saveTokens(data.accessToken, data.refreshToken);
      return true;
    }
    return data.success === false ? data.message : false;
  };

  const logout = async () => {
    setAuthData({ accessToken: null, rol: null, nombre: null, apellido: null, id: null, cuadrilla: null });
    await deleteTokens();
  };

  return (
    <AuthContext.Provider value={{
      authData, login, register, logout,
      isAuthenticated: !!authData.accessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);