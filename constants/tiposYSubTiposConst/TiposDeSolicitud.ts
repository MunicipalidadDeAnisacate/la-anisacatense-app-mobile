const alumbradoIcon = require('../../assets/images/menu/luz-de-la-calle.png');
const mantenimientoCalles = require('../../assets/images/menu/menuMantenimientoCalles.png');
const recoleccionDeResiduos = require('../../assets/images/menu/recoleccionDeResiduos.png');
const recoleccionDePoda = require('../../assets/images/menu/recoleccionDePoda.png');
const redDeAgua = require('../../assets/images/menu/RedDeAgua.png');
const malezasViaPublica = require('../../assets/images/menu/viaPublica.png');
const ambiente = require("../../assets/images/menu/ambiente.png");
const acarreoDeAgua = require("../../assets/images/menu/acarreo-de-agua.png")


export type TipoSolicitud = {
  id: number;
  title: string;
  image: any;
  subTipos: number[];
  cuadrilla: number;
  soloVecino: boolean;
  contactoInformativo?: any;
};


export const tiposDeSolicitud: TipoSolicitud[] = [
  { 
    id: 1, 
    title: "Reparación de Alumbrado Público", 
    image: alumbradoIcon, subTipos: [1, 2, 10], 
    cuadrilla: 1, soloVecino: false 
  },
  { 
    id: 2, 
    title: "Mantenimiento de Calles", 
    image: mantenimientoCalles, 
    subTipos: [3, 4], 
    cuadrilla: 5, 
    soloVecino: false 
  },
  { 
    id: 3, 
    title: "Recolección de Residuos", 
    image: recoleccionDeResiduos, 
    subTipos: [5, 16], 
    cuadrilla: 2, 
    soloVecino: false },
  { 
    id: 4, 
    title: "Recolección de Poda", 
    image: recoleccionDePoda, 
    subTipos: [6],
    cuadrilla: 4, 
    soloVecino: false },
  { 
    id: 5, 
    title: "Red de Agua", 
    image: redDeAgua, 
    subTipos: [7, 8, 20], 
    cuadrilla: 3, 
    soloVecino: false },
  { 
    id: 8, 
    title: "Acarreo de Agua", 
    image: acarreoDeAgua, 
    subTipos: [], 
    cuadrilla: 0, 
    soloVecino: true,
    contactoInformativo: {id: 8,  type: "wpp", link: "https://wa.me/5493547557815", title: "Acarreo de Agua", description: "Para solicitar Acarreo de agua deberá contactarse vía WhatsApp con nosotros"}
  },
  { 
    id: 6, 
    title: "Maleza en Vía Pública", 
    image: malezasViaPublica, 
    subTipos: [9, 19], 
    cuadrilla: 4, 
    soloVecino: false },
  { 
    id: 7, 
    title: "Ambiente/Zoonosis", 
    image: ambiente, 
    subTipos: [21, 11, 12, 13, 14, 18, 17], 
    cuadrilla: 6, 
    soloVecino: false },
];