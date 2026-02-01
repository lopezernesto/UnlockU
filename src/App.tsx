import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useMaterias from "./hooks/useMaterias";
import { LayoutGrid } from "lucide-react";
import Menu from "./components/Menu";
import { useCallback } from "react";

export default function App() {
  const {
    nodos,
    arcos,
    nodeTypes,
    onNodesChange,
    onEdgesChange,
    resetearPosiciones,
    agregarMateria,
    obtenerMateriasPrevias,
    materias,
  } = useMaterias();

  const initialViewport: Viewport = JSON.parse(
    localStorage.getItem("react-flow-viewport") ||
      '{"x": 350, "y": 60, "zoom": 0.8}',
  );

  const onMoveEnd = useCallback((_: any, viewport: Viewport) => {
    localStorage.setItem("react-flow-viewport", JSON.stringify(viewport));
  }, []);
  const onNodeDragStop = useCallback((_: any, node: any) => {
    const posiciones = JSON.parse(
      localStorage.getItem("nodos-posiciones") || "{}",
    );
    posiciones[node.id] = node.position;
    localStorage.setItem("nodos-posiciones", JSON.stringify(posiciones));
  }, []);
  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#000000" }}
    >
      <ReactFlow
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
        <Menu
          agregarMateria={agregarMateria}
          obtenerMateriasPrevias={obtenerMateriasPrevias}
          materias={materias}
        />
      </ReactFlow>
    </div>
  );
}
