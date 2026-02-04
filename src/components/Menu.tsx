import { useState } from "react";
import { Plus, FileDown, FileUp, Library } from "lucide-react";
import SidebarMateria from "./SidebarMateria";
import { ModalConfirmar } from "./ModalConfirmacion";
import type { MateriaData } from "../types/Materia";

interface Props {
  agregarMateria: (m: any) => void;
  obtenerMateriasPrevias: (anio: number, cuatri: number) => any[];
  materias: MateriaData[];
  exportarProgreso: () => void;
  importarProgreso: (file: File) => void;
  cargarLCC: () => void;
  cargarADYSL: () => void;
}

export default function Menu({
  agregarMateria,
  obtenerMateriasPrevias,
  materias,
  importarProgreso,
  exportarProgreso,
  cargarLCC,
  cargarADYSL,
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [configModal, setConfigModal] = useState<{
    titulo: string;
    accion: () => void;
    color: string;
  } | null>(null);
  return (
    <>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[100]">
        <div className="bg-[#1a1a1a]/80 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white/60 hover:text-green-400 transition-colors flex flex-col items-center gap-1 group"
          >
            <Plus size={20} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              Agregar
            </span>
          </button>
          <button
            onClick={() =>
              setConfigModal({
                titulo: "Cargar Carrera LCC",
                color: "bg-purple-600 hover:bg-purple-500",
                accion: () => cargarLCC(),
              })
            }
            className="text-white/60 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1 group"
          >
            <Library size={20} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              LCC
            </span>
          </button>
          <button
            onClick={() =>
              setConfigModal({
                titulo: "Cargar Tecnicatura ADSL",
                color: "bg-purple-600 hover:bg-purple-500",
                accion: () => cargarADYSL(),
              })
            }
            className="text-white/60 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1 group"
          >
            <Library size={20} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Tec. ADYSL
            </span>
          </button>

          <button
            onClick={exportarProgreso}
            className="text-white/60 hover:text-blue-400 transition-colors flex flex-col items-center gap-1 group"
          >
            <FileDown size={20} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              Exportar
            </span>
          </button>

          <label className="text-white/60 hover:text-purple-400 transition-colors flex flex-col items-center gap-1 group cursor-pointer">
            <FileUp size={20} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              Importar
            </span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setConfigModal({
                    titulo: "Importar Progreso",
                    color: "bg-rose-600 hover:bg-rose-500",
                    accion: () => importarProgreso(file),
                  });
                }
              }}
            />
          </label>
        </div>
      </div>
      {configModal && (
        <ModalConfirmar
          titulo={configModal.titulo}
          mensaje="Perderás los cambios actuales. Se recomienda exportar antes de continuar."
          textoBoton="Confirmar"
          colorBoton={configModal.color}
          onConfirm={() => {
            configModal.accion();
            setConfigModal(null);
          }}
          onClose={() => setConfigModal(null)}
        />
      )}
      <SidebarMateria
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAgregar={agregarMateria}
        obtenerMateriasPrevias={obtenerMateriasPrevias}
        materias={materias}
      />
    </>
  );
}
