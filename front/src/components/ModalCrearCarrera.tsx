import { useState } from "react";
import { X, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    nombre: string;
    abreviacion: string;
    anios: number;
  }) => void;
  initialData?: { nombre: string; abreviacion: string; anios: number };
}

export default function ModalCrearCarrera({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) {
  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [abreviacion, setAbreviacion] = useState(
    initialData?.abreviacion || "",
  );
  const [anios, setAnios] = useState(initialData?.anios || 5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !abreviacion) return alert("Completá los campos che!");
    onSave({ nombre, abreviacion, anios });
    onClose();
    setNombre("");
    setAbreviacion("");
    setAnios(5);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">
            Configurar Carrera
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ej: Ingeniería en Sistemas"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/60 mb-1">
                Abreviación
              </label>
              <input
                type="text"
                maxLength={5}
                value={abreviacion}
                onChange={(e) => setAbreviacion(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Ej: ISI"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-white/60 mb-1">
                Años
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={anios}
                onChange={(e) => setAnios(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save size={18} />
            Confirmar y Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
