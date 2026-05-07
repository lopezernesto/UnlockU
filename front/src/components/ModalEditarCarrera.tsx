import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CarreraResumen } from "../types/Carrera";

interface Props {
  carrera: CarreraResumen | null;
  onClose: () => void;
  onSave: (
    id: string,
    datos: { nombre: string; abreviacion: string },
  ) => Promise<string | null>;
}

export default function ModalEditarCarrera({
  carrera,
  onClose,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [abreviacion, setAbreviacion] = useState("");
  const [errorNombre, setErrorNombre] = useState<string | null>(null);
  const [errorAbreviacion, setErrorAbreviacion] = useState<string | null>(null);

  useEffect(() => {
    if (carrera) {
      setNombre(carrera.nombre);
      setAbreviacion(carrera.abreviacion);
      setErrorNombre(null);
      setErrorAbreviacion(null);
    }
  }, [carrera]);

  if (!carrera) return null;

  const handleSubmit = async () => {
    setErrorNombre(null);
    setErrorAbreviacion(null);

    if (!nombre.trim()) {
      setErrorNombre("El nombre es obligatorio");
      return;
    }
    if (!abreviacion.trim()) {
      setErrorAbreviacion("La abreviación es obligatoria");
      return;
    }

    const error = await onSave(carrera.id, { nombre, abreviacion });

    if (error) {
      if (error.toLowerCase().includes("nombre")) setErrorNombre(error);
      else setErrorAbreviacion(error);
      return;
    }

    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-[201] p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Editar Carrera</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            Nombre
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`w-full bg-white/5 border ${
              errorNombre ? "border-red-500/50" : "border-white/10"
            } rounded-xl p-3 mt-2 outline-none focus:border-blue-500/50 text-white transition-all`}
          />
          {errorNombre && (
            <p className="text-red-400 text-[11px] mt-1">{errorNombre}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            Abreviación
          </label>
          <input
            value={abreviacion}
            maxLength={5}
            onChange={(e) => setAbreviacion(e.target.value.toUpperCase())}
            className={`w-full bg-white/5 border ${
              errorAbreviacion ? "border-red-500/50" : "border-white/10"
            } rounded-xl p-3 mt-2 outline-none focus:border-blue-500/50 text-white transition-all`}
          />
          {errorAbreviacion && (
            <p className="text-red-400 text-[11px] mt-1">{errorAbreviacion}</p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}
