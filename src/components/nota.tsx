import { useState, useCallback, useMemo } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { MateriaNode } from "../components/NodoMateria";
import { AnioNode } from "../components/Separador";
import { materiasIniciales } from "../data/MateriasIniciales";
import type { EstadoMateria, MateriaData } from "../types/Materia";
import Arcos from "../components/Arcos";

export default function useMaterias() {
  const nodeTypes = useMemo(
    () => ({
      materia: MateriaNode,
      anioTitulo: AnioNode,
    }),
    [],
  );

  const [arcos, setArcos] = useState(Arcos());

  // Configuración de espaciado
  const ESPACIO_HORIZONTAL = 300;
  const ESPACIO_VERTICAL_CUATRIMESTRE = 280;
  const ESPACIO_VERTICAL_AÑO = 100;

  // IMPORTANTE: Ahora la posición es RELATIVA al cuadro del año (el padre)
  const calcularPosicionRelativa = useCallback(
    (materia: MateriaData, todas: MateriaData[]) => {
      // Ya no sumamos el desplazamiento vertical de los años anteriores porque el Padre ya está en esa posición
      const fila = materia.cuatrimestre === 1 ? 0 : 1;
      const y = 80 + fila * ESPACIO_VERTICAL_CUATRIMESTRE; // 80px de margen superior para que no tape el título

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

  const generarEstructuraDinamica = useCallback((): Node[] => {
    const aniosUnicos = Array.from(
      new Set(materiasIniciales.map((m) => m.anio)),
    ).sort((a, b) => a - b);
    const estructura: Node[] = [];

    aniosUnicos.forEach((anio) => {
      const yBase =
        (anio - 1) *
        (ESPACIO_VERTICAL_CUATRIMESTRE * 2 + ESPACIO_VERTICAL_AÑO + 150);

      // Nodo de Fondo (Ahora es el PADRE)
      estructura.push({
        id: `year-group-${anio}`, // ID que usaremos como parentId
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
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", // Sombra para separar del fondo
          pointerEvents: "none" as const,
          zIndex: -2,
        },
        draggable: false,
      });

      // Título del año (Hijo del grupo para que se mueva con él)
      estructura.push({
        id: `titulo-anio-${anio}`,
        type: "anioTitulo",
        parentId: `year-group-${anio}`, // ASIGNAMOS PADRE
        data: { label: `${anio}° AÑO` },
        position: { x: 30, y: 25 },
        draggable: false,
        zIndex: -1,
      });
    });

    return estructura;
  }, []);

  const [nodos, setNodos] = useState<Node[]>(() => [
    ...generarEstructuraDinamica(),
    ...materiasIniciales.map((m) => ({
      id: m.id,
      type: "materia",
      parentId: `year-group-${m.anio}`, // ASIGNAMOS PADRE
      extent: "parent" as const, // ESTO HACE LA MAGIA: no se puede salir del cuadro
      position: calcularPosicionRelativa(m, materiasIniciales),
      data: {
        ...m,
        actualizar: (id: string, estado: EstadoMateria) =>
          actualizarMaterias(id, estado),
      },
    })),
  ]);

  const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => setNodos((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setArcos((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const resetearPosiciones = useCallback(() => {
    setNodos((nds) =>
      nds.map((nodo) => {
        if (nodo.type === "materia") {
          const matOriginal = materiasIniciales.find((m) => m.id === nodo.id);
          if (matOriginal) {
            return {
              ...nodo,
              position: calcularPosicionRelativa(
                matOriginal,
                materiasIniciales,
              ),
            };
          }
        }
        return nodo;
      }),
    );
  }, [calcularPosicionRelativa]);

  const actualizarMaterias = useCallback(
    (idMateria: string, nuevoEstado: EstadoMateria) => {
      setNodos((prevNodes) => {
        const nuevosNodos = prevNodes.map((n) => {
          if (n.id === idMateria && n.type === "materia") {
            return { ...n, data: { ...n.data, estado: nuevoEstado } };
          }
          return n;
        });

        return nuevosNodos.map((nodo) => {
          if (nodo.type !== "materia") return nodo;
          const data = nodo.data as MateriaData;
          let estadoFinal = data.estado;

          if (estadoFinal !== "APROBADA" && estadoFinal !== "CURSADA") {
            const cumplenFinal = data.correlativasFinal.every((idRef) => {
              const ref = nuevosNodos.find((n) => n.id === idRef);
              return (ref?.data as MateriaData)?.estado === "APROBADA";
            });

            const cumplenCursada = data.correlativasCursada.every((idRef) => {
              const ref = nuevosNodos.find((n) => n.id === idRef);
              const est = (ref?.data as MateriaData)?.estado;
              return est === "APROBADA" || est === "CURSADA";
            });
            estadoFinal =
              cumplenFinal && cumplenCursada ? "HABILITADA" : "BLOQUEADA";
          }

          return {
            ...nodo,
            data: {
              ...nodo.data,
              estado: estadoFinal,
              actualizar: actualizarMaterias,
            },
          };
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
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////MENU//////////////////////
// components/Menu.tsx
import { Plus, Pencil, Trash2, Download, BarChart3 } from "lucide-react";

export default function Menu() {
  const menuItems = [
    {
      icon: <Plus size={20} />,
      label: "Agregar Materia",
      color: "hover:text-green-400",
    },
    {
      icon: <Pencil size={20} />,
      label: "Editar Materia",
      color: "hover:text-blue-400",
    },
    {
      icon: <Trash2 size={20} />,
      label: "Borrar Materia",
      color: "hover:text-red-400",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Estadísticas",
      color: "hover:text-purple-400",
    },
    {
      icon: <Download size={20} />,
      label: "Exportar Datos",
      color: "hover:text-yellow-400",
    },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[100]">
      <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`text-white/60 transition-all duration-300 flex flex-col items-center gap-1 ${item.color} group`}
            title={item.label}
          >
            {item.icon}
            <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
