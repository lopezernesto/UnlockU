import { useState } from "react";

interface AccionProps {
  tipo: "REGULARIZAR" | "APROBAR";
  nombreMateria: string;
  onConfirm: (datos: { anio: string; nota?: number }) => void;
  onClose: () => void;
}

export function ModalAccionEstado({
  tipo,
  nombreMateria,
  onConfirm,
  onClose,
}: AccionProps) {
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [nota, setNota] = useState(7);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl min-w-[700px]">
        <h3 className="text-lg font-bold text-white mb-6 text-center">
          {tipo === "APROBAR"
            ? `Aprobar ${nombreMateria}`
            : `Regularizar ${nombreMateria}`}
        </h3>

        <div className="flex items-end gap-6">
          <div className="flex-1 flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-white/40 block mb-2">Año</label>
              <input
                type="number"
                className="nodrag nopan w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
              />
            </div>

            {tipo === "APROBAR" && (
              <div className="flex-1">
                <label className="text-xs text-white/40 block mb-2">Nota</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="nodrag nopan w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-green-500 transition-colors"
                  value={nota}
                  onChange={(e) => setNota(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                onConfirm({ anio, nota: tipo === "APROBAR" ? nota : undefined })
              }
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 ${
                tipo === "APROBAR"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              CONFIRMAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
