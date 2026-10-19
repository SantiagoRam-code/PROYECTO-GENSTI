import React from 'react';
import { Search, MessageSquare, Moon, Bell, User, LogOut, Shield } from 'lucide-react';

export default function Header({ 
  user, 
  onLogout, 
  onOpenPQRS, 
  pqrsCount, 
  onOpenProfile, 
  onOpenCalendar,
  onGoHome, 
  currentTab = 'home' 
}) {
  return (
    <header className="bg-[#002755] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Identidad / Logo */}
        <div 
          onClick={onGoHome} 
          className="flex items-center gap-3 cursor-pointer select-none" 
          title="Ir al inicio"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-[#002755] font-extrabold text-xs">UCC</div>
            <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center text-white font-mono text-[10px] border border-white/20">&lt;/&gt;</div>
          </div>
          <div className="hidden sm:block leading-tight">
            <h1 className="font-bold text-sm tracking-wide">GENSTI</h1>
            <p className="text-[10px] text-blue-200">Universidad Cooperativa de Colombia</p>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="hidden md:flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={onGoHome}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'home' 
                ? 'bg-white/20 text-white shadow-sm' 
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Noticias
          </button>
          
          <button 
            onClick={onOpenCalendar}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'calendar' 
                ? 'bg-white/20 text-white shadow-sm' 
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Eventos y Calendario
          </button>

          {user && (
            <button 
              onClick={onOpenProfile}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'profile' 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Mi Perfil
            </button>
          )}
        </nav>

        {/* Perfil & Acciones */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-blue-200">
            <button className="hover:text-white transition-colors cursor-pointer"><Search size={16} /></button>
            
            {/* Cajita de PQRS */}
            <button onClick={onOpenPQRS} className="hover:text-white relative p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <MessageSquare size={16} />
              {pqrsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#002755]">
                  {pqrsCount}
                </span>
              )}
            </button>

            <button className="hover:text-white transition-colors cursor-pointer"><Moon size={16} /></button>
            <button className="hover:text-white relative transition-colors cursor-pointer">
              <Bell size={16} />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#002755]">3</span>
            </button>
          </div>

          {/* Badge de Usuario Real */}
          {user && (
            <button 
              onClick={onOpenProfile}
              title="Ver mi perfil"
              className="flex items-center gap-2 bg-white/10 border border-white/15 pl-2 pr-3 py-1 rounded-full hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                user.role === 'admin' ? 'bg-amber-500' : 'bg-sky-500'
              }`}>
                {user.role === 'admin' ? <Shield size={12}/> : <User size={12}/>}
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-bold block max-w-[120px] truncate">{user.name}</span>
                <span className="text-[9px] text-blue-200 uppercase font-semibold">
                  {user.role === 'admin' ? 'Profesor' : 'Estudiante'}
                </span>
              </div>
            </button>
          )}

          <button onClick={onLogout} title="Cerrar Sesión" className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}