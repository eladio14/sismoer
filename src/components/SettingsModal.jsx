import React from 'react';
import { X, Volume2, VolumeX, Crosshair, EyeOff, Eye, Timer, Briefcase, BrainCircuit, Sliders } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, onUpdateSettings, onCalibrate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_8px_64px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-scale max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/[0.06] flex-shrink-0">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                        <div className="p-1.5 bg-blue-500/15 rounded-lg border border-blue-500/20">
                            <Sliders size={16} className="text-blue-400" />
                        </div>
                        Configuración
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                    {/* Audio Settings */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Alertas y Privacidad</label>

                        <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                            <div className="flex items-center gap-3">
                                {settings.audioEnabled ? <Volume2 className="text-emerald-400 w-5 h-5" /> : <VolumeX className="text-slate-600 w-5 h-5" />}
                                <div>
                                    <p className="text-white font-medium text-sm">Sonido de Alerta</p>
                                    <p className="text-xs text-slate-500">Notificar con audio al detectar mala postura</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateSettings({ ...settings, audioEnabled: !settings.audioEnabled })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.audioEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${settings.audioEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                            <div className="flex items-center gap-3">
                                {settings.privacyMode ? <EyeOff className="text-purple-400 w-5 h-5" /> : <Eye className="text-slate-600 w-5 h-5" />}
                                <div>
                                    <p className="text-white font-medium text-sm">Modo Privacidad</p>
                                    <p className="text-xs text-slate-500">Desenfoca la cámara para proteger tu entorno</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateSettings({ ...settings, privacyMode: !settings.privacyMode })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.privacyMode ? 'bg-purple-500' : 'bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${settings.privacyMode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                            <div className="flex items-center gap-3">
                                <Timer className={`w-5 h-5 ${settings.breakInterval > 0 ? "text-blue-400" : "text-slate-600"}`} />
                                <div>
                                    <p className="text-white font-medium text-sm">Pausas Activas</p>
                                    <p className="text-xs text-slate-500">Recordatorio de descanso</p>
                                </div>
                            </div>
                            <select
                                value={settings.breakInterval}
                                onChange={(e) => onUpdateSettings({ ...settings, breakInterval: parseInt(e.target.value) })}
                                className="bg-slate-800/80 text-white text-sm rounded-lg border border-slate-700 focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none"
                            >
                                <option value={0}>Apagado</option>
                                <option value={15}>15 min</option>
                                <option value={30}>30 min</option>
                                <option value={45}>45 min</option>
                                <option value={60}>60 min</option>
                            </select>
                        </div>
                    </div>

                    {/* Calibration */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Calibración</label>
                        <div className="p-4 bg-blue-500/[0.08] border border-blue-500/20 rounded-xl">
                            <p className="text-sm text-blue-200/80 mb-4">
                                Siéntate derecho en tu postura ideal y presiona calibrar para establecer tu "punto cero".
                            </p>
                            <button
                                onClick={() => {
                                    onCalibrate();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-semibold text-sm shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
                            >
                                <Crosshair size={16} />
                                Calibrar Postura Actual
                            </button>
                        </div>
                    </div>

                    {/* Work Profile */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Perfil de Trabajo</label>
                        <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                            <div className="flex items-center gap-3">
                                <Briefcase className="text-cyan-400 w-5 h-5" />
                                <div>
                                    <p className="text-white font-medium text-sm">Escenario ergonómico</p>
                                    <p className="text-xs text-slate-500">Personaliza recomendaciones</p>
                                </div>
                            </div>
                            <select
                                value={settings.workProfile || 'oficina'}
                                onChange={(e) => onUpdateSettings({ ...settings, workProfile: e.target.value })}
                                className="bg-slate-800/80 text-white text-sm rounded-lg border border-slate-700 focus:ring-cyan-500 focus:border-cyan-500 block p-1.5 outline-none"
                            >
                                <option value="oficina">Oficina</option>
                                <option value="desarrollo">Desarrollo</option>
                                <option value="diseno">Diseño</option>
                                <option value="callcenter">Call Center</option>
                            </select>
                        </div>
                    </div>

                    {/* Sensitivity */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sensibilidad</label>
                        <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={settings.deadzone || 5}
                                onChange={(e) => onUpdateSettings({ ...settings, deadzone: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-medium">
                                <span>Estricta</span>
                                <span className="text-slate-400 font-bold">{settings.deadzone || 5}</span>
                                <span>Permisiva</span>
                            </div>
                        </div>
                    </div>

                    {/* AI */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Inteligencia Artificial</label>
                        <div className="flex flex-col p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06] gap-3">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="text-indigo-400 w-5 h-5" />
                                <div>
                                    <p className="text-white font-medium text-sm">Clave API de Gemini</p>
                                    <p className="text-xs text-slate-500">Habilita el coach inteligente con IA</p>
                                </div>
                            </div>
                            <input
                                type="password"
                                placeholder="AIzaSy..."
                                value={settings.geminiApiKey || ''}
                                onChange={(e) => onUpdateSettings({ ...settings, geminiApiKey: e.target.value })}
                                className="w-full bg-slate-800/80 text-white text-sm rounded-lg border border-slate-700 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-white/[0.02] border-t border-white/[0.06] text-center flex-shrink-0">
                    <p className="text-[10px] text-slate-600">SMEP v1.0 Pro · RedUJAP</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
