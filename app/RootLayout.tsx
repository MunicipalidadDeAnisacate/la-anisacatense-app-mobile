import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { principalColorAdmin, principalColorTecnico, principalColorVecino } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';


export default function RootLayout() {
  const { authData } = useAuth();

  let headerBg = principalColorVecino;
  if (authData.rol === "tecnico") {
    headerBg = principalColorTecnico;
  } else if (authData.rol === "admin") {
    headerBg = principalColorAdmin;
  }

  const esTecnico = authData.rol === "tecnico";

  return (
    <>
      <StatusBar
        style='auto'
        translucent={true}
      />

      <Stack
        initialRouteName="auth/login"
        screenOptions={() => {

          return {
            headerStyle: {
              backgroundColor: headerBg,
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: 'white',
          };
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerTitleAlign: 'center', title: 'Municipalidad de Anisacate' }} />
        <Stack.Screen name="auth/resetPassword" options={{ headerBackVisible: false, headerTitleAlign: 'center', title: 'Olvide mi contraseña' }} />

        <Stack.Screen name="menuVecino/menuPrincipal" options={{ headerBackButtonMenuEnabled: false, headerTitleAlign: 'center', title: 'Municipalidad de Anisacate', headerBackVisible: false }} />
        <Stack.Screen name="menuVecino/menuTipoSolicitud" options={{ headerTitleAlign: 'center', title: 'Nueva Solicitud' }} />
        <Stack.Screen name="menuVecino/menuSubTipoSolicitud" options={{ headerTitleAlign: 'center', title: 'Nueva Solicitud' }} />
        <Stack.Screen name="menuVecino/menuMiPerfil" options={{ headerTitleAlign: 'center', title: 'Mi Perfil' }} />
        <Stack.Screen name="utilsPages/informacionContactoSolicitud" options={{ headerTitleAlign: 'center', title: 'Municipalidad de Anisacate' }} />
        <Stack.Screen name="maps/mapaLuminaria" options={{ headerTitleAlign: 'center', title: esTecnico ? "Solicitudes de Luminaria" : "Nueva Solicitud", headerShadowVisible: false }} />
        <Stack.Screen name="maps/mapaSolicitudesVarias" options={{ headerTitleAlign: 'center', title: 'Nueva Solicitud' }} />
        <Stack.Screen name="solicitudesForms/solicitudForm" options={{ headerTitleAlign: 'center', title: 'Enviar Solicitud' }} />
        <Stack.Screen name="misSolicitudesVecino/misSolicitudes" options={{ headerTitleAlign: 'center', title: 'Mis solicitudes' }} />
        <Stack.Screen name="maps/mapaCualEsMiBarrio" options={{ headerTitleAlign: 'center', title: 'Cual es mi Barrio?' }} />
        <Stack.Screen name="proyectoCiudadano/nuevoProyecto" options={{ headerTitleAlign: 'center', title: 'Comparte tu Proyecto' }} />
        <Stack.Screen name="consultaCiudadana/consultaCiudadana" options={{ headerTitleAlign: 'center', title: 'Consulta Ciudadana' }} />
        <Stack.Screen name="consultaCiudadana/informacionConsultaCiudadanaVecino" options={{ headerTitleAlign: 'center', title: 'Consulta Ciudadana' }} />
        <Stack.Screen name="miPerfil/editarMiPerfil" options={{ headerBackVisible: false, headerBackButtonMenuEnabled: false, headerTitleAlign: 'center', title: 'Mis datos' }} />
        <Stack.Screen name="miPerfil/editarMiDomicilio" options={{ headerBackVisible: false, headerBackButtonMenuEnabled: false, headerTitleAlign: 'center', title: 'Mi domicilio' }} />
        <Stack.Screen name="miPerfil/editarMiContrasena" options={{ headerBackVisible: false, headerBackButtonMenuEnabled: false, headerTitleAlign: 'center', title: 'Mi domicilio' }} />
        <Stack.Screen name="solicitudesForms/solicitudVivero" options={{ headerBackVisible: false, headerBackButtonMenuEnabled: false, headerTitleAlign: 'center', title: 'Confirmar Reserva' }} />
        <Stack.Screen name="utilsPages/informacionViveros" options={{ headerBackVisible: false, headerBackButtonMenuEnabled: false, headerTitleAlign: 'center', title: 'Reserva confirmada' }} />

        <Stack.Screen name="menuTecnico/menuPrincipalTecnico" options={{ headerBackVisible: false, headerTitleAlign: 'center', title: 'Municipalidad de Anisacate' }} />
        <Stack.Screen name="menuTecnico/menuTipoSolicitudTecnico" options={{ headerTitleAlign: 'center', title: 'Menú' }} />
        <Stack.Screen name="menuTecnico/menuSubTipoSolicitudTecnico" options={{ headerTitleAlign: 'center', title: 'Menú' }} />
        <Stack.Screen name="actividadTecnico/misReparaciones" options={{ headerTitleAlign: 'center', title: 'Mis Reparaciones' }} />
        <Stack.Screen name="actividadTecnico/misSolicitudesResueltas" options={{ headerTitleAlign: 'center', title: 'Mis Solicitudes Resueltas' }} />
        <Stack.Screen name="solicitudesForms/newSolutionPage" options={{ headerBackVisible: false, headerTitleAlign: 'center', title: 'Nueva Reparación' }} />
        <Stack.Screen name="maps/mapaReparacionNuevo" options={{ headerTitleAlign: 'center', title: esTecnico ? 'Mapa de Técnicos' : "Mapa" }} />
        <Stack.Screen name="maps/mapaSolicitudesVariasTecnico" options={{ headerTitleAlign: 'center', title: 'Mapa de Solicitudes' }} />
        <Stack.Screen name="actividadTecnico/solicitudesVivero" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Reservas de Vivero' }} />


        <Stack.Screen name="menuAdmin/menuPrincipalAdmin" options={{ headerBackVisible: false, headerTitleAlign: 'center', title: 'Menú de Administrador' }} />
        <Stack.Screen name="admin/usuarios/menuDeUsuarios" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Administrar Usuarios' }} />
        <Stack.Screen name="admin/usuarios/operacionesSobreUsuarios" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Operaciones Sobre Usuarios' }} />
        <Stack.Screen name="admin/usuarios/usuarios" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Ver Usuarios' }} />
        <Stack.Screen name="admin/usuarios/usuarioEditForm" options={{ headerBackVisible: false, headerTitleAlign: 'center', title: 'Formulario Edicion de Usuario' }} />
        <Stack.Screen name="admin/usuarios/usuarioCreateForm" options={{ headerBackVisible: false, headerTitleAlign: 'center', title: 'Formulario Creacion de Usuario' }} />
        <Stack.Screen name="admin/usuarios/usuarioActivity" options={{ headerBackVisible: true, headerShadowVisible: false, headerTitleAlign: 'center', title: 'Actividad de Usuario' }} />
        <Stack.Screen name="admin/usuarios/tecnicos/tecnicoActivitySolicitudes" options={{ headerBackVisible: true, headerShadowVisible: false, headerTitleAlign: 'center', title: 'Solicitudes Resueltas' }} />
        <Stack.Screen name="admin/usuarios/tecnicos/tecnicoActivityReparaciones" options={{ headerBackVisible: true, headerShadowVisible: false, headerTitleAlign: 'center', title: 'Reparaciones de Tecnico' }} />
        <Stack.Screen name="admin/reparaciones/reparaciones" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Reparaciones' }} />
        <Stack.Screen name="admin/solicitudes/solicitudInfoAdmin" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Información de Solicitud' }} />
        <Stack.Screen name="admin/solicitudes/solicitudesXTipo" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: esTecnico ? 'Solicitudes de Vecinos' : 'Solicitudes Por Tipo' }} />
        <Stack.Screen name="admin/estadisticas/menuDeEstadisticas" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Ver Estadísticas' }} />
        <Stack.Screen name="admin/estadisticas/estadisticasSolicitudes" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Estadísticas de Solicitudes' }} />
        <Stack.Screen name="admin/estadisticas/estadisticasXBarrio" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Estadísticas por Barrios' }} />
        <Stack.Screen name="admin/estadisticas/estadisticasXVecino" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Estadísticas por Vecinos' }} />
        <Stack.Screen name="admin/estadisticas/estadisticasSolicitudesXTipo" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Estadísticas por Tipos' }} />
        <Stack.Screen name="admin/proyectoCiudadanoAdmin/menuProyectoCiudadano" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Menú de Proyectos' }} />
        <Stack.Screen name="admin/proyectoCiudadanoAdmin/proyectos" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Ver Proyectos' }} />
        <Stack.Screen name="admin/consultaCiudadana/menuConsultaCiudadana" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Menú de Consultas' }} />
        <Stack.Screen name="admin/consultaCiudadana/nuevaConsultaCiudadana" options={{ headerBackVisible: false, headerTitleAlign: 'center', title: 'Nueva Consulta' }} />
        <Stack.Screen name="admin/proyectoCiudadanoAdmin/proyectosSeleccionables" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Seleccione los Proyectos' }} />
        <Stack.Screen name="admin/proyectoCiudadanoAdmin/informacionProyecto" options={{ headerBackVisible: true, headerTitleAlign: 'center', title: 'Información de Proyecto' }} />
        <Stack.Screen name="admin/consultaCiudadana/informacionConsultaCiudadanaAdmin" options={{ headerTitleAlign: 'center', title: 'Consulta Ciudadana' }} />
        <Stack.Screen name="admin/consultaCiudadana/consultasCiudadanas" options={{ headerTitleAlign: 'center', title: 'Consultas Ciudadanas' }} />

        <Stack.Screen name="informacionSolicitud/informacionSolicitudCompleta" options={{ headerBackVisible: true, headerShadowVisible: false, headerTitleAlign: 'center', title: 'Información de Solicitud' }} />
        <Stack.Screen name="informacionSolicitud/informacionSolicitudFromMap" options={{ headerBackVisible: true, headerShadowVisible: false, headerTitleAlign: 'center', title: 'Información de Solicitud' }} />
        <Stack.Screen name="informacionReparacion/informacionReparacion" options={{ headerTitleAlign: 'center', title: 'Información de Reparación' }} />

        <Stack.Screen name="utilsPages/sesionCaducada" options={{ headerShown: false }} />
        <Stack.Screen name="utilsPages/cartaPresentacion" options={{  headerTitleAlign: 'center', title: 'Carta de Presentación' }} />
      </Stack>
    </>
  );
}