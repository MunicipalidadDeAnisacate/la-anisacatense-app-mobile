const problemaConLuminariaImg = require("../../assets/images/menu/problemaConLuminaria.png");
const posteRotoImg = require("../../assets/images/menu/posteRoto.png");
const calleEnMalEstado = require("../../assets/images/menu/calleEnMalEstado.png");
const lomada = require("../../assets/images/menu/lomada.png");
const sinRecoleccion = require("../../assets/images/menu/sinRecoleccion.png");
const solicitudDePoda = require("../../assets/images/menu/solicitudDePoda.png");
const reparacion = require("../../assets/images/menu/Reparacion.png");
const corteDeAgua = require("../../assets/images/menu/CorteDeAgua.png");
const yuyosYMaleza = require("../../assets/images/menu/yuyosYMaleza.png");
const problemaConCable = require("../../assets/images/menu/problemaConCable.png");
const ruidosMolestos = require("../../assets/images/menu/ruidosMolestos.png");
const animalesSueltos = require("../../assets/images/menu/animalesSueltos.png");
const desmonte = require("../../assets/images/menu/desmonte.png");
const desperdicios = require("../../assets/images/menu/desperdicios.png");
const conexionIncumplida = require("../../assets/images/menu/conexion-domiciliaria.png");
const residuosSecos = require("../../assets/images/menu/residuos-secos.png");
const loteMalEstado = require("../../assets/images/menu/lote-mal-estado.png");
const castracion = require("../../assets/images/menu/castracion.png");
const reservaDeSemillas = require("../../assets/images/menu/semillas.png");
const reservaDeArbol = require("../../assets/images/menu/arbol.png");

const calleEnMalEstado2 = require("../../assets/images/mapa/calleEnMalEstado.png");
const lomada2 = require("../../assets/images/mapa/lomada.png");
const sinRecoleccion2 = require("../../assets/images/mapa/sinRecoleccion.png");
const solicitudDePoda2 = require("../../assets/images/mapa/solicitudDePoda.png");
const reparacion2 = require("../../assets/images/mapa/Reparacion.png");
const corteDeAgua2 = require("../../assets/images/mapa/CorteDeAgua.png");
const yuyosYMaleza2 = require("../../assets/images/mapa/yuyosYMaleza.png");
const problemaConCable2 = require("../../assets/images/mapa/problemaConCable.png");
const ruidosMolestos2 = require("../../assets/images/mapa/ruidosMolestos.png");
const animalesSueltos2 = require("../../assets/images/mapa/animalesSueltos.png");
const desmonte2 = require("../../assets/images/mapa/desmonte.png");
const desperdicios2 = require("../../assets/images/mapa/desperdicios.png");
const residuosSecos2 = require("../../assets/images/mapa/residuos-secos.png");


export type SubTipoSolicitud = {
    id: number;
    title: string;
    image: any;
    route: string;
    imageMini?: any;
    description?: string;
    description2?: string;
    link?: string;
    type?: string;
    soloVecino: boolean;
};


