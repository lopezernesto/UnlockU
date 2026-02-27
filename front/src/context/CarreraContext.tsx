import React, { createContext, useContext } from "react";
import useCarrera from "../hooks/useCarrera";
import useMaterias from "../hooks/useMaterias";
import type { CarreraData } from "../types/Carrera";
import type { MateriaData } from "../types/Materia";
import type { Edge, Node, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import { useAuthContext } from "./AuthContext";

// Definimos que datos y funciones estaran disponibles en toda la app
interface CarreraContextType {
  carreraActual: CarreraData | null;
  materias: MateriaData[];
  aniosDuracion: number;
  resetKey: number;
  nodos: Node[];
  arcos: Edge[];
  nodeTypes: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  isGuest: boolean;
  isAuthenticated: boolean;

  // Funciones de Carrera
  cargarLCC: () => void;
  cargarADYSL: () => void;
  cambiarCarrera: () => void;
  importarProgreso: (file: File) => void;
  exportarProgreso: () => void;
  crearNuevaCarrera: (
    datos: {
      nombre: string;
      abreviacion: string;
      anios: number;
    },
    id?: string,
  ) => void;
  cargarCarreraCustom: (id: string) => void;
  resetearPosiciones: () => void;

  // Funciones de Materias
  agregarMateria: (m: MateriaData) => void;
  obtenerMateriasPrevias: (anio: number, cuatri: number) => MateriaData[];
}

const CarreraContext = createContext<CarreraContextType | undefined>(undefined);

export function CarreraProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isGuest } = useAuthContext();
  const carrera = useCarrera(isAuthenticated, isGuest);

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
    cargarCarreraCustom: carrera.cargarCarreraCustom,
    resetearPosiciones: carrera.resetearPosiciones,
    isAuthenticated,
    isGuest,
  };

  return (
    <CarreraContext.Provider value={value}>{children}</CarreraContext.Provider>
  );
}

export function useCarreraContext() {
  const context = useContext(CarreraContext);
  if (!context) {
    throw new Error(
      "useCarreraContext debe usarse dentro de un CarreraProvider",
    );
  }
  return context;
}
