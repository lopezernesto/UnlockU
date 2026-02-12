import { Lock } from "lucide-react";
export default function MensajeBienvenida() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-[#1a1a1a]/60 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl p-12 max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="text-6xl mb-6 animate-bounce">
          <Lock color="white" />
        </div>
        <h2 className="text-3xl font-black text-white/90 mb-3 tracking-tight">
          UnlockU
        </h2>
        <p className="text-white/50 text-sm leading-relaxed">
          Seleccioná una carrera del menú lateral para comenzar a trackear tu
          progreso académico
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-white/30 text-xs">
          <span>→</span>
          <span>Mirá el menú de la derecha</span>
        </div>
      </div>
    </div>
  );
}
