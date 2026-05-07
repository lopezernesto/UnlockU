import React, { createContext, useCallback, useContext } from "react";
import useCarrera from "../hooks/useCarrera";
import type { CarreraData } from "../types/Carrera";
import type { MateriaData } from "../types/Materia";
import { useAuthContext } from "./AuthContext";
import { recalcularEstados } from "../utils/utils";

// Definimos que datos y funciones estaran disponibles en toda la app
interface CarreraContextType {
  carreraActual: CarreraData | null;
  materias: MateriaData[];
  aniosDuracion: number;
  resetKey: number;
  isGuest: boolean;
  isAuthenticated: boolean;

  // Funciones de Carrera
  actualizarMaterias: (materias: MateriaData[]) => void;
  cargarLCC: () => void;
  cargarLSI: () => void;
  cargarTUASSL: () => void;
  cargarTUDW: () => void;
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

  const obtenerMateriasPrevias = useCallback(
    (anio: number, cuatri: number) => {
      return carrera.materias.filter(
        (m) => m.anio < anio || (m.anio === anio && m.cuatrimestre < cuatri),
      );
    },
    [carrera.materias],
  );

  const agregarMateria = useCallback(
    (nuevaMateria: MateriaData) => {
      const nuevaLista = [...carrera.materias, nuevaMateria];
      carrera.actualizarMaterias(recalcularEstados(nuevaLista));
    },
    [carrera.materias, carrera.actualizarMaterias],
  );

  const value = {
    carreraActual: carrera.carreraActual,
    materias: carrera.materias,
    aniosDuracion: carrera.aniosDuracion,
    resetKey: carrera.resetKey,
    obtenerMateriasPrevias,
    agregarMateria,
    cargarLCC: carrera.cargarCarreraLCC,
    cargarLSI: carrera.cargarCarreraLSI,
    cargarTUASSL: carrera.cargarTecnicaturaTUASSL,
    cargarTUDW: carrera.cargarTecnicaturaTUDW,
    cambiarCarrera: carrera.cambiarCarrera,
    importarProgreso: carrera.importarProgreso,
    exportarProgreso: carrera.exportarProgreso,
    crearNuevaCarrera: carrera.crearNuevaCarrera,
    cargarCarreraCustom: carrera.cargarCarreraCustom,
    resetearPosiciones: carrera.resetearPosiciones,
    actualizarMaterias: carrera.actualizarMaterias,
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
