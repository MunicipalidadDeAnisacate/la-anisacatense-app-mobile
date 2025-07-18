# 📱 La Anisacatense

Aplicación móvil oficial de la Municipalidad de Anisacate, desarrollada con **Expo** y **React Native**, disponible para **iOS** y **Android**.

Permite a los vecinos:
- Realizar solicitudes de reparación en servicios públicos.
- Consultar el estado de sus reclamos.
- Recibir notificaciones vía SMS al ser resueltos.
- Participar en proyectos de consulta ciudadana.

También cuenta con un módulo interno para el personal municipal.


## 🚀 Requisitos

- Node.js (versión recomendada: 18 o superior)
- Expo CLI  
  ```bash
  npm install -g expo-cli
  ```


## ⚙️ Configuración

Crear un archivo .env en la raíz del proyecto con las siguientes variables:

   ```bash
   EXPO_PUBLIC_HTTPS_API_URL=https://tuservidor/api
   EXPO_PUBLIC_WSS_API_URL=wss://tuservidor/ws
   ```


## ▶️ Cómo iniciar la app
1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:

   ```bash
   npx expo start
   ```

3. Escanear el QR con la app Expo Go en tu dispositivo para abrir la app.


## 🛠️ Tecnologías
- React Native
- Expo
- TypeScript
- Compatible con iOS y Android