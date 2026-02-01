import { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { MateriaData, EstadoMateria } from "../types/Materia";
import { Award, CircleCheck, Pencil, RotateCcw, Trash2 } from "lucide-react";

interface MateriaNodeProps {
  data: MateriaData & {
    actualizar: (id: string, estado: EstadoMateria) => void;
    borrar: (id: string) => void;
    editar: (id: string, nuevosDatos: Partial<MateriaData>) => void;
  };
}

export function MateriaNode({ data }: MateriaNodeProps) {
  //Logicas para girar y para la animacion de materia desbloqueada
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  //Handlers de edicion y borrado
  const handleBorrar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se disparen eventos del nodo
    if (window.confirm(`¿Seguro que querés borrar ${data.nombre}?`)) {
      data.borrar(data.id);
    }
  };

  const handleEditar = (e: React.MouseEvent) => {
    e.stopPropagation();
    //data.abrirEdicion(data); // Paso toda la data al sidebar de edición
  };

  // Efecto para cuando habilitas una materia
  useEffect(() => {
    if (data.estado === "HABILITADA") {
      setIsUnlocking(true);
      const timer = setTimeout(() => setIsUnlocking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [data.estado]);

  const colorClasses = {
    BLOQUEADA: "bg-slate-600 border-slate-800 text-slate-300",
    HABILITADA: `bg-blue-600 border-blue-900 text-white ${isUnlocking ? "animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.8)]" : ""}`,
    CURSADA: "bg-amber-500 border-amber-700 text-black",
    APROBADA: "bg-emerald-600 border-emerald-900 text-white",
  };

  //Logica para los botones de cambio de estado
  const regularizarMateria = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que voltee la carta
    if (data.estado === "HABILITADA") {
      data.actualizar(data.id, "CURSADA");
    }
  };

  const aprobarFinal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.estado === "CURSADA") {
      data.actualizar(data.id, "APROBADA");
    }
  };

  const resetearMateria = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.estado === "CURSADA" || data.estado === "APROBADA") {
      data.actualizar(data.id, "HABILITADA");
    }
  };

  return (
    <div className="group w-48 h-64 perspective-1000">
      {/* Conectores para las flechas */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 opacity-0"
      />

      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Frente de carta*/}
        <div
          className={`absolute inset-0 backface-hidden flex flex-col items-center justify-between p-3 rounded-lg border-4 shadow-xl ${colorClasses[data.estado]}`}
        >
          {/* Botones de borrar y editar */}
          <div className="absolute -top-10 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleEditar}
              className="bg-slate-800 p-2 rounded-lg border border-white/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
              title="Editar"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleBorrar}
              className="bg-slate-800 p-2 rounded-lg border border-white/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
              title="Borrar"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {/* Nombre */}
          <div
            className="flex-1 flex items-center justify-center text-center font-bold cursor-pointer px-2"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {data.nombre}
          </div>
          {/* Botones de las cartas*/}
          <div className="flex gap-2 justify-center pb-2">
            {data.estado !== "BLOQUEADA" ? (
              <>
                {/* Para cuando regularizas la materia */}
                <button
                  onClick={regularizarMateria}
                  disabled={
                    data.estado === "CURSADA" || data.estado === "APROBADA"
                  }
                  className={`p-2 rounded transition-all duration-200 flex items-center justify-center
          ${
            data.estado === "CURSADA" || data.estado === "APROBADA"
              ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
              : "bg-slate-700 hover:bg-amber-600 text-white shadow-md active:scale-90"
          }`}
                  title="Marcar como Cursada"
                  aria-label="Marcar como Cursada"
                >
                  <CircleCheck size={18} />
                </button>

                {/* Para cuando aprobas el final */}
                <button
                  onClick={aprobarFinal}
                  disabled={
                    data.estado === "HABILITADA" || data.estado === "APROBADA"
                  }
                  className={`p-2 rounded transition-all duration-200 flex items-center justify-center
          ${
            data.estado === "HABILITADA" || data.estado === "APROBADA"
              ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
              : "bg-slate-700 hover:bg-emerald-600 text-white shadow-md active:scale-90"
          }`}
                  title="Cargar Final"
                >
                  <Award size={18} />
                </button>

                {/* Para resetear la materia */}
                <button
                  onClick={resetearMateria}
                  disabled={data.estado === "HABILITADA"}
                  className={`p-2 rounded transition-all duration-200 flex items-center justify-center
          ${
            data.estado === "HABILITADA"
              ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
              : "bg-slate-700 hover:bg-rose-600 text-white shadow-md active:scale-90"
          }`}
                  title="Resetear Materia"
                >
                  <RotateCcw size={18} />
                </button>
              </>
            ) : (
              <div className="text-center text-[10px] font-bold uppercase tracking-wider opacity-60 py-2">
                Materia Bloqueada
              </div>
            )}
          </div>
        </div>

        {/* Dorso de la carta */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col p-4 text-sm rounded-lg border-4 shadow-xl ${colorClasses[data.estado]} cursor-pointer`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <h3 className="font-bold mb-3 text-center border-b pb-2">
            {data.nombre}
          </h3>
          <div className="space-y-2 flex-1">
            <p>
              <strong>Año cursada:</strong> {data.anioCursada || "--"}
            </p>
            <p>
              <strong>Año final:</strong> {data.anioFinal || "--"}
            </p>
            <p>
              <strong>Nota:</strong> {data.nota || "--"}
            </p>
          </div>
          <p className="text-xs text-center opacity-75 mt-2">
            Click para volver
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 opacity-0"
      />
    </div>
  );
}
