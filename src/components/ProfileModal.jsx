import React, { useState, useEffect } from 'react';
import { X, User, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile(formData);
      onClose();
    } catch (e) {
      setError(e.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl text-slate-200 rounded-2xl shadow-[0_8px_64px_rgba(0,0,0,0.5)] border border-white/[0.08] overflow-hidden animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5 font-outfit">
            <div className="p-1.5 bg-blue-500/15 rounded-lg border border-blue-500/20">
              <User size={16} className="text-blue-400" />
            </div>
            Perfil de Usuario
          </h2>
          <button
            className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Avatar */}
          {user && (
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20 mb-2">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none px-3.5 py-2.5 text-sm text-white transition-colors placeholder:text-slate-600"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none px-3.5 py-2.5 text-sm text-white transition-colors placeholder:text-slate-600"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium transition-all text-slate-300"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold transition-all text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
