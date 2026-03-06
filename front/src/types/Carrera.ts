import type { MateriaData } from "./Materia";

export interface CarreraData {
  id: string;
  nombre: string;
  abreviacion: string;
  aniosDuracion: number;
  materias: MateriaData[];
}
export interface CarreraResumen {
  id: string;
  nombre: string;
  abreviacion: string;
  aniosDuracion: number;
  updatedAt: string;
}
