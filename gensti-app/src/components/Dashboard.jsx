import React from 'react';
import { User, Mail, Shield, GraduationCap } from 'lucide-react';

export default function Dashboard({ user }) {
  if (!user) return null;

  const isProfessor = user.role === 'professor' || user.role === 'profesor' || user.role === 'admin';

  return (
    <div className="space-y-6">
      {/* TARJETA PRINCIPAL DE PERFIL */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
          
          {/* Avatar del usuario */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002755] to-sky-600 text-white font-bold text-2xl flex items-center justify-center shadow-md border-2 border-white dark:border-gray-700">
            {(user.name || user.username || 'U')[0].toUpperCase()}
          </div>

          {/* Información personal */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {user.name || user.username}
              </h2>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isProfessor 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                  : 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300'
              }`}>
                {isProfessor ? 'Docente / Coordinación' : 'Estudiante'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-sky-500" />
                {user.email || `${user.username}@campusucc.edu.co`}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-sky-500" />
                ID: GENSTI-{user.id || '2026'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN INSTITUCIONAL COMPACTA */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm transition-colors">
        <h3 className="text-sm font-bold text-[#002755] dark:text-sky-400 mb-4 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap size={18} />
          Información Institucional — UCC
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <span className="text-gray-400 block mb-1">Programa Académico</span>
            <span className="font-bold text-gray-800 dark:text-white">Ingeniería de Sistemas</span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <span className="text-gray-400 block mb-1">Sede / Campus</span>
            <span className="font-bold text-gray-800 dark:text-white">Universidad Cooperativa de Colombia</span>
          </div>
        </div>
      </div>
    </div>
  );
}