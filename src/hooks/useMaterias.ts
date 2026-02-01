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
  // localStorage.clear(); //para hacer pruebas borrando todo
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
  const [materias, setMaterias] = useState<MateriaData[]>(() => {
    const guardado = localStorage.getItem("materias-data");
    return guardado ? JSON.parse(guardado) : materiasIniciales;
  });

  useEffect(() => {
    localStorage.setItem("materias-data", JSON.stringify(materias));
  }, [materias]);

  const [arcos, setArcos] = useState<Edge[]>([]);

  // Handlers React Flow
  const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => setNodos((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setArcos((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

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
        const materiasDelAnio = listaMaterias.filter((m) => m.anio === anio);
        const cant1erCuatri = materiasDelAnio.filter(
          (m) => m.cuatrimestre === 1,
        ).length;
        const cant2doCuatri = materiasDelAnio.filter(
          (m) => m.cuatrimestre === 2,
        ).length;
        const maxMateriasPorFila = Math.max(cant1erCuatri, cant2doCuatri, 1);
        const anchoDinamico = 150 + maxMateriasPorFila * ESPACIO_HORIZONTAL;
        const yBase =
          (anio - 1) *
          (ESPACIO_VERTICAL_CUATRIMESTRE * 2 + ESPACIO_VERTICAL_AÑO + 150);

        //Esta estructura es del fondo y titulo del año
        estructura.push({
          id: `year-group-${anio}`,
          type: "group",
          data: { label: "" },
          position: { x: -80, y: yBase },
          style: {
            minWidth: 1700,
            width: anchoDinamico,
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
    const posicionesGuardadas = JSON.parse(
      localStorage.getItem("nodos-posiciones") || "{}",
    );

    const nodosMaterias = materias.map((m) => ({
      id: m.id,
      type: "materia",
      parentId: `year-group-${m.anio}`,
      extent: "parent" as const,
      position:
        posicionesGuardadas[m.id] || calcularPosicionRelativa(m, materias),
      data: { ...m, actualizar: actualizarEstado, borrar: borrarMateria },
    }));

    setNodos([...estructura, ...nodosMaterias]);
    setArcos(generarArcosAutomaticos(materias));
  }, [
    materias,
    generarEstructuraDinamica,
    calcularPosicionRelativa,
    generarArcosAutomaticos,
  ]);

  // ABM DE MATERIAS
  // Agregar
  const agregarMateria = (nuevaMateria: MateriaData) => {
    setMaterias((prev) => [...prev, nuevaMateria]);
  };
  // Borrar
  const borrarMateria = (idABorrar: string) => {
    setMaterias((prevMaterias) => {
      const listaSinMateria = prevMaterias.filter((m) => m.id !== idABorrar);
      const listaLimpia = listaSinMateria.map((materia) => ({
        ...materia,
        correlativasCursada: materia.correlativasCursada.filter(
          (id) => id !== idABorrar,
        ),
        correlativasFinal: materia.correlativasFinal.filter(
          (id) => id !== idABorrar,
        ),
      }));
      return recalcularEstados(listaLimpia);
    });
    const posiciones = JSON.parse(
      localStorage.getItem("nodos-posiciones") || "{}",
    );
    delete posiciones[idABorrar];
    localStorage.setItem("nodos-posiciones", JSON.stringify(posiciones));
  };

  //Editar
  const editarMateria = useCallback(
    (id: string, dataActualizada: Partial<MateriaData>) => {
      setMaterias((prev) => {
        const nuevas = prev.map((m) =>
          m.id === id ? { ...m, ...dataActualizada } : m,
        );
        return recalcularEstados(nuevas);
      });
    },
    [],
  );

  // Para el filtro de materias en el Sidebar
  const obtenerMateriasPrevias = (anio: number, cuatri: number) => {
    return materias.filter(
      (m) => m.anio < anio || (m.anio === anio && m.cuatrimestre < cuatri),
    );
  };

  const resetearPosiciones = useCallback(() => {
    localStorage.removeItem("nodos-posiciones");
    setMaterias([...materias]); // Al resetear materias, el useEffect recalcula posiciones
  }, [materias]);

  //Para modificar el estado de las materias

  //Actualizar estado se llama cuando se aprueba/cursa/resetea una materia
  const actualizarEstado = useCallback(
    (id: string, nuevoEstado: EstadoMateria) => {
      setMaterias((prev) => {
        const nuevas = prev.map((m) =>
          m.id === id ? { ...m, estado: nuevoEstado } : m,
        );
        return recalcularEstados(nuevas);
      });
    },
    [],
  );

  const recalcularEstados = (lista: MateriaData[]): MateriaData[] => {
    return lista.map((m) => {
      if (m.estado === "APROBADA") return { ...m };

      const cursadasListas = m.correlativasCursada.every((idC) => {
        const previa = lista.find((p) => p.id === idC);
        return (
          previa &&
          (previa.estado === "CURSADA" || previa.estado === "APROBADA")
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
  };

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
