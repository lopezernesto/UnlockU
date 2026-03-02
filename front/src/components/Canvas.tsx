import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  type Viewport,
} from "@xyflow/react";
import { LayoutGrid } from "lucide-react";
import { useCarreraContext } from "../context/CarreraContext";
import useMaterias from "../hooks/useMaterias";
import { api } from "../services/api";

export default function Canvas() {
  const {
    materias,
    aniosDuracion,
    actualizarMaterias,
    resetKey,
    resetearPosiciones,
    carreraActual,
    isAuthenticated,
    isGuest,
  } = useCarreraContext();

  const { nodos, arcos, nodeTypes, onNodesChange, onEdgesChange } = useMaterias(
    {
      materias,
      aniosDuracion,
      actualizarMaterias,
      resetKey,
    },
  );

  const initialViewport: Viewport = JSON.parse(
    localStorage.getItem("react-flow-viewport") ||
      '{"x": 350, "y": 150, "zoom": 0.8}',
  );

  const onMoveEnd = useCallback((_: any, viewport: Viewport) => {
    localStorage.setItem("react-flow-viewport", JSON.stringify(viewport));
  }, []);

  const onNodeDragStop = useCallback(
    (_: any, node: any) => {
      const posiciones = JSON.parse(
        localStorage.getItem("nodos-posiciones") || "{}",
      );
      posiciones[node.id] = node.position;
      localStorage.setItem("nodos-posiciones", JSON.stringify(posiciones));

      if (isAuthenticated && !isGuest && carreraActual) {
        api
          .savePosicion({
            carreraId: carreraActual.id,
            materiaId: node.id,
            x: node.position.x,
            y: node.position.y,
          })
          .catch(console.error);
      }
    },
    [isAuthenticated, isGuest, carreraActual],
  );

  return (
    <ReactFlow
      key={resetKey}
      nodes={nodos}
      edges={arcos}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultViewport={initialViewport}
      onMoveEnd={onMoveEnd}
      minZoom={0.3}
      maxZoom={1.5}
      onNodeDragStop={onNodeDragStop}
    >
      <Background gap={20} />
      <Controls>
        <ControlButton onClick={resetearPosiciones} title="Reset Position">
          <LayoutGrid size={16} />
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
}
