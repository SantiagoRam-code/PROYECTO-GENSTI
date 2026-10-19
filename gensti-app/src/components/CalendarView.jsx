import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, X } from 'lucide-react';
import { getEventos, crearEvento, actualizarEvento, eliminarEvento } from '../services/eventosService';

export default function CalendarView({ currentUser }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para el formulario de crear evento
  const [form, setForm] = useState({
    titulo: '',
    tipo_evento: 'Académico',
    fecha_evento: '',
    hora_inicio: '',
    hora_fin: '',
    lugar: '',
    cupos_disponibles: 0,
    descripcion: ''
  });

  // Validar si es Profesor o Admin para permitirle crear
  const canManageEvents = currentUser && (currentUser.role === 'professor' || currentUser.role === 'profesor' || currentUser.role === 'admin');

  const cargarEventos = () => {
    setLoading(true);
    getEventos()
      .then(data => {
        setEventos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando eventos:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarEventos();
  }, []);

const handleCrearEvento = async (e) => {
    e.preventDefault();
    
    // Limpiamos los datos antes de enviarlos a Django
    const eventoData = {
        titulo: form.titulo,
        tipo_evento: form.tipo_evento,
        fecha_evento: form.fecha_evento,
        hora_inicio: form.hora_inicio ? `${form.hora_inicio}:00` : null, 
        hora_fin: form.hora_fin ? `${form.hora_fin}:00` : null,
        lugar: form.lugar || "",
        cupos_disponibles: parseInt(form.cupos_disponibles) || 0,
        descripcion: form.descripcion || ""
    };

    try {
        await crearEvento(eventoData);
        setIsModalOpen(false);
        // Reiniciamos el formulario
        setForm({ titulo: '', tipo_evento: 'Académico', fecha_evento: '', hora_inicio: '', hora_fin: '', lugar: '', cupos_disponibles: 0, descripcion: '' });
        cargarEventos(); // Recargamos la lista
    } catch (error) {
        console.error("Error detallado al crear:", error);
        alert("Hubo un error al crear el evento. Revisa la consola (F12) para más detalles.");
    }
};

  const handleInscripcion = async (evento) => {
    // Aquí simulamos la inscripción restando un cupo (en el futuro esto lo manejará el backend conectando el ID del usuario)
    if (evento.cupos_disponibles > 0) {
      try {
        await actualizarEvento(evento.id, { cupos_disponibles: evento.cupos_disponibles - 1 });
        cargarEventos();
        alert("¡Inscripción exitosa!");
      } catch (error) {
        alert("No se pudo procesar la inscripción.");
      }
    } else {
      alert("Lo sentimos, no hay cupos disponibles.");
    }
  };

  const handleEliminar = async (id) => {
    if(window.confirm("¿Seguro que deseas eliminar este evento?")) {
      try {
        await eliminarEvento(id);
        cargarEventos();
      } catch(error) {
        alert("Error al eliminar el evento.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="text-sky-600" size={24} />
            <h2 className="text-2xl font-bold text-[#002755]">Calendario Académico y Eventos GENSTI</h2>
          </div>
          <p className="text-gray-500 text-sm">Inscríbete a los talleres, conferencias y consulta las fechas clave del semestre.</p>
        </div>
        
        {canManageEvents && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={18} /> Crear Evento
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando eventos...</div>
      ) : eventos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
          No hay eventos programados en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map(evento => (
            <div key={evento.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col relative group">
              
              {canManageEvents && (
                <button 
                  onClick={() => handleEliminar(evento.id)}
                  className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar evento"
                >
                  <X size={14} />
                </button>
              )}

              <span className="text-[10px] font-bold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full w-fit mb-4">
                {evento.tipo_evento}
              </span>
              
              <h3 className="font-bold text-[#002755] mb-3 leading-tight">{evento.titulo}</h3>
              <p className="text-xs text-gray-500 mb-5 flex-1">{evento.descripcion}</p>
              
              <div className="space-y-2.5 mb-6 text-xs text-gray-600 font-medium bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-sky-500" />
                  <span>{evento.fecha_evento} | {evento.hora_inicio?.slice(0,5)} {evento.hora_fin ? `- ${evento.hora_fin.slice(0,5)}` : ''}</span>
                </div>
                {evento.lugar && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-sky-500" />
                    <span>{evento.lugar}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-sky-500" />
                  <span>{evento.cupos_disponibles > 0 ? `${evento.cupos_disponibles} cupos disponibles` : 'Sin límite de cupos / Informativo'}</span>
                </div>
              </div>

              {evento.cupos_disponibles > 0 ? (
                <button 
                  onClick={() => handleInscripcion(evento)}
                  className="w-full bg-[#002755] hover:bg-[#003877] text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Inscribirme al evento
                </button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 font-bold py-2.5 rounded-xl text-xs text-center border border-gray-200">
                  Evento informativo / Lleno
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL PARA CREAR EVENTOS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full">
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg text-[#002755] mb-5 flex items-center gap-2">
              <CalendarIcon size={18}/> Crear Nuevo Evento
            </h3>
            
            <form onSubmit={handleCrearEvento} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Título del Evento *</label>
                <input required type="text" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Tipo *</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 bg-white" value={form.tipo_evento} onChange={(e) => setForm({...form, tipo_evento: e.target.value})}>
                    <option>Académico</option>
                    <option>Taller / Competencia</option>
                    <option>Hito Institucional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Fecha *</label>
                  <input required type="date" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500" value={form.fecha_evento} onChange={(e) => setForm({...form, fecha_evento: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Hora Inicio</label>
                  <input type="time" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500" value={form.hora_inicio} onChange={(e) => setForm({...form, hora_inicio: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Hora Fin</label>
                  <input type="time" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500" value={form.hora_fin} onChange={(e) => setForm({...form, hora_fin: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Lugar</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500" value={form.lugar} onChange={(e) => setForm({...form, lugar: e.target.value})} placeholder="Ej. Auditorio Central" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Cupos Disp. (0 = Sin límite)</label>
                  <input type="number" min="0" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500" value={form.cupos_disponibles} onChange={(e) => setForm({...form, cupos_disponibles: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Descripción</label>
                <textarea rows="3" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 resize-none" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})}></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-[#002755] text-white rounded-xl">Crear Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}