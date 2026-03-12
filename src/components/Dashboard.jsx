import React from 'react';
import { Shield, Activity, LogOut, BarChart2, Settings } from 'lucide-react';

const Dashboard = ({ children, onOpenSettings, onExit, onOpenStats }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e14] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex-none min-h-[4rem] py-3 sm:py-0 border-b border-white/5 bg-white/5 backdrop-blur-md flex flex-wrap items-center justify-between px-4 sm:px-6 z-10 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
            <Shield className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              SMEP <span className="text-blue-400 font-normal opacity-75">RedUJAP</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-medium">Monitor Ergonómico de Postura</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">

          <button
            onClick={onOpenStats}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-xs sm:text-sm text-blue-400 font-medium"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:block">Mis Estadísticas</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs sm:text-sm text-gray-300 font-medium"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onExit}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs sm:text-sm text-red-400 font-medium group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:block">Salir</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-400 tracking-wide">SISTEMA ACTIVO</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-4 lg:p-6 custom-scrollbar">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="flex-none min-h-[2rem] py-2 border-t border-white/5 bg-[#0a0e14] flex flex-wrap items-center justify-between px-4 sm:px-6 text-[9px] sm:text-[10px] text-gray-500 gap-2">
        <p className="w-full sm:w-auto text-center sm:text-left">© 2026 Universidad José Antonio Páez | Ingeniería de Software</p>
        <div className="flex gap-4 font-mono opacity-50 w-full sm:w-auto justify-center sm:justify-end">
          <span>LATENCY: 12ms</span>
          <span>GPU: ACTIVE</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
