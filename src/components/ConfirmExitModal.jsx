import React, { useEffect } from 'react';
import { X, AlertTriangle, LogOut } from 'lucide-react';

const ConfirmExitModal = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-slate-900/95 backdrop-blur-xl text-slate-200 rounded-2xl shadow-[0_8px_64px_rgba(0,0,0,0.5)] border border-white/[0.08] p-6 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <AlertTriangle size={32} className="text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]" />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2 text-center text-white font-outfit">Confirmar Salida</h2>
        <p className="text-center mb-6 text-slate-400 text-sm leading-relaxed">
          ¿Estás seguro de que deseas salir? Se guardarán los datos de tu sesión actual.
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium transition-all text-slate-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-sm font-semibold transition-all text-white shadow-lg shadow-rose-500/20 hover:-translate-y-0.5"
            onClick={onConfirm}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmExitModal;
