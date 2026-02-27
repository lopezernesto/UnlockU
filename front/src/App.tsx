import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { LayoutGrid } from "lucide-react";
import Menu from "./components/Menu";
import Header from "./components/Header";
import MensajeBienvenida from "./components/Bienvenida";
import { useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./components/Login";
import PanelUsuario from "./components/PanelUsuario";
import { CarreraProvider, useCarreraContext } from "./context/CarreraContext";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { api } from "./services/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const {
    user,
    isAuthenticated,
    isGuest,
    isLoading,
    login,
    logout,
    enableGuestMode,
  } = useAuthContext();

  const {
    carreraActual,
    resetKey,
    nodos,
    arcos,
    nodeTypes,
    onNodesChange,
    onEdgesChange,
    resetearPosiciones,
  } = useCarreraContext();

  const hayCarrera = carreraActual !== null;

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

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white/50 text-sm">Cargando...</div>
      </div>
    );
  }

  // Pantalla de login
  if (!isAuthenticated) {
    return <Login onLogin={login} onGuestAccess={enableGuestMode} />;
  }

  // App principal (usuario logueado)
  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#000000" }}
    >
      <PanelUsuario user={user} onLogout={logout} />
      {!hayCarrera && <MensajeBienvenida />}

      {hayCarrera && <Header />}

      <Menu />

      {hayCarrera && (
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
      )}
    </div>
  );
}
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CarreraProvider>
          <AppContent />
          <ReactQueryDevtools initialIsOpen={false} />
        </CarreraProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
