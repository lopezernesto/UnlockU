interface ConfirmarProps {
  titulo: string;
  mensaje: string;
  textoBoton: string;
  colorBoton: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ModalConfirmar({
  titulo,
  mensaje,
  textoBoton,
  colorBoton,
  onConfirm,
  onClose,
}: ConfirmarProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 glow">
      <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl min-w-[500px]">
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{titulo}</h3>
            <p className="text-white/60 text-sm">{mensaje}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-transform active:scale-95 ${colorBoton}`}
            >
              {textoBoton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