export const subTiposDeSolicitud: SubTipoSolicitud[] = [
    {
        id: 1,
        title: "Problema en Alumbrado",
        image: problemaConLuminariaImg,
        route: "/maps/mapaLuminaria",
        description: "Incluye foco apagado, encendido 24hs, titilando o inconvenientes con el brazo del alumbrado en la vía pública. No implica la colocación de nuevas luminarias.",
        soloVecino: false
    },
    {
        id: 2,
        title: "Problema con poste",
        image: posteRotoImg,
        route: "/maps/mapaLuminaria",
        description: "Incluye postes o columnas caídas o con riesgo de caída, columnas electrificadas o tapas abiertas en la vía pública.",
        soloVecino: false
    },
    {
        id: 10,
        title: "Problema con cable",
        image: problemaConCable,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: problemaConCable2,
        description: "Cables eléctricos sueltos que representen un riesgo potencial de seguridad.",
        soloVecino: false
    },
    {
        id: 3,
        title: "Calle en mal estado",
        image: calleEnMalEstado,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: calleEnMalEstado2,
        description: "Baches o agrietamientos importantes en calles pavimentadas o de tierra.",
        soloVecino: false
    },
    {
        id: 4,
        title: "Solicitud de lomada",
        image: lomada,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: lomada2,
        description: "Si considera que una calle necesita una lomada para mejorar la seguridad vial, siga estos pasos para solicitar su construcción.",
        soloVecino: false
    },
    {
        id: 5,
        title: "Sin recolección",
        image: sinRecoleccion,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: sinRecoleccion2,
        description: "Los recolectores NO pasaron por mi domicilio",
        soloVecino: false
    },
    {
        id: 6,
        title: "Solicitar recolección de poda",
        image: solicitudDePoda,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: solicitudDePoda2,
        description: "Recolección de ramas, malezas y troncos, en los meses apropiados (mayo, junio, julio y agosto).",
        soloVecino: false
    },
    {
        id: 7,
        title: "Reparación",
        image: reparacion,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: reparacion2,
        description: "Si usted nota un problema en la red de agua, como una fuga, baja presión o cualquier otro inconveniente, siga estos pasos para reportarlo y solicitar una reparación.",
        soloVecino: false
    },
    {
        id: 8,
        title: "Corte de agua",
        image: corteDeAgua,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: corteDeAgua2,
        description: "Si usted experimenta un corte de agua en su área, siga estos pasos para reportarlo.",
        soloVecino: false
    },
    {
        id: 9,
        title: "Yuyos y malezas",
        image: yuyosYMaleza,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: yuyosYMaleza2,
        description: "Césped no cortado y plantas que interfieren en la vía pública.",
        soloVecino: false
    },
    {
        id: 11,
        title: "Animales sueltos en la vía pública",
        image: animalesSueltos,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: animalesSueltos2,
        description: "Reporte animales sueltos que puedan representar un peligro en la vía pública, como caballos, vacas o perros sin supervisión. Incluye situaciones en calles, plazas o espacios comunes.",
        soloVecino: false
    },
    {
        id: 12,
        title: "Ruidos molestos",
        image: ruidosMolestos,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: ruidosMolestos2,
        description: "Registra quejas sobre ruidos excesivos provenientes de actividades nocturnas, obras en horarios no permitidos o cualquier otra fuente de perturbación acústica en la comunidad.",
        soloVecino: false
    },
    {
        id: 13,
        title: "Desmonte o tala indiscriminada",
        image: desmonte,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: desmonte2,
        description: "Denuncie casos de desmonte o tala indiscriminada de árboles en áreas urbanas o rurales que afecten al ambiente o incumplan normativas locales.",
        soloVecino: false
    },
    {
        id: 14,
        title: "Chatarra o desperdicios",
        image: desperdicios,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: desperdicios2,
        description: "Notifique la acumulación de chatarra, basura o desperdicios en espacios públicos o privados que representen riesgos sanitarios o ambientales.",
        soloVecino: false
    },
    {
        id: 16,
        title: "Solicitud de recolección de residuos secos",
        image: residuosSecos,
        route: "/maps/mapaSolicitudesVarias",
        imageMini: residuosSecos2,
        description: "Solicitud para recolección de residuos reciclables como plásticos, vidrios, cartón y papel en mi domicilio.",
        soloVecino: false
    },
    {
        id: 19,
        title: "Lote en mal estado",
        image: loteMalEstado,
        route: "/utilsPages/informacionContactoSolicitud",
        description: "Denuncie lote en mal estado",
        description2: "Para denunciar lotes en mal estado debe escribir al juzgado de faltas.\nWhatsApp: 3547510772",
        link: "https://wa.me/543547510772",
        type: "wpp",
        soloVecino: true
    },
    {
        id: 20,
        title: "Conexión domiciliaria no realizada",
        image: conexionIncumplida,
        route: "/utilsPages/informacionContactoSolicitud",
        description: "Conexión de agua solicitada antes de 2023 y no realizada",
        description2: "En el caso de que usted haya abonado una conexión de agua anterior al año 2023 y no se encuentre realizada debe dirigirse presencialmente al D.E.M.",
        link: "https://maps.app.goo.gl/gazpRdMqYYd5xLJj6",
        type: "ubicacion",
        soloVecino: true
    }, {
        id: 21,
        title: "Turno de Castración de mascota",
        image: castracion,
        route: "/utilsPages/informacionContactoSolicitud",
        description: "Solicite turno de castración de su mascota ya sea felino o canino.",
        description2: 'Para solicitar turno de castración de su mascota, seleccione "Completar formulario".\nSerá redirigido a un formulario para solicitar su turno de castración.',
        link: "https://docs.google.com/forms/d/e/1FAIpQLSe30pwy_ubOc734c8MkkLqYH_LMHlU3D5RGQSTM9wMOvnyeJg/viewform?usp=sf_link",
        type: "form",
        soloVecino: true
    },
    {
        id: 17,
        title: "Reservar árboles nativos",
        image: reservaDeArbol,
        route: "/solicitudesForms/solicitudVivero",
        description: "Solicitud para resevar un arbol nativo, una vez reservado puede seleccionar que vivero pasara a retirar.",
        soloVecino: false
    },
    {
        id: 18,
        title: "Reservar semillas nativas",
        image: reservaDeSemillas,
        route: "/solicitudesForms/solicitudVivero",
        description: "Solicitud para resevar semillas nativas de otoño, primavera y verano.",
        soloVecino: false
    },
];

