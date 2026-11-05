import React, { useEffect, useState } from 'react';
import { Newspaper, Plus, X, Calendar, User, Pencil, Trash2, UploadCloud, AlertTriangle, CheckCircle2, Ticket } from 'lucide-react';
import { getNoticias, crearNoticia, actualizarNoticia, eliminarNoticia } from '../services/noticiasService';
import { crearEvento } from '../services/eventosService';

export const NoticiasList = ({ currentUser, onNavigateToCalendar }) => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [incluirEvento, setIncluirEvento] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    extracto: '',
    contenido: '',
    categoria: 'General',
    imagen: null,
    fecha_evento: '',
    hora_inicio: '',
    hora_fin: '',
    lugar: '',
    cupos_disponibles: 0
  });

  const canPublish = currentUser && (
    currentUser.role === 'professor' || 
    currentUser.role === 'profesor' || 
    currentUser.role === 'coordinador' || 
    currentUser.role === 'admin'
  );

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const cargarNoticias = () => {
    setLoading(true);
    getNoticias()
      .then((data) => {
        setNoticias(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar las noticias.');
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingNoticia(null);
    setIncluirEvento(false);
    setForm({ 
      titulo: '', extracto: '', contenido: '', categoria: 'General', imagen: null, 
      fecha_evento: '', hora_inicio: '', hora_fin: '', lugar: '', cupos_disponibles: 0 
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, noticia) => {
    e.stopPropagation(); 
    setEditingNoticia(noticia);
    setIncluirEvento(false);
    setForm({
      titulo: noticia.titulo,
      extracto: noticia.extracto,
      contenido: noticia.contenido,
      categoria: noticia.categoria || 'General',
      imagen: null,
      fecha_evento: '', hora_inicio: '', hora_fin: '', lugar: '', cupos_disponibles: 0
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    try {
      await eliminarNoticia(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Noticia eliminada correctamente.', 'success');
      cargarNoticias();
    } catch (err) {
      showToast('No se pudo eliminar la noticia.', 'error');
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.extracto || !form.contenido) {
      showToast('Por favor completa los campos obligatorios.', 'error');
      return;
    }

    try {
      let eventoCreadoId = null;

      if (incluirEvento && !editingNoticia) {
        if (!form.fecha_evento) {
          showToast('Por favor asigna una fecha para el evento.', 'error');
          return;
        }

        const nuevoEvento = await crearEvento({
          titulo: form.titulo,
          tipo_evento: form.categoria || 'Académico',
          fecha_evento: form.fecha_evento,
          hora_inicio: form.hora_inicio ? `${form.hora_inicio}:00` : null,
          hora_fin: form.hora_fin ? `${form.hora_fin}:00` : null,
          lugar: form.lugar || '',
          cupos_disponibles: parseInt(form.cupos_disponibles) || 0,
          descripcion: form.extracto
        });

        eventoCreadoId = nuevoEvento.id;
      }

      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('extracto', form.extracto);
      formData.append('contenido', form.contenido);
      formData.append('categoria', form.categoria);
      
      if (eventoCreadoId) {
        formData.append('evento_relacionado', eventoCreadoId);
      }

      if (form.imagen instanceof File) {
        formData.append('imagen', form.imagen);
      }

      if (editingNoticia) {
        await actualizarNoticia(editingNoticia.id, formData);
        showToast('Noticia actualizada.', 'success');
      } else {
        await crearNoticia(formData);
        showToast('Noticia y evento creados exitosamente.', 'success');
      }

      setIsModalOpen(false);
      cargarNoticias();
    } catch (err) {
      showToast('Hubo un error al guardar.', 'error');
    }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') {
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      return `http://127.0.0.1:8000${img}`;
    }
    return URL.createObjectURL(img);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setForm({ ...form, imagen: e.dataTransfer.files[0] });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 relative transition-colors">
      
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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-[#002755] dark:text-sky-400">
            <Newspaper size={14} />
          </div>
          <h3 className="font-bold text-sm text-[#002755] dark:text-white">Últimas Noticias</h3>
        </div>

        {canPublish && (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1 text-xs bg-sky-600 hover:bg-sky-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={14} /> Publicar
          </button>
        )}
      </div>

      {/* LISTA DE NOTICIAS */}
      {loading ? (
        <div className="text-center py-8 text-xs text-gray-500 dark:text-gray-400">Cargando noticias...</div>
      ) : error ? (
        <div className="text-center py-8 text-xs text-red-500">{error}</div>
      ) : noticias.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 text-xs">No hay noticias publicadas.</p>
      ) : (
        <div className="space-y-6">
          {noticias.map((item) => {
            const imgSrc = getImageUrl(item.imagen || item.url_imagen);
            const evento = item.evento_detail;

            return (
              <article 
                key={item.id} 
                onClick={() => setSelectedNoticia(item)}
                className="group cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors relative border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                {canPublish && (
                  <div className="absolute top-4 right-4 z-10 flex gap-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-1 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleOpenEditModal(e, item)} className="p-1.5 hover:text-sky-600 text-gray-500 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-sky-950 rounded-md">
                      <Pencil size={13} />
                    </button>
                    <button onClick={(e) => handleDeleteClick(e, item.id)} className="p-1.5 hover:text-red-600 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-md">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}

                {imgSrc && (
                  <div className="relative rounded-xl overflow-hidden mb-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                    <img src={imgSrc} alt={item.titulo} className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-500" />
                    {item.categoria && (
                      <span className="absolute bottom-2 left-2 bg-[#002755] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-md z-10">
                        {item.categoria}
                      </span>
                    )}
                  </div>
                )}

                <h4 className="font-bold text-[13px] text-gray-800 dark:text-gray-100 leading-snug mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {item.titulo}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                  {item.extracto || item.contenido}
                </p>

                {evento && (
                  <div className="my-2.5 p-2.5 bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800/60 rounded-xl flex items-center justify-between">
                    <div className="text-[10px] text-sky-900 dark:text-sky-200 font-medium">
                      <span className="font-bold block flex items-center gap-1">
                        <Ticket size={12} className="text-sky-600 dark:text-sky-400"/> Evento Disponible
                      </span>
                      <span>{evento.fecha_evento} | {evento.lugar || 'Campus UCC'}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToCalendar) onNavigateToCalendar();
                      }}
                      className="text-[10px] bg-sky-600 hover:bg-sky-700 text-white font-bold py-1 px-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      Ver Evento →
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-700">
                  <span>{item.fecha_publicacion ? new Date(item.fecha_publicacion).toLocaleDateString() : 'Reciente'}</span>
                  <span className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">Leer más →</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* MODAL BORRADO */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">¿Eliminar Noticia?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 px-2">Esta acción borrará la noticia de la plataforma.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LECTURA */}
      {selectedNoticia && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl border border-gray-100 dark:border-gray-700">
            <button onClick={() => setSelectedNoticia(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X size={20} />
            </button>

            {getImageUrl(selectedNoticia.imagen || selectedNoticia.url_imagen) && (
              <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl mb-5 border border-gray-100 dark:border-gray-700 flex justify-center items-center">
                <img src={getImageUrl(selectedNoticia.imagen || selectedNoticia.url_imagen)} alt={selectedNoticia.titulo} className="max-w-full max-h-[400px] object-contain" />
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                <Calendar size={13} />
                {new Date(selectedNoticia.fecha_publicacion || Date.now()).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                <User size={13} />
                {selectedNoticia.autor_nombre || 'Coordinación GENSTI'}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#002755] dark:text-sky-400 mb-2">{selectedNoticia.titulo}</h2>
            
            {selectedNoticia.extracto && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-5 italic border-l-4 border-sky-500 pl-4 py-1 bg-sky-50/50 dark:bg-gray-700/50 rounded-r-lg">
                {selectedNoticia.extracto}
              </p>
            )}

            {selectedNoticia.evento_detail && (
              <div className="mb-5 p-4 bg-sky-50 dark:bg-gray-700/60 border border-sky-200 dark:border-gray-600 rounded-2xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-sky-900 dark:text-sky-300 mb-1 flex items-center gap-1.5">
                    <Ticket size={16} className="text-sky-600 dark:text-sky-400"/> Evento Vinculado a esta Noticia
                  </h5>
                  <p className="text-[11px] text-sky-700 dark:text-gray-300">
                    Fecha: <strong>{selectedNoticia.evento_detail.fecha_evento}</strong> | Lugar: <strong>{selectedNoticia.evento_detail.lugar || 'Campus UCC'}</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedNoticia(null);
                    if (onNavigateToCalendar) onNavigateToCalendar();
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#002755] hover:bg-[#003877] text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Ir al Evento →
                </button>
              </div>
            )}

            <div className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line border-t border-gray-100 dark:border-gray-700 pt-5">
              {selectedNoticia.contenido}
            </div>

            <div className="mt-8 text-right border-t border-gray-100 dark:border-gray-700 pt-4">
              <button onClick={() => setSelectedNoticia(null)} className="px-5 py-2.5 text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR NOTICIA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-50 dark:bg-gray-700 p-1.5 rounded-full">
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg text-[#002755] dark:text-sky-400 mb-5 flex items-center gap-2">
              {editingNoticia ? <Pencil size={18}/> : <Plus size={18}/>}
              {editingNoticia ? 'Editar Noticia' : 'Publicar Nueva Noticia'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-300 mb-1.5">Título *</label>
                <input type="text" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Conferencia de IA" required />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-300 mb-1.5">Categoría</label>
                <input type="text" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Ej: General, Académico, Semilleros" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-300 mb-1.5">Extracto Corto *</label>
                <input type="text" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none" value={form.extracto} onChange={(e) => setForm({ ...form, extracto: e.target.value })} placeholder="Breve resumen..." required />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-300 mb-1.5">Contenido Completo *</label>
                <textarea rows="3" className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 resize-none outline-none" value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} placeholder="Cuerpo de la noticia..." required></textarea>
              </div>

              {!editingNoticia && (
                <div className="p-3 bg-sky-50 dark:bg-gray-700/60 border border-sky-200 dark:border-gray-600 rounded-xl space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={incluirEvento}
                      onChange={(e) => setIncluirEvento(e.target.checked)}
                      className="accent-[#002755]"
                    />
                    <span className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                      <Ticket size={15} /> ¿Esta noticia incluye inscripción a evento?
                    </span>
                  </label>

                  {incluirEvento && (
                    <div className="space-y-3 pt-2 border-t border-sky-200 dark:border-gray-600">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-sky-800 dark:text-gray-300 mb-1">Fecha del Evento *</label>
                          <input type="date" className="w-full border border-sky-200 dark:border-gray-600 rounded-lg p-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" value={form.fecha_evento} onChange={(e) => setForm({...form, fecha_evento: e.target.value})} required={incluirEvento} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-sky-800 dark:text-gray-300 mb-1">Cupos Disponibles</label>
                          <input type="number" min="0" className="w-full border border-sky-200 dark:border-gray-600 rounded-lg p-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" value={form.cupos_disponibles} onChange={(e) => setForm({...form, cupos_disponibles: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-sky-800 dark:text-gray-300 mb-1">Hora Inicio</label>
                          <input type="time" className="w-full border border-sky-200 dark:border-gray-600 rounded-lg p-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" value={form.hora_inicio} onChange={(e) => setForm({...form, hora_inicio: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-sky-800 dark:text-gray-300 mb-1">Hora Fin</label>
                          <input type="time" className="w-full border border-sky-200 dark:border-gray-600 rounded-lg p-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" value={form.hora_fin} onChange={(e) => setForm({...form, hora_fin: e.target.value})} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-sky-800 dark:text-gray-300 mb-1">Lugar</label>
                        <input type="text" className="w-full border border-sky-200 dark:border-gray-600 rounded-lg p-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" value={form.lugar} onChange={(e) => setForm({...form, lugar: e.target.value})} placeholder="Ej: Auditorio Central" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-300 mb-1.5">Imagen de portada</label>
                <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-4 text-center transition-all bg-gray-50/50 dark:bg-gray-700/50 ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-950' : 'border-gray-200 dark:border-gray-600'}`}>
                  <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) setForm({ ...form, imagen: e.target.files[0] }); }} />
                  <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-1.5">
                    <UploadCloud className="text-gray-400 dark:text-gray-300" size={24} />
                    <span className="text-xs text-gray-700 dark:text-gray-200 font-bold">{form.imagen ? form.imagen.name : 'Subir o arrastrar imagen'}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-[#002755] text-white rounded-xl hover:bg-[#003877]">
                  {editingNoticia ? 'Guardar Cambios' : 'Publicar Noticia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};