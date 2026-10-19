import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export default function CalendarWidget({ events = [] }) {
  // Configurar la fecha de hoy real
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaActual = today.toLocaleDateString('es-CO', options);

  // Filtrar eventos futuros o de hoy y ordenarlos por fecha
  const upcomingEvents = events
    .filter(ev => new Date(`${ev.fecha_evento}T00:00:00`) >= today.setHours(0,0,0,0))
    .sort((a, b) => new Date(a.fecha_evento) - new Date(b.fecha_evento))
    .slice(0, 4); // Mostrar máximo los próximos 4

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-[#002755]">
          <CalendarIcon size={14} />
        </div>
        <h3 className="font-bold text-sm text-[#002755]">Calendario Académico</h3>
      </div>

      {/* Tarjeta del día de HOY */}
      <div className="bg-gradient-to-r from-[#002755] to-[#004b99] text-white p-4 rounded-2xl mb-5 shadow-md">
        <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold mb-1">Día Actual</p>
        <p className="text-sm font-medium capitalize">{fechaActual}</p>
      </div>

      {/* Lista de Eventos */}
      <div className="flex-1 space-y-3">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Próximos Eventos</h4>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6">
            <CalendarIcon size={24} className="mx-auto text-gray-200 mb-2" />
            <p className="text-xs text-gray-400">No hay eventos próximos.</p>
          </div>
        ) : (
          upcomingEvents.map(ev => (
            <div key={ev.id} className="p-3 border border-gray-100 bg-gray-50/50 rounded-xl hover:border-sky-200 hover:bg-sky-50 transition-colors cursor-pointer group">
              <h5 className="font-bold text-xs text-[#002755] mb-1.5 group-hover:text-sky-600 transition-colors">{ev.titulo}</h5>
              <div className="flex flex-col gap-1.5 text-[10px] text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon size={12} className="text-sky-500"/> 
                  {new Date(`${ev.fecha_evento}T12:00:00`).toLocaleDateString('es-CO')}
                </span>
                {(ev.hora_inicio || ev.hora_fin) && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-sky-500"/> 
                    {ev.hora_inicio?.slice(0,5)} {ev.hora_fin ? `- ${ev.hora_fin.slice(0,5)}` : ''}
                  </span>
                )}
                {ev.lugar && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-sky-500"/> 
                    {ev.lugar}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}