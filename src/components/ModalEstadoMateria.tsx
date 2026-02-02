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
      <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs w-full">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          {tipo === "APROBAR"
            ? `Aprobar ${nombreMateria}`
            : `Regularizar ${nombreMateria}`}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Año</label>
            <input
              type="number"
              className="nodrag nopan w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
            />
          </div>

          {tipo === "APROBAR" && (
            <div>
              <label className="text-xs text-white/40 block mb-1">Nota</label>
              <input
                type="number"
                min="1"
                max="10"
                className="nodrag nopan w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-green-500"
                value={nota}
                onChange={(e) => setNota(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <button
          onClick={() =>
            onConfirm({ anio, nota: tipo === "APROBAR" ? nota : undefined })
          }
          className={`w-full py-3 rounded-xl font-bold text-white mt-6 transition-all ${
            tipo === "APROBAR" ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          CONFIRMAR
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 py-2 text-white/40 text-sm italic"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
