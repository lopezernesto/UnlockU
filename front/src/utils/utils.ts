import type { MateriaData } from "../types/Materia";
import type { EstadoMateria } from "../types/Materia";

export function recalcularEstados(lista: MateriaData[]): MateriaData[] {
  return lista.map((m) => {
    if (m.estado === "APROBADA" || m.estado === "CURSADA") return { ...m };

    const cursadasListas = m.correlativasCursada.every((idC) => {
      const previa = lista.find((p) => p.id === idC);
      return (
        previa && (previa.estado === "CURSADA" || previa.estado === "APROBADA")
      );
    });

    const finalesListos = m.correlativasFinal.every((idF) => {
      const previa = lista.find((p) => p.id === idF);
      return previa && previa.estado === "APROBADA";
    });

    if (cursadasListas && finalesListos) {
      return {
        ...m,
        estado: m.estado === "BLOQUEADA" ? "HABILITADA" : m.estado,
      };
    } else {
      return { ...m, estado: "BLOQUEADA" as EstadoMateria };
    }
  });
}
