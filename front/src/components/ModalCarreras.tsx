import { X, Pencil, Trash2 } from "lucide-react";
import type { CarreraResumen } from "../types/Carrera";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  carreras: CarreraResumen[];
  onSeleccionar: (id: string) => void;
  onEditar: (carrera: CarreraResumen) => void;
  onBorrar: (carrera: CarreraResumen) => void;
}

export default function ModalCarreras({
  isOpen,
  onClose,
  carreras,
  onSeleccionar,
  onEditar,
  onBorrar,
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-h-[500px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-[201] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Mis Carreras
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2 scrollbar-hide">
          {carreras.map((c) => (
            <div
              key={c.id}
              className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
            >
              {/* Círculo + nombre: cargan la carrera */}
              <button
                onClick={() => {
                  onSeleccionar(c.id);
                  onClose();
                }}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <span className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {c.abreviacion}
                </span>
                <span className="text-white/70 group-hover:text-white text-sm text-left transition-colors truncate">
                  {c.nombre}
                </span>
              </button>

              {/* Botones editar/borrar */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => onEditar(c)}
                  className="text-white/40 hover:text-blue-400 transition-colors p-1"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onBorrar(c)}
                  className="text-white/40 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
