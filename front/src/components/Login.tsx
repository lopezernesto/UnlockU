import { Lock, LogIn, UserRound } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
  onGuestAccess: () => void;
}

export default function Login({ onLogin, onGuestAccess }: LoginProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl p-12 max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="text-6xl mb-6 flex justify-center">
          <Lock className="text-white animate-pulse" size={64} />
        </div>

        <h1 className="text-4xl font-bl text-white/90 mb-2 tracking-tight">
          UnlockU
        </h1>

        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Iniciá sesión con tu cuenta institucional para acceder a tu progreso
          académico
        </p>

        <button
          onClick={onLogin}
          className="w-full border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
        >
          <LogIn size={18} />
          Acceso Institucional
        </button>

        <button
          onClick={onGuestAccess}
          className="w-full mt-4 bg-transparent hover:text-white text-white/40 font-normal py-2 px-6 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <UserRound size={16} />
          Continuar como invitado
        </button>
        <p className="text-white/30 text-xs mt-6">
          El progreso de invitados se guarda solo en este navegador.
        </p>
      </div>
    </div>
  );
}
