import { useState } from "react";
import {
  Plus,
  FileUp,
  Library,
  BarChart3,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import SidebarMateria from "./SidebarMateria";
import { useCarreraContext } from "../context/CarreraContext";
import ModalCrearCarrera from "./ModalCrearCarrera";
import { ModalConfirmar } from "./ModalConfirmacion";
import { useCarrerasCustom } from "../hooks/useCarreraCustom";

type MenuLevel = "INICIO" | "MIS_CARRERAS";

export default function Menu() {
  const {
    carreraActual,
    cargarLCC,
    cargarADYSL,
    importarProgreso,
    cambiarCarrera,
    crearNuevaCarrera,
    cargarCarreraCustom,
    isGuest,
    isAuthenticated,
  } = useCarreraContext();

  const [nivel, setNivel] = useState<MenuLevel>("INICIO");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmar, setIsConfirmar] = useState(false);
  const hayCarrera = carreraActual !== null;

  const { carreras: carrerasCustom, crearCarrera } = useCarrerasCustom(
    isAuthenticated,
    isGuest,
  );

  return (
    <>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[100]">
        <div className="bg-[#1a1a1a]/80 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-6 items-center">
          {/* NIVEL 3: CARRERA ACTIVA (Se muestra si hay una carrera seleccionada) */}
          {hayCarrera ? (
            <>
              <button
                onClick={() => {
                  cambiarCarrera();
                  if (!isGuest) setNivel("MIS_CARRERAS");
                  else {
                    setIsConfirmar(true);
                    setNivel("INICIO");
                  }
                }}
                className="text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1 group"
              >
                <ChevronLeft size={20} />
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  Volver
                </span>
              </button>
              <div className="h-px w-full bg-white/10" />
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-white/60 hover:text-green-400 flex flex-col items-center gap-1 group"
              >
                <Plus size={20} />
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  Materia
                </span>
              </button>
              <button className="text-white/20 cursor-not-allowed flex flex-col items-center gap-1 group">
                <BarChart3 size={20} />
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  Stats
                </span>
              </button>
            </>
          ) : (
            /* NIVELES 1 y 2: Sin carrera seleccionada */
            <>
              {nivel === "INICIO" ? (
                <>
                  <button
                    onClick={cargarLCC}
                    className="text-white/60 hover:text-cyan-400 flex flex-col items-center gap-1 group"
                  >
                    <Library size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      LCC
                    </span>
                  </button>
                  <button
                    onClick={cargarADYSL}
                    className="text-white/60 hover:text-cyan-400 flex flex-col items-center gap-1 group"
                  >
                    <Library size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      ADYSL
                    </span>
                  </button>
                  <button
                    onClick={() => setNivel("MIS_CARRERAS")}
                    className={
                      isGuest
                        ? "text-white/20 cursor-not-allowed flex flex-col items-center gap-1 group"
                        : "text-white/60 hover:text-green-400 flex flex-col items-center gap-1 group"
                    }
                    disabled={isGuest}
                    title={
                      isGuest ? "Función no disponible para invitados" : ""
                    }
                  >
                    <GraduationCap size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Mis Carreras
                    </span>
                  </button>
                  <label className="text-white/60 hover:text-purple-400 flex flex-col items-center gap-1 group cursor-pointer">
                    <FileUp size={20} />
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) importarProgreso(file);
                      }}
                    />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Importar
                    </span>
                  </label>
                </>
              ) : (
                /* NIVEL 2: MIS CARRERAS */
                <>
                  <button
                    onClick={() => setNivel("INICIO")}
                    className="text-white/60 hover:text-white flex flex-col items-center gap-1 group"
                  >
                    <ChevronLeft size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Volver
                    </span>
                  </button>
                  <div className="h-px w-full bg-white/10" />
                  {/* Lista de Recientes */}
                  {carrerasCustom.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        cargarCarreraCustom(c.id);
                      }}
                      className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-400 flex items-center justify-center text-xs font-bold hover:bg-blue-600/40 transition-all group relative"
                    >
                      {c.abreviacion}
                      <span className="absolute right-12 bg-[#1a1a1a] border border-white/10 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {c.nombre}
                      </span>
                    </button>
                  ))}
                  <button
                    className="text-white/60 hover:text-green-400 flex flex-col items-center gap-1 group"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Crear
                    </span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <SidebarMateria
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isConfirmar && (
        <ModalConfirmar
          titulo="¿Cambiar de carrera?"
          mensaje="Perderás los cambios actuales si no exportaste tu progreso. ¿Querés continuar?"
          textoBoton="Cambiar"
          colorBoton="bg-purple-600 hover:bg-purple-500"
          onConfirm={() => {
            cambiarCarrera();
            setIsConfirmar(false);
          }}
          onClose={() => setIsConfirmar(false)}
        />
      )}
      <ModalCrearCarrera
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (datos) => {
          if (isAuthenticated && !isGuest) {
            // Usuario logueado: guardar en backend
            const carreraGuardada = await crearCarrera({
              id: crypto.randomUUID(),
              nombre: datos.nombre,
              abreviacion: datos.abreviacion,
              aniosDuracion: datos.anios,
              materias: [],
            });
            cargarCarreraCustom(carreraGuardada.id);
          } else {
            // Invitado: solo localStorage
            crearNuevaCarrera(datos);
          }
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
