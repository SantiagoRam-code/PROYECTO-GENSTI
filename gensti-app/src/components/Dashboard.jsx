import React, { useState } from 'react'
import AddTask from './AddTask'
import CalendarView from './CalendarView'
import Profile from './Profile'

export default function Dashboard({ user }) {
  // Determinamos si es docente/admin o estudiante
  const isFaculty = user?.role === 'professor' || user?.role === 'admin' || user?.email?.endsWith('@ucc.edu.co');

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Encabezado Personalizado */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#002755]">
          Bienvenido, {user?.name || 'Usuario'} 
        </h2>
        <p className="text-xs text-gray-500">
          {isFaculty 
            ? 'Panel de Gestión Académica y Docente — Comunidad GENSTI' 
            : 'Panel de Control del Estudiante — Comunidad GENSTI'}
        </p>
      </div>

      {/* Métricas Diferenciadas por Rol */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {isFaculty ? (
          /* VISTA PARA DOCENTES / ADMINISTRADORES */
          <>
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
              <span className="text-xs font-semibold text-sky-700">Cursos / Asignaturas</span>
              <p className="text-2xl font-bold text-[#002755] mt-1">4 Cursos</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-xs font-semibold text-amber-700">PQRS Pendientes</span>
              <p className="text-2xl font-bold text-[#002755] mt-1">2 Solicitudes</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-700">Rol Institucional</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">Docente / Admin</p>
            </div>
          </>
        ) : (
          /* VISTA PARA ESTUDIANTES */
          <>
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
              <span className="text-xs font-semibold text-sky-700">Proyectos Activos</span>
              <p className="text-2xl font-bold text-[#002755] mt-1">1 Proyecto</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <span className="text-xs font-semibold text-purple-700">Tareas Pendientes</span>
              <p className="text-2xl font-bold text-[#002755] mt-1">3 Entregas</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-700">Estado de Cuenta</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">Estudiante Activo</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}