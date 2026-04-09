import React from 'react';
import { X, Volume2, VolumeX, Crosshair, EyeOff, Eye, Timer, Briefcase, BrainCircuit, Sliders } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, onUpdateSettings, onCalibrate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in-scale max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                        <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                            <Sliders size={16} className="text-blue-600" />
                        </div>
                        Configuración
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                    {/* Audio Settings */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Alertas y Privacidad</label>

                        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors shadow-sm">
                            <div className="flex items-center gap-3">
                                {settings.audioEnabled ? <Volume2 className="text-emerald-500 w-5 h-5" /> : <VolumeX className="text-slate-400 w-5 h-5" />}
                                <div>
                                    <p className="text-slate-800 font-medium text-sm">Sonido de Alerta</p>
                                    <p className="text-xs text-slate-500">Notificar con audio al detectar mala postura</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateSettings({ ...settings, audioEnabled: !settings.audioEnabled })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.audioEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow flex items-center justify-center ${settings.audioEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors shadow-sm">
                            <div className="flex items-center gap-3">
                                {settings.privacyMode ? <EyeOff className="text-purple-500 w-5 h-5" /> : <Eye className="text-slate-400 w-5 h-5" />}
                                <div>
                                    <p className="text-slate-800 font-medium text-sm">Modo Privacidad</p>
                                    <p className="text-xs text-slate-500">Desenfoca la cámara para proteger tu entorno</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateSettings({ ...settings, privacyMode: !settings.privacyMode })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.privacyMode ? 'bg-purple-500' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow flex items-center justify-center ${settings.privacyMode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors shadow-sm">
                            <div className="flex items-center gap-3">
                                <Timer className={`w-5 h-5 ${settings.breakInterval > 0 ? "text-blue-500" : "text-slate-400"}`} />
                                <div>
                                    <p className="text-slate-800 font-medium text-sm">Pausas Activas</p>
                                    <p className="text-xs text-slate-500">Recordatorio de descanso</p>
                                </div>
                            </div>
                            <select
                                value={settings.breakInterval}
                                onChange={(e) => onUpdateSettings({ ...settings, breakInterval: parseInt(e.target.value) })}
                                className="bg-white text-slate-800 text-sm rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none shadow-sm"
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
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-sm text-blue-800 mb-4 font-medium">
                                Siéntate derecho en tu postura ideal y presiona calibrar para establecer tu "punto cero".
                            </p>
                            <button
                                onClick={() => {
                                    onCalibrate();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold text-sm shadow-md shadow-blue-500/10 hover:-translate-y-0.5"
                            >
                                <Crosshair size={16} />
                                Calibrar Postura Actual
                            </button>
                        </div>
                    </div>

                    {/* Work Profile */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Perfil de Trabajo</label>
                        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-cyan-200 transition-colors shadow-sm">
                            <div className="flex items-center gap-3">
                                <Briefcase className="text-cyan-500 w-5 h-5" />
                                <div>
                                    <p className="text-slate-800 font-medium text-sm">Escenario ergonómico</p>
                                    <p className="text-xs text-slate-500">Personaliza recomendaciones</p>
                                </div>
                            </div>
                            <select
                                value={settings.workProfile || 'oficina'}
                                onChange={(e) => onUpdateSettings({ ...settings, workProfile: e.target.value })}
                                className="bg-white text-slate-800 text-sm rounded-lg border border-slate-300 focus:ring-cyan-500 focus:border-cyan-500 block p-1.5 outline-none shadow-sm"
                            >
                                <option value="oficina">Oficina</option>
                                <option value="desarrollo">Desarrollo</option>
                                <option value="diseno">Diseño Gráfico</option>
                                <option value="callcenter">Call Center</option>
                                <option value="taller">Taller / Ensamblaje</option>
                                <option value="laboratorio">Laboratorio</option>
                                <option value="almacen">Almacén / Empaque</option>
                                <option value="construccion">Construcción</option>
                                <option value="logistica">Logística y Transporte</option>
                            </select>
                        </div>
                    </div>

                    {/* Sensitivity */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sensibilidad</label>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={settings.deadzone || 5}
                                onChange={(e) => onUpdateSettings({ ...settings, deadzone: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-medium">
                                <span>Estricta</span>
                                <span className="text-slate-600 font-bold">{settings.deadzone || 5}</span>
                                <span>Permisiva</span>
                            </div>
                        </div>
                    </div>

                    {/* AI */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Inteligencia Artificial</label>
                        <div className="flex flex-col p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm gap-3">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="text-indigo-500 w-5 h-5" />
                                <div>
                                    <p className="text-slate-800 font-medium text-sm">Clave API de Gemini</p>
                                    <p className="text-xs text-slate-500">Habilita el coach inteligente con IA</p>
                                </div>
                            </div>
                            <input
                                type="password"
                                placeholder="AIzaSy..."
                                value={settings.geminiApiKey || ''}
                                onChange={(e) => onUpdateSettings({ ...settings, geminiApiKey: e.target.value })}
                                className="w-full bg-white text-slate-800 text-sm rounded-lg border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center flex-shrink-0">
                    <p className="text-[10px] text-slate-400 font-medium">SMEP v1.0 Pro · RedUJAP</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
