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
      <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs w-full text-center">
        <h3 className="text-xl font-bold text-white mb-2">{titulo}</h3>
        <p className="text-white/60 text-sm mb-6">{mensaje}</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className={`w-full py-3 rounded-xl font-bold text-white transition-transform active:scale-95 ${colorBoton}`}
          >
            {textoBoton}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-white/40 hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
