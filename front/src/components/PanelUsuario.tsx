import { LogOut, User } from "lucide-react";
import { useState } from "react";

interface PanelUsuarioProps {
  user: any;
  onLogout: () => void;
}

export default function PanelUsuario({ user, onLogout }: PanelUsuarioProps) {
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [fotoError, setFotoError] = useState(false);
  const inicial = user?.nombre?.charAt(0).toUpperCase() || "U";
  const foto = user?.foto;

  return (
    <div className="fixed top-6 right-6 z-[100]">
      <button
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:border-white/40 overflow-hidden"
      >
        {foto && !fotoError ? (
          <img
            src={foto}
            alt={user?.nombre}
            className="w-full h-full object-cover"
            onError={() => setFotoError(true)}
          />
        ) : (
          <span className="text-white/80">{inicial}</span>
        )}
      </button>

      {mostrarDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMostrarDropdown(false)}
          />

          <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a]/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-white/10">
              <p className="text-white font-semibold text-sm truncate">
                {user?.nombre}
              </p>
              <p className="text-white/50 text-xs truncate mt-1">
                {user?.email || "Usuario invitado"}
              </p>
            </div>

            <div className="py-2">
              {user && (
                <button
                  className="w-full px-4 py-2 text-left text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3 text-sm"
                  onClick={() => {
                    setMostrarDropdown(false);
                  }}
                >
                  <User size={16} />
                  Perfil
                </button>
              )}

              <button
                className="w-full px-4 py-2 text-left text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors flex items-center gap-3 text-sm"
                onClick={() => {
                  setMostrarDropdown(false);
                  //Falta ponerle el cartel de que si es guest pierde todo jaja salu2
                  onLogout();
                }}
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
