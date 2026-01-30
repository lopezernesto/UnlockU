import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import SidebarMateria from "./SidebarMateria";
import type { MateriaData } from "../types/Materia";

interface Props {
  agregarMateria: (m: any) => void;
  obtenerMateriasPrevias: (anio: number, cuatri: number) => any[];
  materias: MateriaData[];
}

export default function Menu({
  agregarMateria,
  obtenerMateriasPrevias,
  materias,
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

          <button className="text-white/60 hover:text-blue-400 transition-colors flex flex-col items-center gap-1 group">
            <Pencil size={20} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              Editar
            </span>
          </button>
        </div>
      </div>

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
