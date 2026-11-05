import React, { useState } from 'react';
import { Moon, Sun, Bell, MessageSquare, LogOut, Calendar } from 'lucide-react';

// Importación directa y segura desde assets (Vite garantiza que no haya bucles)
import genstiLogo from '../assets/gensti-logo.jpg';
import uccLogo from '../assets/ucc-logo.png';

export default function Header({ 
  user, 
  onLogout, 
  onOpenPQRS, 
  pqrsCount = 0, 
  onOpenProfile, 
  onOpenCalendar, 
  onGoHome, 
  currentTab,
  darkMode,
  setDarkMode,
  events = []
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const safeEvents = Array.isArray(events) ? events : [];

  const notifications = safeEvents.slice(0, 5).map((evt, idx) => ({
    id: evt.id || idx,
    title: `Próximo Evento: ${evt.titulo || 'Sin título'}`,
    date: evt.fecha_evento || 'Por confirmar',
    lugar: evt.lugar || 'Campus UCC'
  }));

  return (
    <header className="bg-[#002755] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* SECCIÓN IZQUIERDA: CAJAS SEPARADAS + GENSTI + NAVEGACIÓN */}
          <div className="flex items-center gap-4">
            
            <button 
              onClick={onGoHome}
              className="flex items-center gap-3 text-white hover:opacity-95 transition-opacity cursor-pointer group"
            >
              {/* Caja 1: Logo GensTI */}
              <div className="bg-white p-1 px-1.5 rounded-xl shadow-md border border-white/20 flex items-center justify-center h-10 min-w-[40px]">
                <img 
                  src={genstiLogo} 
                  alt="GensTI" 
                  className="h-8 w-auto object-contain rounded-lg"
                />
              </div>

              {/* Caja 2: Logo UCC */}
              <div className="bg-white p-1.5 px-3 rounded-xl shadow-md border border-white/20 flex items-center justify-center h-10">
                <img 
                  src={uccLogo} 
                  alt="UCC" 
                  className="h-7 w-auto object-contain"
                />
              </div>

              {/* Nombre GensTI */}
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors ml-1">
                GENSTI
              </span>
            </button>

            {/* Navegación por pestañas */}
            <nav className="hidden md:flex items-center gap-1 ml-3">
              <button
                onClick={onGoHome}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentTab === 'home' ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={onOpenCalendar}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentTab === 'calendar' ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                Eventos y Calendario
              </button>
            </nav>
          </div>

          {/* SECCIÓN DERECHA: ICONOS DE ACCIÓN Y USUARIO */}
          <div className="flex items-center gap-3">
            
            <button
              onClick={onOpenPQRS}
              className="p-2 rounded-xl text-blue-100 hover:bg-white/10 transition-colors relative cursor-pointer"
              title="Solicitudes y PQRS"
            >
              <MessageSquare size={18} />
              {pqrsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-sky-500 text-[#002755] rounded-full text-[9px] font-extrabold flex items-center justify-center">
                  {pqrsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-blue-100 hover:bg-white/10 transition-colors cursor-pointer"
              title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-blue-100 hover:bg-white/10 transition-colors relative cursor-pointer"
                title="Notificaciones"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 z-50">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <h4 className="font-bold text-xs text-[#002755] dark:text-sky-400 flex items-center gap-1.5">
                      <Bell size={14} /> Notificaciones
                    </h4>
                    <span className="text-[10px] bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full font-bold">
                      {notifications.length} Nuevas
                    </span>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No hay notificaciones por ahora.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            setShowNotifications(false);
                            onOpenCalendar();
                          }}
                          className="p-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-sky-50 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer text-left border border-gray-100 dark:border-gray-700"
                        >
                          <p className="font-bold text-[11px] leading-tight text-gray-800 dark:text-gray-100 mb-1">{n.title}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar size={10} /> {n.date} — {n.lugar}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-white/20 my-auto mx-1"></div>

            <button
              onClick={onOpenProfile}
              className={`flex items-center gap-2 p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentTab === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                {(user?.name || user?.username || 'U')[0].toUpperCase()}
              </div>
              <span className="text-xs font-semibold hidden sm:inline max-w-[100px] truncate">
                {user?.name || user?.username}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}