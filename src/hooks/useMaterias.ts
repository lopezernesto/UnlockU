import { useState, useCallback, useMemo, useEffect, use } from "react";
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
import { materiasLCC } from "../data/LCC";
import type { EstadoMateria, MateriaData } from "../types/Materia";

export default function useMaterias() {
  //localStorage.clear(); //para hacer pruebas borrando todo
  //Este useMemo se utiliza para que se ReactFlow no re-renderice los nodos innecesariamente cuando hay algun cambio en el estado
  const nodeTypes = useMemo(
    () => ({ materia: MateriaNode, anioTitulo: AnioNode }),
    [],
  );

  // --- Constantes de espacios entre cartas y años ---
  const ESPACIO_HORIZONTAL = 300;
  const ESPACIO_VERTICAL_CUATRIMESTRE = 350;
  const ESPACIO_VERTICAL_AÑO = 100;

  // --- Estados ---
  const [materias, setMaterias] = useState<MateriaData[]>(() => {
    const guardado = localStorage.getItem("materias-data");
    return guardado ? JSON.parse(guardado) : materiasIniciales;
  });

  const [nodos, setNodos] = useState<Node[]>([]);
  const [arcos, setArcos] = useState<Edge[]>([]);
  // Key para forzar reset completo cuando cambia el dataset
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    localStorage.setItem("materias-data", JSON.stringify(materias));
  }, [materias]);

  // Handlers React Flow
  const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => setNodos((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setArcos((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  // Recalcular estados para corregir correlatividades
  const recalcularEstados = (lista: MateriaData[]): MateriaData[] => {
    return lista.map((m) => {
      if (m.estado === "APROBADA" || m.estado === "CURSADA") return { ...m };

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

  // ABM DE MATERIAS

  // Agregar
  const agregarMateria = useCallback((nuevaMateria: MateriaData) => {
    setMaterias((prev) => {
      const nuevaLista = [...prev, nuevaMateria];
      return recalcularEstados(nuevaLista);
    });
  }, []);
  // Borrar
  const borrarMateria = useCallback((idABorrar: string) => {
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
  }, []);

  //Editar
  const editarMateria = useCallback(
    (id: string, dataActualizada: Partial<MateriaData>) => {
      setMaterias((prev) => {
        const materiaOriginal = prev.find((m) => m.id === id);
        if (!materiaOriginal) return prev;

        const materiaEditada = { ...materiaOriginal, ...dataActualizada };

        // Verifico si cambio de año o cuatri
        const cambioUbicacion =
          materiaEditada.anio !== materiaOriginal.anio ||
          materiaEditada.cuatrimestre !== materiaOriginal.cuatrimestre;

        let nuevas = prev.map((m) => (m.id === id ? materiaEditada : m));

        // Si cambio de ubicacion, verifico las correlativas de las demas materias
        if (cambioUbicacion) {
          nuevas = nuevas.map((materia) => {
            // Si esta materia NO tiene a la editada como correlativa, no hacer nada
            const tieneComoCorrelativa =
              materia.correlativasCursada.includes(id) ||
              materia.correlativasFinal.includes(id);

            if (!tieneComoCorrelativa) return materia;

            // Verifico que la materia editada siga siendo valida como correlativa
            const esCorrelativaValida =
              materiaEditada.anio < materia.anio ||
              (materiaEditada.anio === materia.anio &&
                materiaEditada.cuatrimestre < materia.cuatrimestre);

            // Si no es valida, limpio las correlativas
            if (!esCorrelativaValida) {
              return {
                ...materia,
                correlativasCursada: materia.correlativasCursada.filter(
                  (corrId) => corrId !== id,
                ),
                correlativasFinal: materia.correlativasFinal.filter(
                  (corrId) => corrId !== id,
                ),
              };
            }

            return materia;
          });
        }

        return recalcularEstados(nuevas);
      });
    },
    [],
  );
  // Funciones para modificar el estado de las materias
  const regularizarMateria = useCallback((id: string, anio: string) => {
    setMaterias((prev) => {
      const nuevas = prev.map((m) =>
        m.id === id
          ? { ...m, estado: "CURSADA" as EstadoMateria, anioCursada: anio }
          : m,
      );
      return recalcularEstados(nuevas);
    });
  }, []);

  const aprobarFinal = useCallback((id: string, anio: string, nota: number) => {
    setMaterias((prev) => {
      const nuevas = prev.map((m) =>
        m.id === id
          ? {
              ...m,
              estado: "APROBADA" as EstadoMateria,
              anioFinal: anio,
              nota: nota,
            }
          : m,
      );
      return recalcularEstados(nuevas);
    });
  }, []);

  const resetearMateria = useCallback((id: string) => {
    setMaterias((prev) => {
      const nuevas = prev.map((m) =>
        m.id === id
          ? {
              ...m,
              estado: "BLOQUEADA" as EstadoMateria,
              anioCursada: undefined,
              anioFinal: undefined,
              nota: undefined,
            }
          : m,
      );
      return recalcularEstados(nuevas);
    });
  }, []);

  // Para el filtro de materias en el Sidebar, solo mostrara materias que pueden ser correlativas
  const obtenerMateriasPrevias = useCallback(
    (anio: number, cuatri: number) => {
      return materias.filter(
        (m) => m.anio < anio || (m.anio === anio && m.cuatrimestre < cuatri),
      );
    },
    [materias],
  );

  //Logica de arcos automaticos
  const generarArcosAutomaticos = useCallback(
    (listaMaterias: MateriaData[]): Edge[] => {
      const nuevosArcos: Edge[] = [];
      listaMaterias.forEach((m) => {
        const crearArco = (idPadre: string, esFinal: boolean) => ({
          id: `e-${idPadre}-${m.id}-${esFinal ? "final" : "cursada"}`,
          source: idPadre,
          target: m.id,
          // interactionWidth aumenta el área donde el mouse detecta el arco
          interactionWidth: 20,
          className: "transition-all duration-300 stroke-[2px] cursor-pointer",
          style: esFinal
            ? {
                stroke: "#94A3B8",
                strokeDasharray: "5,5",
                opacity: 0.8,
              }
            : {
                stroke: "#94A3B8",
                strokeDasharray: "0",
                opacity: 0.5,
              },
          // animated: esFinal ? true : false,
        });
        m.correlativasCursada.forEach((idP) =>
          nuevosArcos.push(crearArco(idP, false)),
        );
        m.correlativasFinal.forEach((idP) =>
          nuevosArcos.push(crearArco(idP, true)),
        );
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

  const resetearPosiciones = useCallback(() => {
    localStorage.removeItem("nodos-posiciones");
    setMaterias((prev) => [...prev]);
  }, []);

  const exportarProgreso = () => {
    const dataStr = JSON.stringify(materias, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `progreso_lcc_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const cargarCarreraLCC = useCallback(() => {
    localStorage.removeItem("nodos-posiciones");
    localStorage.removeItem("react-flow-viewport");
    setNodos([]);
    setArcos([]);
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      setMaterias(materiasLCC);
    }, 0);
  }, []);

  const importarProgreso = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        localStorage.removeItem("nodos-posiciones");
        localStorage.removeItem("react-flow-viewport");
        setNodos([]);
        setArcos([]);
        setResetKey((prev) => prev + 1);
        setTimeout(() => {
          setMaterias(json);
        }, 0);
      } catch (err) {
        alert("Error: El archivo no tiene un formato válido.");
      }
    };
    reader.readAsText(file);
  }, []);

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
      data: {
        ...m,
        regularizar: regularizarMateria,
        aprobar: aprobarFinal,
        resetear: resetearMateria,
        borrar: borrarMateria,
        editar: editarMateria,
        todasLasMaterias: materias,
        obtenerMateriasPrevias,
      },
    }));

    setNodos([...estructura, ...nodosMaterias]);
    setArcos(generarArcosAutomaticos(materias));
  }, [
    materias,
    resetKey,
    generarEstructuraDinamica,
    calcularPosicionRelativa,
    generarArcosAutomaticos,
    regularizarMateria,
    aprobarFinal,
    resetearMateria,
    borrarMateria,
    editarMateria,
    obtenerMateriasPrevias,
  ]);

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
    importarProgreso,
    exportarProgreso,
    cargarCarreraLCC,
    resetKey,
  };
}
