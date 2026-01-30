import { useState, useMemo, useEffect } from "react";
import { X, Search, Plus } from "lucide-react";
import type { MateriaData } from "../types/Materia";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAgregar: (materia: MateriaData) => void;
  obtenerMateriasPrevias: (anio: number, cuatri: number) => MateriaData[];
  materias: MateriaData[];
}

export default function SidebarMateria({
  isOpen,
  onClose,
  onAgregar,
  obtenerMateriasPrevias,
  materias,
}: Props) {
  //Logica para agregar materia y elegir correlativas(Cursada y Final)
  const [nombre, setNombre] = useState("");
  const [anio, setAnio] = useState(1);
  const [cuatri, setCuatri] = useState<1 | 2>(1);
  const [busqueda, setBusqueda] = useState("");
  const [tabCorrelativa, setTabCorrelativa] = useState<"cursada" | "final">(
    "cursada",
  );

  const [correlativasC, setCorrelativasC] = useState<MateriaData[]>([]);
  const [correlativasF, setCorrelativasF] = useState<MateriaData[]>([]);

  const [errorNombre, setErrorNombre] = useState<string | null>(null);

  // Logica de filtrado para el buscador
  const sugerencias = useMemo(() => {
    if (!busqueda.trim()) return [];
    const previas = obtenerMateriasPrevias(anio, cuatri);
    return previas.filter(
      (m) =>
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
  ]);

  //Agregar materia
  const handleCrear = () => {
    if (!nombre.trim()) return;

    const nombreExiste = materias.some(
      (m) => m.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
    );

    if (nombreExiste) {
      setErrorNombre("Esta materia ya existe.");
      return;
    } else {
      setErrorNombre(null);
    }
    const nuevaMateria: MateriaData = {
      id: crypto.randomUUID(),
      nombre,
      anio,
      cuatrimestre: cuatri,
      estado: "HABILITADA", // El hook se encarga de validar esto
      correlativasCursada: correlativasC.map((m) => m.id),
      correlativasFinal: correlativasF.map((m) => m.id),
    };

    onAgregar(nuevaMateria);

    // Resetear estados y cerrar
    setNombre("");
    setCorrelativasC([]);
    setCorrelativasF([]);
    onClose();
  };

  //Este useEffect se asegura de que al cambiar año o cuatrimestre, las correlativas seleccionadas sigan siendo validas
  //Ej: al agregar una materia de 2do cuatri, y luego cambiar a 1er cuatri, se eliminan las correlativas que no son validas
  useEffect(() => {
    const filtroInteligente = (lista: MateriaData[]) =>
      lista.filter(
        (m) => m.anio < anio || (m.anio === anio && m.cuatrimestre < cuatri),
      );

    setCorrelativasC((prev) => filtroInteligente(prev));
    setCorrelativasF((prev) => filtroInteligente(prev));
  }, [anio, cuatri]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[350px] bg-[#0f0f0f] border-l border-white/10 shadow-2xl z-[200] p-6 flex flex-col animate-in slide-in-from-right duration-300 backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Nueva Materia
        </h2>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-hide">
        {/* Nombre Input */}
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            Información Básica
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la materia..."
            className={`w-full bg-white/5 border ${
              errorNombre ? "border-red-500/50" : "border-white/10"
            } rounded-xl p-3 mt-3 outline-none focus:border-blue-500/50 text-white placeholder:text-white/10 transition-all`}
          />
          {/* Mensaje de error */}
          {errorNombre && (
            <p className="text-red-400 text-[11px] mt-2 ml-1 animate-pulse">
              {errorNombre}
            </p>
          )}
        </div>

        {/* Para seleccionar el año y cuatrimestre de la materia*/}
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            Año de la Materia
          </label>
          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((n) => (
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

        {/* Para elegir las correlativas */}
        <div className="pt-4 border-t border-white/5">
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            Correlatividades
          </label>

          {/* Tabs para tipo de correlativa */}
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

          {/* Chips de correlativas seleccionadas */}
          <div className="space-y-3 mb-4">
            {correlativasC.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {correlativasC.map((m) => (
                  <span
                    key={m.id}
                    className="bg-blue-500/10 border border-blue-500/20 text-blue-400/80 px-2 py-1 rounded text-[10px] flex items-center gap-1 animate-in fade-in zoom-in-75"
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
                    className="bg-green-500/10 border border-green-500/20 text-green-400/80 px-2 py-1 rounded text-[10px] flex items-center gap-1 animate-in fade-in zoom-in-75"
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

          {/* Para buscar las materias que pueden llegar a ser correlativas */}
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
              <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-white/20 rounded-xl mt-2 shadow-2xl z-[210] overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                <div className="max-h-[180px] overflow-y-auto scrollbar-hide pr-1">
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

      {/* Boton Guardar */}
      <button
        onClick={handleCrear}
        disabled={!nombre}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white font-black py-4 rounded-2xl mt-6 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
      >
        CREAR MATERIA
      </button>
    </div>
  );
}
