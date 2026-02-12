import React, { createContext, useContext } from "react";
import useCarrera from "../hooks/useCarrera";
import useMaterias from "../hooks/useMaterias";
import type { CarreraData } from "../types/Carrera";
import type { MateriaData } from "../types/Materia";

// Definimos qué datos y funciones estarán disponibles en toda la app
interface CarreraContextType {
  carreraActual: CarreraData | null;
  materias: MateriaData[];
  aniosDuracion: number;
  resetKey: number;
  nodos: any[];
  arcos: any[];
  nodeTypes: any;
  onNodesChange: any;
  onEdgesChange: any;
  // Funciones de Carrera
  cargarLCC: () => void;
  cargarADYSL: () => void;
  cambiarCarrera: () => void;
  importarProgreso: (file: File) => void;
  exportarProgreso: () => void;
  crearNuevaCarrera: (datos: {
    nombre: string;
    abreviacion: string;
    anios: number;
  }) => void;
  // Funciones de Materias
  agregarMateria: (m: MateriaData) => void;
  obtenerMateriasPrevias: (anio: number, cuatri: number) => MateriaData[];
  resetearPosiciones: () => void;
}

const CarreraContext = createContext<CarreraContextType | undefined>(undefined);

export function CarreraProvider({ children }: { children: React.ReactNode }) {
  // 1. Hook de Carrera (Persistencia y carga)
  const carrera = useCarrera();

  // 2. Hook de Materias (Lógica de React Flow y correlativas)
  const materiasLogic = useMaterias({
    materias: carrera.materias,
    aniosDuracion: carrera.aniosDuracion,
    actualizarMaterias: carrera.actualizarMaterias,
    resetKey: carrera.resetKey,
  });

  const value = {
    carreraActual: carrera.carreraActual,
    materias: carrera.materias,
    aniosDuracion: carrera.aniosDuracion,
    resetKey: carrera.resetKey,
    ...materiasLogic, // Esparcimos nodos, arcos, onNodesChange, etc.
    cargarLCC: carrera.cargarCarreraLCC,
    cargarADYSL: carrera.cargarTecnicaturaADYSL,
    cambiarCarrera: carrera.cambiarCarrera,
    importarProgreso: carrera.importarProgreso,
    exportarProgreso: carrera.exportarProgreso,
    crearNuevaCarrera: carrera.crearNuevaCarrera,
  };

  return (
    <CarreraContext.Provider value={value}>{children}</CarreraContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export function useCarreraContext() {
  const context = useContext(CarreraContext);
  if (!context) {
    throw new Error(
      "useCarreraContext debe usarse dentro de un CarreraProvider",
    );
  }
  return context;
}
