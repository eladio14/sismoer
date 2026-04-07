import React from 'react';
import { Shield, LogOut, BarChart2, Settings, Users, User } from 'lucide-react';

const Dashboard = ({ children, onOpenSettings, onOpenExit, onOpenStats, onOpenAdmin, onOpenProfile, user }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex-none min-h-[4rem] py-3 sm:py-0 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl flex flex-wrap items-center justify-between px-4 sm:px-6 z-10 gap-3 shadow-[0_1px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/10">
            <Shield className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              SMEP <span className="text-blue-400 font-normal opacity-60">RedUJAP</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">Monitor Ergonómico de Postura</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">

          {user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300 text-xs sm:text-sm text-emerald-400 font-medium hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:block">Panel Admin</span>
            </button>
          )}

          {user && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-300 text-xs sm:text-sm text-blue-400 font-medium hover:-translate-y-0.5"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Perfil</span>
            </button>
          )}

          <button
            onClick={onOpenStats}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-700/50 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 text-xs sm:text-sm text-slate-300 font-medium hover:-translate-y-0.5"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:block">Estadísticas</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-700/50 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 text-xs sm:text-sm text-slate-400 font-medium hover:-translate-y-0.5"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenExit}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-300 text-xs sm:text-sm text-rose-400 font-medium group hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:block">Salir</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.15em]">ACTIVO</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-4 lg:p-6 custom-scrollbar">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/[0.07] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/[0.05] rounded-full blur-[120px]"></div>
          <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-emerald-600/[0.03] rounded-full blur-[100px]"></div>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="flex-none min-h-[2rem] py-2 border-t border-white/[0.04] bg-slate-950/60 flex flex-wrap items-center justify-between px-4 sm:px-6 text-[9px] sm:text-[10px] text-slate-600 gap-2">
        <p className="w-full sm:w-auto text-center sm:text-left">© 2026 Universidad José Antonio Páez · Ingeniería de Software</p>
        <div className="flex gap-4 font-mono opacity-60 w-full sm:w-auto justify-center sm:justify-end">
          <span>SMEP v1.0</span>
          <span>MediaPipe · BlazePose</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
