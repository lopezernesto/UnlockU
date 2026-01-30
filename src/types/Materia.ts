export type EstadoMateria = "BLOQUEADA" | "HABILITADA" | "CURSADA" | "APROBADA";

export interface MateriaData {
  id: string;
  nombre: string;
  anio: number;
  cuatrimestre: 1 | 2;
  estado: EstadoMateria;
  nota?: number;
  anioCursada?: string;
  anioFinal?: string;
  correlativasCursada: string[];
  correlativasFinal: string[];
  // Agregar esta línea para cumplir con Record<string, unknown>
  [key: string]: unknown;
}
