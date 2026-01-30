import { ReactFlow, Background, Controls, ControlButton } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useMaterias from "./hooks/useMaterias";
import { LayoutGrid } from "lucide-react";
import Menu from "./components/Menu";

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
        fitView
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
