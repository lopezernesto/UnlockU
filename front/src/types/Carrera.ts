import type { MateriaData } from "./Materia";

export interface CarreraData {
  id: string;
  nombre: string;
  abreviacion: string;
  aniosDuracion: number;
  materias: MateriaData[];
  //updatedAt: number; proximamente para lo de las carreras recientes de los users
}
