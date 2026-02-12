import { useState, useMemo, useEffect } from "react";
import { X, Search, Plus } from "lucide-react";
import type { MateriaData } from "../types/Materia";

interface Props {
  materia: MateriaData | null; // null = modal cerrado
  aniosDuracion: number;
  onClose: () => void;
  onGuardar: (id: string, cambios: Partial<MateriaData>) => void;
  obtenerMateriasPrevias: (anio: number, cuatri: number) => MateriaData[];
  todasLasMaterias: MateriaData[];
}

export default function ModalEditarMateria({
  materia,
  aniosDuracion,
  onClose,
  onGuardar,
  obtenerMateriasPrevias,
  todasLasMaterias,
}: Props) {
  const [nombre, setNombre] = useState(materia?.nombre || "");
  const [anio, setAnio] = useState(materia?.anio || 1);
  const [cuatri, setCuatri] = useState<1 | 2>(
    (materia?.cuatrimestre as 1 | 2) || 1,
  );
  const [busqueda, setBusqueda] = useState("");
  const [tabCorrelativa, setTabCorrelativa] = useState<"cursada" | "final">(
    "cursada",
  );
  const [errorNombre, setErrorNombre] = useState<string | null>(null);

  //Con esta funcion encuentro las correlativas y se muestran al abrir el modal la primera vez
  const encontrarMaterias = (ids: string[]) => {
    return ids
      .map((id) => todasLasMaterias.find((m) => m.id === id))
      .filter((m): m is MateriaData => !!m);
  };
  const [correlativasC, setCorrelativasC] = useState<MateriaData[]>(() =>
    materia ? encontrarMaterias(materia.correlativasCursada) : [],
  );
  const [correlativasF, setCorrelativasF] = useState<MateriaData[]>(() =>
    materia ? encontrarMaterias(materia.correlativasFinal) : [],
  );

  useEffect(() => {
    if (materia) {
      setNombre(materia.nombre);
      setAnio(materia.anio);
      setCuatri(materia.cuatrimestre as 1 | 2);
      setCorrelativasC(encontrarMaterias(materia.correlativasCursada));
      setCorrelativasF(encontrarMaterias(materia.correlativasFinal));
    }
  }, [materia, todasLasMaterias]);

  const aniosDisponibles = Array.from(
    { length: aniosDuracion },
    (_, i) => i + 1,
  );

  // Limpiar modal al cerrarlo
  useEffect(() => {
    if (!materia) {
      setBusqueda("");
      setErrorNombre(null);
    }
  }, [materia]);

  // Filtrado para el buscador
  const sugerencias = useMemo(() => {
    if (!busqueda.trim() || !materia) return [];
    const previas = obtenerMateriasPrevias(anio, cuatri);
    return previas.filter(
      (m) =>
        m.id !== materia.id && // No incluir la materia misma
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        !correlativasC.some((c) => c.id === m.id) &&
        !correlativasF.some((f) => f.id === m.id),
    );
  }, [
    busqueda,
    anio,
    cuatri,
    obtenerMateriasPrevias,
    correlativasC,
    correlativasF,
    materia,
  ]);

  // Guardar cambios
  const handleGuardar = () => {
    if (!nombre.trim() || !materia) return;

    const nombreExiste = todasLasMaterias.some(
      (m) =>
        m.id !== materia.id &&
        m.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
    );

    if (nombreExiste) {
      setErrorNombre("Ya existe otra materia con este nombre.");
      return;
    } else {
      setErrorNombre(null);
    }

    const cambios: Partial<MateriaData> = {
      nombre,
      anio,
      cuatrimestre: cuatri,
      correlativasCursada: correlativasC.map((m) => m.id),
      correlativasFinal: correlativasF.map((m) => m.id),
    };

    onGuardar(materia.id, cambios);
    onClose();
  };

  // Filtro inteligente al cambiar año/cuatrimestre
  useEffect(() => {
    if (!materia) return;

    const filtroInteligente = (lista: MateriaData[]) =>
      lista.filter(
        (m) => m.anio < anio || (m.anio === anio && m.cuatrimestre < cuatri),
      );

    setCorrelativasC((prev) => filtroInteligente(prev));
    setCorrelativasF((prev) => filtroInteligente(prev));
  }, [anio, cuatri, materia]);

  if (!materia) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-h-[85vh] bg-[#0f0f0f] border border-white/20 shadow-2xl z-[301] rounded-2xl p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Editar Materia
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
          {/* Nombre Input */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              Nombre de la Materia
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la materia..."
              className={`w-full bg-white/5 border ${
                errorNombre ? "border-red-500/50" : "border-white/10"
              } rounded-xl p-3 mt-3 outline-none focus:border-blue-500/50 text-white placeholder:text-white/10 transition-all`}
            />
            {errorNombre && (
              <p className="text-red-400 text-[11px] mt-2 ml-1 animate-pulse">
                {errorNombre}
              </p>
            )}
          </div>

          {/* Año */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              Año de la Materia
            </label>
            <div className="flex gap-2 mt-3">
              {aniosDisponibles.map((n) => (
                <button
                  key={n}
                  onClick={() => setAnio(n)}
                  className={`flex-1 py-2.5 rounded-lg border transition-all duration-200 font-bold text-sm ${
                    anio === n
                      ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                      : "bg-white/5 border-white/5 text-white/20 hover:text-white/60"
                  }`}
                >
                  {n}°
                </button>
              ))}
            </div>
          </div>

          {/* Cuatrimestre */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              Periodo
            </label>
            <div className="flex gap-2 mt-3 bg-white/5 p-1 rounded-xl border border-white/5">
              {[1, 2].map((c) => (
                <button
                  key={c}
                  onClick={() => setCuatri(c as 1 | 2)}
                  className={`flex-1 py-2 rounded-lg transition-all duration-300 text-xs font-bold ${
                    cuatri === c
                      ? "bg-[#1a1a1a] text-blue-400 shadow-xl"
                      : "text-white/20 hover:text-white/40"
                  }`}
                >
                  {c}° Cuatrimestre
                </button>
              ))}
            </div>
          </div>

          {/* Correlatividades */}
          <div className="pt-4 border-t border-white/5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              Correlatividades
            </label>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 mb-4">
              <button
                onClick={() => setTabCorrelativa("cursada")}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all border ${
                  tabCorrelativa === "cursada"
                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                    : "border-transparent text-white/20 hover:text-white/40"
                }`}
              >
                Cursada
              </button>
              <button
                onClick={() => setTabCorrelativa("final")}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all border ${
                  tabCorrelativa === "final"
                    ? "bg-green-500/10 border-green-500/50 text-green-400"
                    : "border-transparent text-white/20 hover:text-white/40"
                }`}
              >
                Final
              </button>
            </div>

            {/* Chips de correlativas */}
            <div className="space-y-3 mb-4">
              {correlativasC.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {correlativasC.map((m) => (
                    <span
                      key={m.id}
                      className="bg-blue-500/10 border border-blue-500/20 text-blue-400/80 px-2 py-1 rounded text-[10px] flex items-center gap-1"
                    >
                      {m.nombre}
                      <X
                        size={12}
                        className="cursor-pointer hover:text-white"
                        onClick={() =>
                          setCorrelativasC((prev) =>
                            prev.filter((c) => c.id !== m.id),
                          )
                        }
                      />
                    </span>
                  ))}
                </div>
              )}
              {correlativasF.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {correlativasF.map((m) => (
                    <span
                      key={m.id}
                      className="bg-green-500/10 border border-green-500/20 text-green-400/80 px-2 py-1 rounded text-[10px] flex items-center gap-1"
                    >
                      {m.nombre}
                      <X
                        size={12}
                        className="cursor-pointer hover:text-white"
                        onClick={() =>
                          setCorrelativasF((prev) =>
                            prev.filter((c) => c.id !== m.id),
                          )
                        }
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Buscador */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
              />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={`Buscar para ${tabCorrelativa}...`}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 pl-9 outline-none text-sm text-white focus:border-white/20 transition-all"
              />

              {sugerencias.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-white/20 rounded-xl mt-2 shadow-2xl z-[310] overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-[180px] overflow-y-auto scrollbar-hide">
                    {sugerencias.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (tabCorrelativa === "cursada")
                            setCorrelativasC([...correlativasC, s]);
                          else setCorrelativasF([...correlativasF, s]);
                          setBusqueda("");
                        }}
                        className="p-3 hover:bg-white/5 cursor-pointer text-[13px] text-white/70 flex items-center justify-between border-b border-white/5 last:border-none transition-colors group"
                      >
                        <span className="truncate mr-2">{s.nombre}</span>
                        <Plus
                          size={14}
                          className={`${tabCorrelativa === "cursada" ? "text-blue-500" : "text-green-500"} group-hover:scale-125 transition-transform flex-shrink-0`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <button
          onClick={handleGuardar}
          disabled={!nombre.trim()}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white font-black py-4 rounded-2xl mt-6 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          GUARDAR CAMBIOS
        </button>
      </div>
    </>
  );
}
