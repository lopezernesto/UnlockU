import { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { MateriaData } from "../types/Materia";
import { Award, CircleCheck, Pencil, RotateCcw, Trash2 } from "lucide-react";
import ModalEditarMateria from "./ModalEditarMateria";
import { ModalConfirmar } from "./ModalConfirmacion";
import { ModalAccionEstado } from "./ModalEstadoMateria";
export type TipoModal =
  | "BORRAR"
  | "REINICIAR"
  | "REGULARIZAR"
  | "APROBAR"
  | null;

interface MateriaNodeProps {
  data: MateriaData & {
    aniosDuracion: number;
    regularizar: (id: string, anio: string) => void;
    aprobar: (id: string, anio: string, nota: number) => void;
    resetear: (id: string) => void;
    borrar: (id: string) => void;
    editar: (id: string, nuevosDatos: Partial<MateriaData>) => void;
    todasLasMaterias: MateriaData[];
    obtenerMateriasPrevias: (anio: number, cuatri: number) => MateriaData[];
  };
}

export function MateriaNode({ data }: MateriaNodeProps) {
  //Logicas para girar y para la animacion de materia desbloqueada
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [progresoAnterior, setProgresoAnterior] = useState(0);
  //Logicas para los modales
  const [modalEdicion, setModalEdicion] = useState(false);
  const [modalEstados, setModalEstados] = useState<TipoModal>(null);
  const [mostrarBarra, setMostrarBarra] = useState(true);

  // Calcular progreso de correlativas
  const calcularProgreso = () => {
    const totalCorrelativas =
      data.correlativasCursada.length + data.correlativasFinal.length;
    if (totalCorrelativas === 0)
      return { completadas: 0, total: 0, porcentaje: 0 };

    const cursadasCompletadas = data.correlativasCursada.filter((idC) => {
      const materia = data.todasLasMaterias.find((m) => m.id === idC);
      return (
        materia &&
        (materia.estado === "CURSADA" || materia.estado === "APROBADA")
      );
    }).length;

    const finalesCompletados = data.correlativasFinal.filter((idF) => {
      const materia = data.todasLasMaterias.find((m) => m.id === idF);
      return materia && materia.estado === "APROBADA";
    }).length;

    const completadas = cursadasCompletadas + finalesCompletados;
    const porcentaje = (completadas / totalCorrelativas) * 100;

    return { completadas, total: totalCorrelativas, porcentaje };
  };

  const progreso = calcularProgreso();

  // Efecto para animar la barra al 100% antes de desaparecer
  useEffect(() => {
    if (data.estado === "BLOQUEADA") {
      setMostrarBarra(true);
      setProgresoAnterior(progreso.porcentaje);
    } else if (data.estado === "HABILITADA" && progresoAnterior < 100) {
      const timer = setTimeout(() => {
        setMostrarBarra(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setMostrarBarra(false);
    }
  }, [data.estado, progreso.porcentaje, progresoAnterior]);

  // Efecto para cuando habilitas una materia
  useEffect(() => {
    if (data.estado === "HABILITADA") {
      setIsUnlocking(true);
      const timer = setTimeout(() => setIsUnlocking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [data.estado]);

  // Efecto para cuando habilitas una materia
  useEffect(() => {
    if (data.estado === "HABILITADA") {
      setIsUnlocking(true);
      const timer = setTimeout(() => setIsUnlocking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [data.estado]);
  /*
  const colorClasses = {
    BLOQUEADA: "bg-slate-600 border-slate-800 text-slate-300",
    HABILITADA: `bg-blue-600 border-blue-900 text-white ${isUnlocking ? "animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.8)]" : ""}`,
    CURSADA: "bg-amber-500 border-amber-700 text-black",
    APROBADA: "bg-emerald-600 border-emerald-900 text-white",
  };

  */
  const colorClasses = {
    BLOQUEADA: "bg-slate-900/80 border-slate-800 text-slate-500",
    HABILITADA: `bg-slate-900/80 border-cyan-500 text-cyan-400 ${
      isUnlocking ? "animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.4)]" : ""
    }`,
    CURSADA: "bg-slate-900/80 border-amber-500 text-amber-500",
    APROBADA: "bg-slate-900/80 border-emerald-500 text-emerald-400",
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
              onClick={(e) => {
                e.stopPropagation();
                setModalEdicion(true);
              }}
              className="bg-slate-800 p-2 rounded-lg border border-white/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
              title="Editar"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setModalEstados("BORRAR")}
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
                  onClick={() => setModalEstados("REGULARIZAR")}
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
                  onClick={() => setModalEstados("APROBAR")}
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
                  onClick={() => setModalEstados("REINICIAR")}
                  disabled={data.estado === "HABILITADA"}
                  className={`p-2 rounded transition-all duration-200 flex items-center justify-center
          ${
            data.estado === "HABILITADA"
              ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
              : "bg-slate-700 hover:bg-cyan-500 text-white shadow-md active:scale-90"
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
          {mostrarBarra && progreso.total > 0 && (
            <div className="w-full px-2 space-y-1">
              <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-600 to-slate-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${data.estado === "HABILITADA" ? 100 : progreso.porcentaje}%`,
                  }}
                />
              </div>
              <div className="text-center text-[9px] opacity-50">
                {data.estado === "HABILITADA"
                  ? progreso.total
                  : progreso.completadas}
                /{progreso.total} correlativas
              </div>
            </div>
          )}
        </div>

        {/* Dorso de la carta */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180  flex flex-col p-4 text-sm rounded-lg border-4 shadow-xl ${colorClasses[data.estado]} cursor-pointer`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <h3 className="font-bold mb-3 text-center border-b pb-2">
            {data.nombre}
          </h3>

          {(data.estado === "BLOQUEADA" || data.estado === "HABILITADA") && (
            <div className="flex-1 overflow-y-auto space-y-2 text-[10px] leading-tight">
              {/* Correlativas para cursar */}
              {data.correlativasCursada.length > 0 && (
                <div>
                  <p className="font-semibold mb-0.5 text-amber-400 text-[11px]">
                    Necesitas cursar:
                  </p>
                  <ul className="space-y-0.5 pl-1">
                    {data.correlativasCursada.map((idC) => {
                      const materia = data.todasLasMaterias.find(
                        (m) => m.id === idC,
                      );
                      const completada =
                        materia &&
                        (materia.estado === "CURSADA" ||
                          materia.estado === "APROBADA");
                      return (
                        <li
                          key={idC}
                          className={`flex items-start gap-1 leading-tight ${
                            completada
                              ? "text-emerald-400 line-through opacity-60"
                              : ""
                          }`}
                        >
                          <span className="text-[8px] mt-0.5 flex-shrink-0">
                            {completada ? "✓" : "•"}
                          </span>
                          <span className="break-words">{materia?.nombre}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Correlativas para rendir final */}
              {data.correlativasFinal.length > 0 && (
                <div>
                  <p className="font-semibold mb-0.5 text-emerald-400 text-[11px]">
                    Necesitas aprobar:
                  </p>
                  <ul className="space-y-0.5 pl-1">
                    {data.correlativasFinal.map((idF) => {
                      const materia = data.todasLasMaterias.find(
                        (m) => m.id === idF,
                      );
                      const completada =
                        materia && materia.estado === "APROBADA";
                      return (
                        <li
                          key={idF}
                          className={`flex items-start gap-1 leading-tight ${
                            completada
                              ? "text-emerald-400 line-through opacity-60"
                              : ""
                          }`}
                        >
                          <span className="text-[8px] mt-0.5 flex-shrink-0">
                            {completada ? "✓" : "•"}
                          </span>
                          <span className="break-words">{materia?.nombre}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
          {data.estado !== "BLOQUEADA" && data.estado !== "HABILITADA" && (
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
          )}

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

      {modalEdicion && (
        <ModalEditarMateria
          aniosDuracion={data.aniosDuracion}
          materia={data}
          onClose={() => setModalEdicion(false)}
          onGuardar={data.editar}
          obtenerMateriasPrevias={data.obtenerMateriasPrevias}
          todasLasMaterias={data.todasLasMaterias}
        />
      )}

      {/* Modal de borrar */}
      {modalEstados === "BORRAR" && (
        <ModalConfirmar
          titulo="¿Eliminar Materia?"
          mensaje={`Vas a borrar ${data.nombre}. Esta acción es permanente.`}
          textoBoton="ELIMINAR"
          colorBoton="bg-rose-600"
          onConfirm={() => {
            data.borrar(data.id);
            setModalEstados(null);
          }}
          onClose={() => setModalEstados(null)}
        />
      )}

      {/* Modal de reiniciar */}
      {modalEstados === "REINICIAR" && (
        <ModalConfirmar
          titulo="¿Reiniciar Materia?"
          mensaje="Volverá a estar bloqueada o disponible según sus correlativas."
          textoBoton="REINICIAR"
          colorBoton="bg-cyan-500"
          onConfirm={() => {
            data.resetear(data.id);
            setModalEstados(null);
          }}
          onClose={() => setModalEstados(null)}
        />
      )}

      {/* Modal para regularizar o aprobar */}
      {(modalEstados === "REGULARIZAR" || modalEstados === "APROBAR") && (
        <ModalAccionEstado
          tipo={modalEstados}
          nombreMateria={data.nombre}
          onConfirm={(res) => {
            if (modalEstados === "REGULARIZAR") {
              data.regularizar(data.id, res.anio);
            } else {
              if (res.nota !== undefined)
                data.aprobar(data.id, res.anio, res.nota);
            }
            setModalEstados(null);
          }}
          onClose={() => setModalEstados(null)}
        />
      )}
    </div>
  );
}
