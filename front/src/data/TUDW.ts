import type { CarreraData } from "../types/Carrera";
import type { MateriaData } from "../types/Materia";

const materiasTUDW: MateriaData[] = [
  ////////////////// PRIMER AÑO //////////////////
  // ===== Primer Cuatrimestre =====
  {
    id: "1",
    nombre: "Matemática General",
    anio: 1,
    cuatrimestre: 1,
    estado: "HABILITADA",
    correlativasCursada: [],
    correlativasFinal: [],
  },
  {
    id: "2",
    nombre: "Introducción a la Programación",
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
    nombre: "Programación Estática y Laboratorio Web",
    anio: 1,
    cuatrimestre: 2,
    estado: "HABILITADA",
    correlativasCursada: ["2"],
    correlativasFinal: [],
  },
  {
    id: "5",
    nombre: "Introducción a la Programación Orientada a Objetos",
    anio: 1,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["2"],
    correlativasFinal: [],
  },
  {
    id: "6",
    nombre: "Conceptos de Bases de Datos",
    anio: 1,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["1", "3"],
    correlativasFinal: [],
  },
  ////////////////// SEGUNDO AÑO //////////////////
  // ===== Primer Cuatrimestre =====
  {
    id: "7",
    nombre: "Programacion Web Dinámica",
    anio: 2,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["4", "5", "6"],
    correlativasFinal: [],
  },
  {
    id: "8",
    nombre: "Arquitectura y Seguridad de Computadoras",
    anio: 2,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["1", "3"],
    correlativasFinal: [],
  },
  {
    id: "9",
    nombre: "Diseño Gráfico",
    anio: 2,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["4"],
    correlativasFinal: [],
  },
  // ===== Segundo Cuatrimestre =====
  {
    id: "10",
    nombre: "Programación Web Avanzada",
    anio: 2,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["7"],
    correlativasFinal: [],
  },
  {
    id: "11",
    nombre: "Análisis, Diseño y Documentación de Sistemas",
    anio: 2,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["5", "6"],
    correlativasFinal: [],
  },

  ////////////////// TERCER AÑO //////////////////
  // ===== Primer Cuatrimestre =====
  {
    id: "12",
    nombre: "Framework e Interoperabilidad",
    anio: 2,
    cuatrimestre: 2,
    estado: "BLOQUEADA",
    correlativasCursada: ["10"],
    correlativasFinal: [],
  },
  {
    id: "13",
    nombre: "Trabajo Final Tecnicatura en Desarrollo Web",
    anio: 3,
    cuatrimestre: 1,
    estado: "BLOQUEADA",
    correlativasCursada: ["8", "9", "10", "11"],
    correlativasFinal: [],
  },
];

export const carreraTUDW: CarreraData = {
  id: "TUDW",
  nombre: "Tecnicatura Universitaria en Dessarrollo WEB",
  abreviacion: "TUDW",
  aniosDuracion: 3,
  materias: materiasTUDW,
};
