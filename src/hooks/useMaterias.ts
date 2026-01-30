import { useState, useCallback, useMemo, useEffect } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { MateriaNode } from "../components/NodoMateria";
import { AnioNode } from "../components/Separador";
import { materiasIniciales } from "../data/MateriasIniciales";
import type { EstadoMateria, MateriaData } from "../types/Materia";

export default function useMaterias() {
  //Este useMemo se utiliza para que se ReactFlow no re-renderice los nodos innecesariamente cuando hay algun cambio en el estado
  const nodeTypes = useMemo(
    () => ({ materia: MateriaNode, anioTitulo: AnioNode }),
    [],
  );

  // --- Espacios entre cartas y años ---
  const ESPACIO_HORIZONTAL = 300;
  const ESPACIO_VERTICAL_CUATRIMESTRE = 280;
  const ESPACIO_VERTICAL_AÑO = 100;

  // --- Estados ---
  const [materias, setMaterias] = useState<MateriaData[]>(materiasIniciales);
  const [arcos, setArcos] = useState<Edge[]>([]);

  //Logica de arcos automaticos
  const generarArcosAutomaticos = useCallback(
    (listaMaterias: MateriaData[]): Edge[] => {
      const nuevosArcos: Edge[] = [];
      listaMaterias.forEach((m) => {
        // Arcos de Cursada
        m.correlativasCursada.forEach((idPadre) => {
          nuevosArcos.push({
            id: `e-${idPadre}-${m.id}-cursada`,
            source: idPadre,
            target: m.id,
            //label: "cursada",
            style: { stroke: "#e20e0e" },
            //animated: true,
          });
        });
        // Arcos de Final
        m.correlativasFinal.forEach((idPadre) => {
          nuevosArcos.push({
            id: `e-${idPadre}-${m.id}-final`,
            source: idPadre,
            target: m.id,
            style: { stroke: "#cf1c1c", strokeDasharray: "5,5" },
          });
        });
      });
      return nuevosArcos;
    },
    [],
  );

  // Para la posicion de la carta dentro de su año
  const calcularPosicionRelativa = useCallback(
    (materia: MateriaData, todas: MateriaData[]) => {
      const fila = materia.cuatrimestre === 1 ? 0 : 1;
      const y = 80 + fila * ESPACIO_VERTICAL_CUATRIMESTRE;
      const materiasMismoPeriodo = todas.filter(
        (m) =>
          m.anio === materia.anio && m.cuatrimestre === materia.cuatrimestre,
      );
      const indice = materiasMismoPeriodo
        .sort((a, b) => a.id.localeCompare(b.id))
        .indexOf(materia);
      return { x: 50 + indice * ESPACIO_HORIZONTAL, y };
    },
    [],
  );

  // Estructura del año (Fondos y Títulos)
  const generarEstructuraDinamica = useCallback(
    (listaMaterias: MateriaData[]): Node[] => {
      const aniosUnicos = Array.from(
        new Set(listaMaterias.map((m) => m.anio)),
      ).sort((a, b) => a - b);
      const estructura: Node[] = [];
      aniosUnicos.forEach((anio) => {
        const yBase =
          (anio - 1) *
          (ESPACIO_VERTICAL_CUATRIMESTRE * 2 + ESPACIO_VERTICAL_AÑO + 150);
        estructura.push({
          id: `year-group-${anio}`,
          type: "group",
          data: { label: "" },
          position: { x: -80, y: yBase },
          style: {
            width: 1700,
            height: 680,
            backgroundColor: "rgba(255, 255, 255, 0.03)", // Fondo casi invisible
            backdropFilter: "blur(4px)", // Difumina los puntitos del fondo
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.08)", // Borde suave
            boxShadow: "0 8px 32px 0 rgba(61, 58, 58, 0.37)", // Sombra para separar del fondo
            pointerEvents: "none" as const,
            zIndex: -2,
          },
          draggable: false,
        });
        estructura.push({
          id: `titulo-anio-${anio}`,
          type: "anioTitulo",
          parentId: `year-group-${anio}`,
          data: { label: `${anio}° AÑO` },
          position: { x: 30, y: 25 },
          draggable: false,
          zIndex: -1,
        });
      });
      return estructura;
    },
    [],
  );

  // Nodos de materia (React Flow)
  const [nodos, setNodos] = useState<Node[]>([]);

  // Efecto para sincronizar Arcos y Nodos cuando cambian las materias
  useEffect(() => {
    const estructura = generarEstructuraDinamica(materias);
    const nodosMaterias = materias.map((m) => ({
      id: m.id,
      type: "materia",
      parentId: `year-group-${m.anio}`,
      extent: "parent" as const,
      position: calcularPosicionRelativa(m, materias),
      data: { ...m, actualizar: actualizarMaterias },
    }));

    setNodos([...estructura, ...nodosMaterias]);
    setArcos(generarArcosAutomaticos(materias));
  }, [
    materias,
    generarEstructuraDinamica,
    calcularPosicionRelativa,
    generarArcosAutomaticos,
  ]);

  // AGREGAR MATERIA
  const agregarMateria = (nuevaMateria: MateriaData) => {
    setMaterias((prev) => [...prev, nuevaMateria]);
  };

  // Para el filtro de materias en el Sidebar
  const obtenerMateriasPrevias = (anio: number, cuatri: number) => {
    return materias.filter(
      (m) => m.anio < anio || (m.anio === anio && m.cuatrimestre < cuatri),
    );
  };

  // Handlers React Flow
  const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => setNodos((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setArcos((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const resetearPosiciones = useCallback(() => {
    setMaterias([...materias]); // Al re-setear materias, el useEffect recalcula posiciones
  }, [materias]);

  //Para modificar el estado de las materias
  const actualizarMaterias = useCallback(
    (id: string, nuevoEstado: EstadoMateria) => {
      setMaterias((prev) => {
        // Buscamos la materia y le cambiamos el estado
        const nuevas = prev.map((m) =>
          m.id === id ? { ...m, estado: nuevoEstado } : m,
        );

        return nuevas.map((m) => {
          if (m.estado === "APROBADA") return m;

          // Se recalcula el estado de todas las mateiras
          // Revisamos si sus correlativas de cursada estan listas (Cursada o Aprobada)
          const cursadasListas = m.correlativasCursada.every((idC) => {
            const previa = nuevas.find((p) => p.id === idC);
            return (
              previa &&
              (previa.estado === "CURSADA" || previa.estado === "APROBADA")
            );
          });

          // Revisamos si sus correlativas de final estan listas (Final Aprobado)
          const finalesListos = m.correlativasFinal.every((idF) => {
            const previa = nuevas.find((p) => p.id === idF);
            return previa && previa.estado === "APROBADA";
          });

          // Si cumple todo, la habilitamos. Si no, queda bloqueada
          if (cursadasListas && finalesListos) {
            return {
              ...m,
              estado: m.estado === "BLOQUEADA" ? "HABILITADA" : m.estado,
            };
          } else {
            return { ...m, estado: "BLOQUEADA" };
          }
        });
      });
    },
    [],
  );

  return {
    nodos,
    arcos,
    nodeTypes,
    onNodesChange,
    onEdgesChange,
    resetearPosiciones,
    agregarMateria,
    obtenerMateriasPrevias,
    materias,
  };
}
