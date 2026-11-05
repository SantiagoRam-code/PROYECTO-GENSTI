import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, X, Newspaper, AlertTriangle, CheckCircle2, Ticket, UserCheck, Mail } from 'lucide-react';
import { getEventos, crearEvento, actualizarEvento, eliminarEvento } from '../services/eventosService';
import { crearNoticia } from '../services/noticiasService';

export default function CalendarView({ currentUser }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [verInscritosEvento, setVerInscritosEvento] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [publicarNoticia, setPublicarNoticia] = useState(true);

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

  const canManageEvents = currentUser && (
    currentUser.role === 'professor' || 
    currentUser.role === 'profesor' || 
    currentUser.role === 'coordinador' || 
    currentUser.role === 'admin'
  );

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

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
    try {
      const nuevoEvento = await crearEvento({
        titulo: form.titulo,
        tipo_evento: form.tipo_evento,
        fecha_evento: form.fecha_evento,
        hora_inicio: form.hora_inicio ? `${form.hora_inicio}:00` : null,
        hora_fin: form.hora_fin ? `${form.hora_fin}:00` : null,
        lugar: form.lugar || '',
        cupos_disponibles: parseInt(form.cupos_disponibles) || 0,
        descripcion: form.descripcion || ''
      });

      if (publicarNoticia && nuevoEvento?.id) {
        const formData = new FormData();
        formData.append('titulo', `Evento: ${form.titulo}`);
        formData.append('categoria', form.tipo_evento);
        formData.append('extracto', form.descripcion || `Inscripciones abiertas para ${form.titulo}`);
        formData.append('contenido', `${form.descripcion}\n\nLugar: ${form.lugar || 'Campus UCC'}\nFecha: ${form.fecha_evento}`);
        formData.append('evento_relacionado', nuevoEvento.id);

        await crearNoticia(formData);
      }

      setIsModalOpen(false);
      setForm({ titulo: '', tipo_evento: 'Académico', fecha_evento: '', hora_inicio: '', hora_fin: '', lugar: '', cupos_disponibles: 0, descripcion: '' });
      showToast("Evento guardado y publicado en noticias con éxito.", "success");
      cargarEventos();
    } catch (error) {
      showToast("Hubo un error al crear el evento.", "error");
    }
  };

  const handleInscripcion = async (evento) => {
    if (evento.cupos_disponibles > 0) {
      try {
        await actualizarEvento(evento.id, { cupos_disponibles: evento.cupos_disponibles - 1 });
        cargarEventos();
        showToast(`¡Inscripción confirmada para "${evento.titulo}"!`, "success");
      } catch (error) {
        showToast("No se pudo procesar la inscripción.", "error");
      }
    } else {
      showToast("Lo sentimos, no quedan cupos disponibles para este evento.", "error");
    }
  };

  const confirmEliminar = async () => {
    try {
      await eliminarEvento(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast("Evento eliminado correctamente del sistema.", "success");
      cargarEventos();
    } catch(error) {
      setDeleteConfirmId(null);
      showToast("Error al eliminar el evento.", "error");
    }
  };

  return (
    <div className="space-y-6 relative">

      {/* NOTIFICACIÓN FLOTANTE */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all text-sm font-bold ${
          toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600"/> : <AlertTriangle size={18} className="text-rose-600"/>}
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 flex items-center justify-between transition-colors">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="text-sky-600 dark:text-sky-400" size={24} />
            <h2 className="text-2xl font-bold text-[#002755] dark:text-white">Calendario Académico y Eventos GENSTI</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Inscríbete a los talleres, conferencias y consulta las fechas clave del semestre.</p>
        </div>
        
        {canManageEvents && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={18} /> Crear Evento
          </button>
        )}
      </div>

      {/* LISTA DE EVENTOS */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-xs">Cargando eventos...</div>
      ) : eventos.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center text-gray-500 dark:text-gray-400 text-xs">
          No hay eventos programados en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map(evento => {
            const inscritosLista = evento.inscritos_detalle || [];
            const cantidadInscritos = evento.inscritos_count || inscritosLista.length;

            return (
              <div key={evento.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col relative group transition-colors">
                
                {canManageEvents && (
                  <button 
                    onClick={() => setDeleteConfirmId(evento.id)}
                    className="absolute top-4 right-4 p-1.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Eliminar evento"
                  >
                    <X size={14} />
                  </button>
                )}

                <span className="text-[10px] font-bold px-2.5 py-1 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full w-fit mb-4">
                  {evento.tipo_evento}
                </span>
                
                <h3 className="font-bold text-[#002755] dark:text-white mb-3 leading-tight">{evento.titulo}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 flex-1">{evento.descripcion}</p>
                
                <div className="space-y-2.5 mb-5 text-xs text-gray-600 dark:text-gray-300 font-medium bg-gray-50/50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
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
                    <span>{evento.cupos_disponibles > 0 ? `${evento.cupos_disponibles} cupos disponibles` : 'Sin límite / Informativo'}</span>
                  </div>
                </div>

                {canManageEvents && (
                  <button
                    onClick={() => setVerInscritosEvento(evento)}
                    className="w-full mb-2 bg-sky-50 dark:bg-sky-950 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-sky-200 dark:border-sky-800 cursor-pointer"
                  >
                    <UserCheck size={14} /> Ver Estudiantes Inscritos ({cantidadInscritos})
                  </button>
                )}

                {evento.cupos_disponibles > 0 ? (
                  <button 
                    onClick={() => handleInscripcion(evento)}
                    className="w-full bg-[#002755] hover:bg-[#003877] text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Ticket size={14} /> Inscribirme al evento
                  </button>
                ) : (
                  <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-2.5 rounded-xl text-xs text-center border border-gray-200 dark:border-gray-600">
                    Evento informativo / Lleno
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL PROFESOR: LISTA DE ESTUDIANTES INSCRITOS */}
      {verInscritosEvento && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setVerInscritosEvento(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-50 dark:bg-gray-700 p-1.5 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-700 dark:text-sky-300">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#002755] dark:text-sky-400">Estudiantes Inscritos</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{verInscritosEvento.titulo}</p>
              </div>
            </div>

            {(!verInscritosEvento.inscritos_detalle || verInscritosEvento.inscritos_detalle.length === 0) ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                <Users size={28} className="mx-auto text-gray-300 dark:text-gray-500 mb-2" />
                <p className="text-xs font-bold text-gray-500 dark:text-gray-300">No hay estudiantes inscritos aún.</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5">Los registros aparecerán aquí automáticamente.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {verInscritosEvento.inscritos_detalle.map((estudiante, index) => (
                  <div key={estudiante.id || index} className="p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#002755] text-white font-bold text-xs flex items-center justify-center">
                        {(estudiante.nombre_completo || estudiante.username || 'E')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white">{estudiante.nombre_completo || estudiante.username}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Mail size={10} /> {estudiante.email || `${estudiante.username}@campusucc.edu.co`}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                      Confirmado
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 text-right">
              <button
                onClick={() => setVerInscritosEvento(null)}
                className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">¿Eliminar Evento?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 px-2">Esta acción borrará el evento y su información del sistema permanentemente.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancelar
              </button>
              <button onClick={confirmEliminar} className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-md shadow-rose-200 dark:shadow-none">
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR EVENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100 dark:border-gray-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-50 dark:bg-gray-700 p-1.5 rounded-full">
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg text-[#002755] dark:text-sky-400 mb-5 flex items-center gap-2">
              <CalendarIcon size={18}/> Crear Nuevo Evento
            </h3>
            
            <form onSubmit={handleCrearEvento} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Título del Evento *</label>
                <input required type="text" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} placeholder="Ej: Taller de Docker y Kubernetes" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Tipo *</label>
                  <select className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.tipo_evento} onChange={(e) => setForm({...form, tipo_evento: e.target.value})}>
                    <option className="dark:bg-gray-800">Académico</option>
                    <option className="dark:bg-gray-800">Taller / Competencia</option>
                    <option className="dark:bg-gray-800">Hito Institucional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Fecha *</label>
                  <input required type="date" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.fecha_evento} onChange={(e) => setForm({...form, fecha_evento: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Hora Inicio</label>
                  <input type="time" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.hora_inicio} onChange={(e) => setForm({...form, hora_inicio: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Hora Fin</label>
                  <input type="time" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.hora_fin} onChange={(e) => setForm({...form, hora_fin: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Lugar</label>
                  <input type="text" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.lugar} onChange={(e) => setForm({...form, lugar: e.target.value})} placeholder="Ej. Auditorio Central" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Cupos Disp. (0 = Sin límite)</label>
                  <input type="number" min="0" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.cupos_disponibles} onChange={(e) => setForm({...form, cupos_disponibles: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Descripción</label>
                <textarea rows="3" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 resize-none outline-none" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})}></textarea>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publicarNoticia}
                    onChange={(e) => setPublicarNoticia(e.target.checked)}
                    className="accent-[#002755]"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <Newspaper size={15} className="text-sky-600 dark:text-sky-400"/> Publicar noticia automática sobre este evento
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-[#002755] text-white rounded-xl hover:bg-[#003877]">Crear Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}