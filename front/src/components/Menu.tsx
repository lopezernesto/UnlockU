import { useState } from "react";
import {
  Plus,
  FileUp,
  Library,
  BarChart3,
  ChevronLeft,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react";
import SidebarMateria from "./SidebarMateria";
import { useCarreraContext } from "../context/CarreraContext";
import ModalCrearCarrera from "./ModalCrearCarrera";
import { ModalConfirmar } from "./ModalConfirmacion";
import { useCarrerasCustom } from "../hooks/useCarreraCustom";
import { api } from "../services/api";
import { carreraLCC } from "../data/LCC";
import { carreraTUASSL } from "../data/TUASSL";
import { carreraLSI } from "../data/LSI";
import { carreraTUDW } from "../data/TUDW";
import ModalCarreras from "./ModalCarreras";
import type { CarreraResumen } from "../types/Carrera";
import ModalEditarCarrera from "./ModalEditarCarrera";

type MenuLevel = "INICIO" | "MIS_CARRERAS";

export default function Menu() {
  const {
    carreraActual,
    cargarLCC,
    cargarLSI,
    cargarTUASSL,
    cargarTUDW,
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
  const [carreraAConfirmar, setCarreraAConfirmar] = useState<
    "LCC" | "TUASSL" | "TUDW" | "LSI" | null
  >(null);
  const [isModalCarrerasOpen, setIsModalCarrerasOpen] = useState(false);
  const [carreraEditando, setCarreraEditando] = useState<CarreraResumen | null>(
    null,
  );
  const [carreraAEliminar, setCarreraAEliminar] =
    useState<CarreraResumen | null>(null);

  const hayCarrera = carreraActual !== null;

  const {
    carreras: carrerasCustom,
    crearCarrera,
    actualizarCarrera,
    borrarCarrera,
  } = useCarrerasCustom(isAuthenticated, isGuest);

  // Ordenar por más recientes y tomar las 3 últimas
  const carrerasRecientes = [...carrerasCustom]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);

  return (
    <>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[100]">
        <div className="bg-[#1a1a1a]/80 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-6 items-center">
          {/* NIVEL 3: CARRERA ACTIVA (Se muestra si hay una carrera seleccionada) */}
          {hayCarrera ? (
            <>
              <button
                onClick={() => {
                  if (!isGuest) {
                    setNivel("MIS_CARRERAS");
                    cambiarCarrera();
                  } else {
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
                    onClick={async () => {
                      if (isAuthenticated && !isGuest) {
                        try {
                          await api.getCarrera(carreraLCC.id);
                          setCarreraAConfirmar("LCC");
                        } catch {
                          cargarLCC();
                        }
                      } else {
                        cargarLCC();
                      }
                    }}
                    className="text-white/60 hover:text-cyan-400 flex flex-col items-center gap-1 group"
                  >
                    <Library size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      LCC
                    </span>
                  </button>

                  <button
                    onClick={async () => {
                      if (isAuthenticated && !isGuest) {
                        try {
                          await api.getCarrera(carreraLSI.id);
                          setCarreraAConfirmar("LSI");
                        } catch {
                          cargarLSI();
                        }
                      } else {
                        cargarLSI();
                      }
                    }}
                    className="text-white/60 hover:text-cyan-400 flex flex-col items-center gap-1 group"
                  >
                    <Library size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      LSI
                    </span>
                  </button>
                  <button
                    onClick={async () => {
                      if (isAuthenticated && !isGuest) {
                        try {
                          await api.getCarrera(carreraTUDW.id);
                          setCarreraAConfirmar("TUDW");
                        } catch {
                          cargarTUDW();
                        }
                      } else {
                        cargarTUDW();
                      }
                    }}
                    className="text-white/60 hover:text-cyan-400 flex flex-col items-center gap-1 group"
                  >
                    <Library size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      TUDW
                    </span>
                  </button>

                  <button
                    onClick={async () => {
                      if (isAuthenticated && !isGuest) {
                        try {
                          await api.getCarrera(carreraTUASSL.id);
                          setCarreraAConfirmar("TUASSL");
                        } catch {
                          cargarTUASSL();
                        }
                      } else {
                        cargarTUASSL();
                      }
                    }}
                    className="text-white/60 hover:text-cyan-400 flex flex-col items-center gap-1 group"
                  >
                    <Library size={20} />
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      TUASSL
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
                  {isGuest && (
                    <button
                      className="text-white/60 hover:text-green-400 flex flex-col items-center gap-1 group"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Plus size={20} />
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        Crear
                      </span>
                    </button>
                  )}
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
                  {carrerasRecientes.map((c) => (
                    <div key={c.id} className="relative group/circulo">
                      <button
                        onClick={() => cargarCarreraCustom(c.id)}
                        className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-400 flex items-center justify-center text-xs font-bold hover:bg-blue-600/40 transition-all relative overflow-hidden"
                      >
                        <span className="group-hover/circulo:translate-y-10 opacity-100 group-hover/circulo:opacity-0 transition-all duration-200">
                          {c.abreviacion}
                        </span>

                        {/* Botones de edicion/borrado */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover/circulo:opacity-100 transition-opacity bg-blue-600/10 backdrop-blur-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarreraEditando(c);
                            }}
                            className="p-1 hover:text-white transition-colors"
                            title="Editar carrera"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarreraAEliminar(c);
                            }}
                            className="p-1 hover:text-red-400 transition-colors"
                            title="Borrar carrera"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </button>

                      {/* Tooltip nombre */}
                      <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-white/10 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover/circulo:opacity-100 transition-opacity pointer-events-none z-[110]">
                        {c.nombre}
                      </span>
                    </div>
                  ))}
                  {carrerasCustom.length > 3 && (
                    <button
                      onClick={() => setIsModalCarrerasOpen(true)}
                      className="text-white/40 hover:text-white/80 flex flex-col items-center gap-1 group"
                    >
                      <span className="text-[10px]">•••</span>
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver todas
                      </span>
                    </button>
                  )}
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

      {carreraAConfirmar && (
        <ModalConfirmar
          titulo="¿Reemplazar carrera?"
          mensaje="Ya tenés esta carrera guardada. ¿Querés reemplazar tu progreso actual?"
          textoBoton="Reemplazar"
          colorBoton="bg-red-600 hover:bg-red-500"
          onConfirm={() => {
            switch (carreraAConfirmar) {
              case "LCC":
                api.deleteProgresoCarrera(carreraLCC.id).catch(() => {});
                api.deletePosiciones(carreraLCC.id).catch(() => {});
                cargarLCC();
                break;
              case "LSI":
                api.deleteProgresoCarrera(carreraLSI.id).catch(() => {});
                api.deletePosiciones(carreraLSI.id).catch(() => {});
                cargarLSI();
                break;
              case "TUASSL":
                api.deleteProgresoCarrera(carreraTUASSL.id).catch(() => {});
                api.deletePosiciones(carreraTUASSL.id).catch(() => {});
                cargarTUASSL();
                break;
              case "TUDW":
                api.deleteProgresoCarrera(carreraTUDW.id).catch(() => {});
                api.deletePosiciones(carreraTUDW.id).catch(() => {});
                cargarTUDW();
                break;
              default:
                break;
            }
            setCarreraAConfirmar(null);
          }}
          onClose={() => setCarreraAConfirmar(null)}
        />
      )}

      <ModalCrearCarrera
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (datos) => {
          if (isAuthenticated && !isGuest) {
            try {
              // Usuario logueado: guardar en backend
              const carreraGuardada = await crearCarrera({
                id: crypto.randomUUID(),
                nombre: datos.nombre,
                abreviacion: datos.abreviacion,
                aniosDuracion: datos.anios,
                materias: [],
              });
              cargarCarreraCustom(carreraGuardada.id);
              return null;
            } catch (err: any) {
              return err.message;
            }
          } else {
            // Invitado: solo localStorage
            crearNuevaCarrera(datos);
            return null;
          }
        }}
      />
      <ModalCarreras
        isOpen={isModalCarrerasOpen}
        onClose={() => setIsModalCarrerasOpen(false)}
        carreras={carrerasCustom}
        onSeleccionar={(id) => cargarCarreraCustom(id)}
        onEditar={(c) => setCarreraEditando(c)}
        onBorrar={(c) => setCarreraAEliminar(c)}
      />
      <ModalEditarCarrera
        carrera={carreraEditando}
        onClose={() => setCarreraEditando(null)}
        onSave={async (id, datos) => {
          try {
            await actualizarCarrera(id, datos);
            return null;
          } catch (err: any) {
            return err.message;
          }
        }}
      />

      {carreraAEliminar && (
        <ModalConfirmar
          titulo="¿Borrar carrera?"
          mensaje={`¿Estás seguro que querés borrar "${carreraAEliminar.nombre}"? Esta acción no se puede deshacer.`}
          textoBoton="Borrar"
          colorBoton="bg-red-600 hover:bg-red-500"
          onConfirm={() => {
            borrarCarrera(carreraAEliminar.id);
            setCarreraAEliminar(null);
          }}
          onClose={() => setCarreraAEliminar(null)}
          zIndex="z-[300]"
        />
      )}
    </>
  );
}
