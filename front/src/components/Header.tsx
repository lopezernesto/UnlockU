import { FileDown, BookOpenText } from "lucide-react";
import { useCarreraContext } from "../context/CarreraContext";

export default function Header() {
  const { carreraActual, exportarProgreso } = useCarreraContext();
  const nombreCarrera = carreraActual?.nombre;

  return (
    <>
      <div className="fixed top-6 left-6 z-[100] bg-[#1a1a1a]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md p-4 min-w-[400px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              <BookOpenText color="white" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {nombreCarrera}
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportarProgreso}
              className="px-4 py-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-white/5 transition-all flex items-center gap-2 text-sm font-medium"
              title="Exportar progreso"
            >
              <FileDown size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
