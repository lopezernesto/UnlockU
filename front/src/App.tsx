import "@xyflow/react/dist/style.css";
import Menu from "./components/Menu";
import Header from "./components/Header";
import MensajeBienvenida from "./components/Bienvenida";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./components/Login";
import PanelUsuario from "./components/PanelUsuario";
import { CarreraProvider, useCarreraContext } from "./context/CarreraContext";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Canvas from "./components/Canvas";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout, enableGuestMode } =
    useAuthContext();

  const { carreraActual } = useCarreraContext();

  const hayCarrera = carreraActual !== null;

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

      {hayCarrera && <Canvas />}
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
