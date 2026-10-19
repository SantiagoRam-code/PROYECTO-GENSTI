import React, { useState, useEffect } from "react";
import { Zap, ExternalLink, Lock } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CalendarWidget from "./components/CalendarWidget";
import ChatbotWidget from "./components/ChatbotWidget";
import PQRSModal from "./components/PQRSModal";
import LoginModal from "./components/LoginModal";
import CalendarView from './components/CalendarView';
import AddTask from './components/AddTask';
import Dashboard from './components/Dashboard';
import { EVENTS_INICIALES as EVENTS } from "./data/events";
import { NoticiasList } from './components/NoticiasList'; 
import { getEventos } from './services/eventosService';


export default function App() {
  // Estado de Sesión Persistente
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("gensti_session_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isPQRSOpen, setIsPQRSOpen] = useState(false);
  
  // Estado para controlar la pestaña activa ('home', 'profile', 'calendar')
  const [currentTab, setCurrentTab] = useState('home'); 

  // Estado global de PQRS
  const [pqrsList, setPqrsList] = useState(() => {
    const saved = localStorage.getItem("gensti_pqrs");
    return saved ? JSON.parse(saved) : [];
  });

  const [eventosBackend, setEventosBackend] = useState([]);

  useEffect(() => {
    getEventos().then(setEventosBackend).catch(console.error);
  }, []);

  // Guardar PQRS en localStorage
  useEffect(() => {
    localStorage.setItem("gensti_pqrs", JSON.stringify(pqrsList));
  }, [pqrsList]);

  // Manejadores de sesión
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("gensti_session_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gensti_session_user");
    setCurrentTab('home'); // Volver al inicio al cerrar sesión
  };

  // Manejadores de PQRS
  const handleAddPQRS = (newPQRS) => {
    setPqrsList([newPQRS, ...pqrsList]);
  };

  const handleRespondPQRS = (id, responseText) => {
    setPqrsList(pqrsList.map(item => 
      item.id === id ? { ...item, status: "resuelto", response: responseText } : item
    ));
  };

  const handleDeletePQRS = (id) => {
  if (window.confirm("¿Seguro que deseas eliminar esta solicitud de PQRS?")) {
    setPqrsList(prev => prev.filter(item => item.id !== id));
   }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800 bg-[#F4F6F9]">
      
      {/* Modal de Login (si no hay sesión) */}
      <LoginModal 
        isOpen={!currentUser} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {currentUser && (
        <>
          <Header 
            user={currentUser} 
            onLogout={handleLogout} 
            onOpenPQRS={() => setIsPQRSOpen(true)} 
            pqrsCount={pqrsList.length}
            onOpenProfile={() => setCurrentTab('profile')}
            onOpenCalendar={() => setCurrentTab('calendar')}
            onGoHome={() => setCurrentTab('home')}
            currentTab={currentTab}
          />

          {/* Hero Banner */}
          {currentTab === 'home' && (
            <section className="bg-gradient-to-r from-[#002755] to-[#004b99] py-10 text-white border-t border-white/10 shadow-inner">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] tracking-widest text-blue-300 font-bold mb-2 uppercase">
                    Comunidad Académica {currentUser.role === 'admin' && '— PANEL ADMINISTRATIVO DE PROFESOR'}
                  </p>
                  <h2 className="text-3xl font-bold mb-2">Programa de Ingeniería de Sistemas</h2>
                  <p className="text-xs text-blue-200">Septiembre 2026 · Semestre 2026-2</p>
                </div>
                <div className="flex gap-3">
                  {[ { num: 847, text: "Estudiantes" }, { num: 12, text: "Semilleros" }, { num: 4, text: "Eventos próx." } ].map(stat => (
                    <div key={stat.text} className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 text-center border border-white/5 shadow-lg">
                      <span className="text-2xl font-bold block">{stat.num}</span>
                      <span className="text-[10px] text-blue-200 mt-1 block">{stat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Grid Principal Adaptativo */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            
            {/* VISTA 1: MI PERFIL / DASHBOARD */}
            {currentTab === 'profile' && (
              <div>
                <button 
                  onClick={() => setCurrentTab('home')}
                  className="mb-4 text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Volver al Inicio
                </button>
                <Dashboard user={currentUser} />
              </div>
            )}

            {/* VISTA 2: EVENTOS Y CALENDARIO */}
            {currentTab === 'calendar' && (
             <div>
             <button onClick={() => setCurrentTab('home')} className="mb-4 text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer">
              ← Volver al Inicio
             </button>
             <CalendarView currentUser={currentUser} />
             </div>
)}

            {/* VISTA 3: PÁGINA DE INICIO (HOME) */}
            {currentTab === 'home' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Columna 1: Noticias desde la API de Django */}
                <NoticiasList currentUser={currentUser} />

                {/* Columna 2: Calendario / Eventos */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <CalendarWidget events={eventosBackend} />
                </div>

                {/* Columna 3: Asistente IA */}
                <ChatbotWidget />
                
              </div>
            )}
          </main>

          <Footer />

          {/* Modal de PQRS */}
          <PQRSModal
            isOpen={isPQRSOpen}
            onClose={() => setIsPQRSOpen(false)}
            userRole={currentUser.role}
            currentUser={currentUser.name}
            pqrsList={pqrsList}
            onAddPQRS={handleAddPQRS}
            onRespondPQRS={handleRespondPQRS}
            onDeletePQRS={handleDeletePQRS}
          />
        </>
      )}

    </div>
  );
}