import type { MateriaData } from "../types/Materia";
import type { EstadoMateria } from "../types/Materia";

export function recalcularEstados(lista: MateriaData[]): MateriaData[] {
  // DECISIÓN DE DISEÑO: las materias ya cursadas o aprobadas no se recalculan,
  // aunque sus correlativas dejen de cumplirse. Esto es intencional para
  // soportar simulación de escenarios futuros. Ver README para más contexto.
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
      return {
        ...m,
        estado: "BLOQUEADA" as EstadoMateria,
        anioCursada: undefined,
        anioAprobado: undefined,
        nota: undefined,
      };
    }
  });
}
