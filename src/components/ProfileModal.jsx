import React, { useState, useEffect, useRef } from 'react';
import { X, User, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', photoUrl: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({ name: user.name || '', email: user.email || '', photoUrl: user.photoUrl || '' });
    }
  }, [isOpen, user]);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
              setError('La imagen es demasiado grande. Máximo 2MB.');
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => ({ ...prev, photoUrl: reader.result }));
          };
          reader.readAsDataURL(file);
      }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-white backdrop-blur-xl text-slate-800 rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5 font-outfit">
            <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <User size={16} className="text-blue-600" />
            </div>
            Perfil de Usuario
          </h2>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
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
              <div 
                  onClick={handlePhotoClick}
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-md shadow-blue-500/20 mb-2 cursor-pointer group hover:opacity-90 transition-opacity overflow-hidden"
              >
                  {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                      user.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white w-6 h-6" />
                  </div>
              </div>
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
              />
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
                className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none px-3.5 py-2.5 text-sm text-slate-800 transition-colors placeholder:text-slate-400"
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
                className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none px-3.5 py-2.5 text-sm text-slate-800 transition-colors placeholder:text-slate-400"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium transition-all text-slate-600"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold transition-all text-white shadow-md shadow-emerald-500/10 hover:-translate-y-0.5"
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
