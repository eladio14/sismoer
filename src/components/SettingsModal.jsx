import React from 'react';
import { X, Volume2, VolumeX, Crosshair, AlertTriangle, EyeOff, Eye, Timer } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, onUpdateSettings, onCalibrate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <AlertTriangle size={18} className="text-yellow-500" />
                        Configuración
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Audio Settings */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Alertas</label>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                {settings.audioEnabled ? <Volume2 className="text-emerald-400" /> : <VolumeX className="text-gray-500" />}
                                <div>
                                    <p className="text-white font-medium">Sonido de Alerta</p>
                                    <p className="text-xs text-gray-400">Notificar cuando la postura sea incorrecta</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateSettings({ ...settings, audioEnabled: !settings.audioEnabled })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.audioEnabled ? 'bg-emerald-500' : 'bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.audioEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                {settings.privacyMode ? <EyeOff className="text-purple-400" /> : <Eye className="text-gray-500" />}
                                <div>
                                    <p className="text-white font-medium">Modo Privacidad</p>
                                    <p className="text-xs text-gray-400">Desenfoca la cámara. Protege tu entorno.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateSettings({ ...settings, privacyMode: !settings.privacyMode })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.privacyMode ? 'bg-purple-500' : 'bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacyMode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <Timer className={settings.breakInterval > 0 ? "text-blue-400" : "text-gray-500"} />
                                <div>
                                    <p className="text-white font-medium">Pausas Activas</p>
                                    <p className="text-xs text-gray-400">Recordatorio de descanso (minutos)</p>
                                </div>
                            </div>
                            <select
                                value={settings.breakInterval}
                                onChange={(e) => onUpdateSettings({ ...settings, breakInterval: parseInt(e.target.value) })}
                                className="bg-gray-800 text-white text-sm rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none"
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
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Calibración</label>
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-200 mb-4">
                                Párate derecho en tu postura ideal y haz clic en calibrar para establecer tu "punto cero".
                            </p>
                            <button
                                onClick={() => {
                                    onCalibrate();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                            >
                                <Crosshair size={18} />
                                Calibrar Postura Actual
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sensibilidad</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={settings.deadzone || 5}
                            onChange={(e) => onUpdateSettings({ ...settings, deadzone: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Estricta</span>
                            <span>Permisiva</span>
                        </div>
                    </div>

                </div>

                <div className="p-4 bg-white/5 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500">Versión 1.0.0 Pro • RedUJAP</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
