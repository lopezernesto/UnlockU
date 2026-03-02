import { useState } from "react";
import { X, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    nombre: string;
    abreviacion: string;
    anios: number;
    id?: string;
  }) => Promise<string | null>;
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

  const [errorNombre, setErrorNombre] = useState<string | null>(null);
  const [errorAbreviacion, setErrorAbreviacion] = useState<string | null>(null);

  if (!isOpen) return null;
  const reiniciarCampos = () => {
    setNombre("");
    setAbreviacion("");
    setAnios(5);
    setErrorAbreviacion(null);
    setErrorNombre(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNombre(null);
    setErrorAbreviacion(null);

    if (!nombre || !abreviacion) {
      if (!nombre) setErrorNombre("El nombre es obligatorio");
      if (!abreviacion) setErrorAbreviacion("La abreviación es obligatoria");
      return;
    }

    const error = await onSave({ nombre, abreviacion, anios });

    if (error) {
      if (error.toLowerCase().includes("nombre")) setErrorNombre(error);
      else setErrorAbreviacion(error);
      return;
    }
    onClose();
    reiniciarCampos();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">
            Configurar Carrera
          </h2>
          <button
            onClick={() => {
              onClose();
              reiniciarCampos();
            }}
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
              className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors ${errorNombre ? "border-red-500/50" : "border-white/10"}`}
              placeholder="Ej: Ingeniería en Sistemas"
            />
            {errorNombre && (
              <p className="text-red-400 text-[11px] mt-1">{errorNombre}</p>
            )}
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
                className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors ${errorAbreviacion ? "border-red-500/50" : "border-white/10"}`}
                placeholder="Ej: ISI"
              />
              {errorAbreviacion && (
                <p className="text-red-400 text-[11px] mt-1">
                  {errorAbreviacion}
                </p>
              )}
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
