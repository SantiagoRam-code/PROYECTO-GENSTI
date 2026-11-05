import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CalendarWidget from "./components/CalendarWidget";
import ChatbotWidget from "./components/ChatbotWidget";
import PQRSModal from "./components/PQRSModal";
import LoginModal from "./components/LoginModal";
import CalendarView from './components/CalendarView';
import Dashboard from './components/Dashboard';
import { NoticiasList } from './components/NoticiasList'; 
import { getEventos } from './services/eventosService';
import { getPerfiles } from './services/perfilesService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gensti_session_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("gensti_dark_mode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isPQRSOpen, setIsPQRSOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('home'); 

  const [pqrsList, setPqrsList] = useState(() => {
    try {
      const saved = localStorage.getItem("gensti_pqrs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [eventosBackend, setEventosBackend] = useState([]);
  const [estudiantesCount, setEstudiantesCount] = useState(1);

  useEffect(() => {
    getEventos()
      .then(data => setEventosBackend(Array.isArray(data) ? data : []))
      .catch(() => setEventosBackend([]));

    getPerfiles()
      .then(perfiles => {
        if (Array.isArray(perfiles) && perfiles.length > 0) {
          setEstudiantesCount(perfiles.length);
        } else {
          setEstudiantesCount(1);
        }
      })
      .catch(() => setEstudiantesCount(1));
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem("gensti_dark_mode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("gensti_pqrs", JSON.stringify(pqrsList));
  }, [pqrsList]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("gensti_session_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gensti_session_user");
    localStorage.removeItem("gensti_token");
    setCurrentTab('home');
  };

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
    <div className={`min-h-screen flex flex-col transition-colors ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-[#F4F6F9] text-gray-800'}`}>
      
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
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            events={eventosBackend}
          />

          {currentTab === 'home' && (
            <section className="bg-gradient-to-r from-[#002755] to-[#004b99] py-10 text-white border-t border-white/10 shadow-inner">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] tracking-widest text-blue-300 font-bold mb-1 uppercase">
                    Comunidad Académica {currentUser.role === 'admin' && '— PANEL ADMINISTRATIVO'}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Programa de Ingeniería de Sistemas</h2>
                  <p className="text-xs text-blue-200 mt-0.5">Semestre 2026-2 · Universidad Cooperativa de Colombia</p>
                </div>

                <div className="flex gap-3">
                  {[ 
                    { num: estudiantesCount, text: "Estudiantes" }, 
                    { num: (eventosBackend || []).length, text: "Eventos próx." } 
                  ].map(stat => (
                    <div key={stat.text} className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 text-center border border-white/5 shadow-lg">
                      <span className="text-2xl font-bold block">{stat.num}</span>
                      <span className="text-[10px] text-blue-200 mt-1 block">{stat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            
            {currentTab === 'profile' && (
              <div>
                <button 
                  onClick={() => setCurrentTab('home')}
                  className="mb-4 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Volver al Inicio
                </button>
                <Dashboard user={currentUser} />
              </div>
            )}

            {currentTab === 'calendar' && (
              <div>
                <button 
                  onClick={() => setCurrentTab('home')} 
                  className="mb-4 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Volver al Inicio
                </button>
                <CalendarView currentUser={currentUser} />
              </div>
            )}

            {currentTab === 'home' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                <NoticiasList 
                  currentUser={currentUser} 
                  onNavigateToCalendar={() => setCurrentTab('calendar')}
                />

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 transition-colors">
                  <CalendarWidget events={eventosBackend} />
                </div>

                <ChatbotWidget />
                
              </div>
            )}
          </main>

          <Footer />

          <PQRSModal
            isOpen={isPQRSOpen}
            onClose={() => setIsPQRSOpen(false)}
            userRole={currentUser.role}
            currentUser={currentUser.name || currentUser.username || "Usuario"}
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