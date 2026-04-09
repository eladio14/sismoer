import React from 'react';
import { Shield, LogOut, BarChart2, Settings, Users, User } from 'lucide-react';

const Dashboard = ({ children, onOpenSettings, onOpenExit, onOpenStats, onOpenAdmin, onOpenProfile, user }) => {
  return (
    <div className="flex flex-col min-h-screen w-full font-sans selection:bg-emerald-500/30"
      style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #fafcff 40%, #f5f0ff 70%, #edfaf5 100%)' }}>

      {/* Decorative blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none -z-0"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none -z-0"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 flex-none min-h-[4rem] py-3 sm:py-0 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl flex flex-wrap items-center justify-between px-4 sm:px-6 gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 leading-tight font-outfit">
              SMEP <span className="text-emerald-500 font-normal opacity-70">RedUJAP</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">Monitor Ergonómico de Postura</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-between sm:justify-end">

          {user?.role === 'admin' && (
            <button onClick={onOpenAdmin}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-all duration-200 text-xs sm:text-sm text-emerald-700 font-semibold hover:-translate-y-0.5">
              <Users className="w-4 h-4" />
              <span className="hidden sm:block">Panel Admin</span>
            </button>
          )}

          {user && (
            <button onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-blue-500/20 bg-blue-50 hover:bg-blue-100 transition-colors text-xs sm:text-sm text-blue-600 font-medium"
            >
              {user.photoUrl ? (
                 <img src={user.photoUrl} alt="Perfil" className="w-5 h-5 rounded-full object-cover border border-blue-200" />
              ) : (
                 <User className="w-4 h-4" />
              )}
              <span className="hidden sm:block">Perfil</span>
            </button>
          )}

          <button onClick={onOpenStats}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 text-xs sm:text-sm text-slate-700 font-semibold hover:-translate-y-0.5 shadow-sm">
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:block">Estadísticas</span>
          </button>

          <button onClick={onOpenSettings}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 text-xs sm:text-sm text-slate-500 hover:-translate-y-0.5 shadow-sm">
            <Settings className="w-4 h-4" />
          </button>

          <button onClick={onOpenExit}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-all duration-200 text-xs sm:text-sm text-rose-600 font-semibold group hover:-translate-y-0.5">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:block">Salir</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600 tracking-[0.15em]">ACTIVO</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex-none min-h-[2rem] py-2 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm flex flex-wrap items-center justify-between px-4 sm:px-6 text-[9px] sm:text-[10px] text-slate-400 gap-2">
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
