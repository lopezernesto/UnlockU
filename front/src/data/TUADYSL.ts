import type { CarreraData } from "../types/Carrera";
import type { MateriaData } from "../types/Materia";

const materiasTUADYSL: MateriaData[] = [
  {
    ////////////////// PRIMER AÑO //////////////////
    // ===== Primer Cuatrimestre =====
    id: "1",
    nombre: "Introducción a la Computación",
    anio: 1,
    cuatrimestre: 1,
    estado: "HABILITADA",
    correlativasCursada: [],
    correlativasFinal: [],
  },
  {
    id: "2",
    nombre: "Matemática General",
    anio: 1,
    cuatrimestre: 1,
    estado: "HABILITADA",
    correlativasCursada: [],
    correlativasFinal: [],
  },
  {
    id: "3",
    nombre: "Inglés Técnico",
    anio: 1,
    cuatrimestre: 1,
    estado: "HABILITADA",
    correlativasCursada: [],
    correlativasFinal: [],
  },
  // ===== Segundo Cuatrimestre =====
  {
    id: "4",
    nombre: "Introducción a la Programación",
    anio: 1,
    cuatrimestre: 2,
    estado: "HABILITADA",
    correlativasCursada: [],
    correlativasFinal: [],
  },
  {
    id: "5",
    nombre: "Introducción a la Administración de Sistemas",
    anio: 1,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["1", "3"],
    correlativasFinal: [],
  },
  {
    id: "6",
    nombre: "Redes de Datos",
    anio: 1,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["1", "2"],
    correlativasFinal: [],
  },
  ////////////////// SEGUNDO AÑO //////////////////
  // ===== Primer Cuatrimestre =====
  {
    id: "7",
    nombre: "Software Libre",
    anio: 2,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["4"],
    correlativasFinal: [],
  },
  {
    id: "8",
    nombre: "Taller de Hardware y Software",
    anio: 2,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["5"],
    correlativasFinal: [],
  },
  {
    id: "9",
    nombre: "Administración de Sistemas",
    anio: 2,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["4", "6"],
    correlativasFinal: [],
  },
  // ===== Segundo Cuatrimestre =====
  {
    id: "10",
    nombre: "Administración de Servicios",
    anio: 2,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["5", "9"],
    correlativasFinal: [],
  },
  {
    id: "11",
    nombre: "Sistemas de Información",
    anio: 2,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["5"],
    correlativasFinal: [],
  },
  {
    id: "12",
    nombre: "Automatización y Scripting",
    anio: 2,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["4", "5", "9"],
    correlativasFinal: [],
  },
  ////////////////// TERCER AÑO //////////////////
  // ===== Primer Cuatrimestre =====
  {
    id: "13",
    nombre: "Administración de Sistemas Avanzada",
    anio: 3,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["12"],
    correlativasFinal: [],
  },
  {
    id: "14",
    nombre: "Aplicaciones Libres",
    anio: 3,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["7", "8"],
    correlativasFinal: [],
  },
  {
    id: "15",
    nombre: "Redes II",
    anio: 3,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["10"],
    correlativasFinal: [],
  },
];

export const carreraTUADYSL: CarreraData = {
  id: "tuadysl",
  nombre:
    "Tecnicatura Universitaria en Administración de Sistemas y Software Libre",
  aniosDuracion: 3,
  materias: materiasTUADYSL,
};
