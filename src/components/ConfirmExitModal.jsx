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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-white backdrop-blur-xl text-slate-700 rounded-2xl shadow-xl border border-slate-200 p-6 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <AlertTriangle size={32} className="text-rose-500" />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2 text-center text-slate-800 font-outfit">Confirmar Salida</h2>
        <p className="text-center mb-6 text-slate-500 text-sm leading-relaxed">
          ¿Estás seguro de que deseas salir? Se guardarán los datos de tu sesión actual.
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-sm font-medium transition-all text-slate-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-sm font-semibold transition-all text-white shadow-md hover:-translate-y-0.5"
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
