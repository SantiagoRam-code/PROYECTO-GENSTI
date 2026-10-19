import React, { useEffect, useState } from 'react';
import { Newspaper, Plus, X, Calendar, User, Pencil, Trash2, UploadCloud, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getNoticias, crearNoticia, actualizarNoticia, eliminarNoticia } from '../services/noticiasService';

export const NoticiasList = ({ currentUser }) => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modales, Drag&Drop y Alertas visuales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Nuevo: Estados para alertas bonitas
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [form, setForm] = useState({
    titulo: '',
    extracto: '',
    contenido: '',
    categoria: 'General',
    imagen: null
  });

  const canPublish = currentUser && (
    currentUser.role === 'professor' || 
    currentUser.role === 'profesor' || 
    currentUser.role === 'coordinador' || 
    currentUser.role === 'admin'
  );

  // Función para mostrar notificaciones flotantes
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
    setForm({ titulo: '', extracto: '', contenido: '', categoria: 'General', imagen: null });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, noticia) => {
    e.stopPropagation(); 
    setEditingNoticia(noticia);
    setForm({
      titulo: noticia.titulo,
      extracto: noticia.extracto,
      contenido: noticia.contenido,
      categoria: noticia.categoria || 'General',
      imagen: null 
    });
    setIsModalOpen(true);
  };

  // Prepara la eliminación abriendo el modal bonito
  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  // Ejecuta la eliminación confirmada
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
      showToast('Por favor completa todos los campos obligatorios.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', form.titulo);
    formData.append('extracto', form.extracto);
    formData.append('contenido', form.contenido);
    formData.append('categoria', form.categoria);
    
    if (form.imagen instanceof File) {
      formData.append('imagen', form.imagen);
    }

    try {
      if (editingNoticia) {
        await actualizarNoticia(editingNoticia.id, formData);
        showToast('Noticia actualizada con éxito.', 'success');
      } else {
        await crearNoticia(formData);
        showToast('Noticia publicada exitosamente.', 'success');
      }
      setIsModalOpen(false);
      cargarNoticias();
    } catch (err) {
      showToast('Hubo un error al guardar la noticia.', 'error');
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all animate-bounce-in text-sm font-bold ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600"/> : <AlertTriangle size={18} className="text-rose-600"/>}
          {toast.message}
        </div>
      )}

      {/* HEADER DE LA SECCIÓN */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-[#002755]">
            <Newspaper size={14} />
          </div>
          <h3 className="font-bold text-sm text-[#002755]">Últimas Noticias</h3>
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
        <div className="text-center py-8 text-xs text-gray-500">Cargando noticias...</div>
      ) : error ? (
        <div className="text-center py-8 text-xs text-red-500">{error}</div>
      ) : noticias.length === 0 ? (
        <p className="text-gray-500 text-center py-6 text-xs">No hay noticias publicadas.</p>
      ) : (
        <div className="space-y-6">
          {noticias.map((item) => {
            const imgSrc = getImageUrl(item.imagen || item.url_imagen);
            return (
              <article 
                key={item.id} 
                onClick={() => setSelectedNoticia(item)}
                className="group cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-colors relative border border-transparent hover:border-gray-200"
              >
                {canPublish && (
                  <div className="absolute top-4 right-4 z-10 flex gap-1 bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleOpenEditModal(e, item)} 
                      className="p-1.5 hover:text-sky-600 text-gray-500 hover:bg-sky-50 rounded-md transition-colors"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteClick(e, item.id)} 
                      className="p-1.5 hover:text-red-600 text-gray-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}

                {imgSrc && (
                  <div className="relative rounded-xl overflow-hidden mb-3 bg-gray-50 border border-gray-100">
                    <img
                      src={imgSrc}
                      alt={item.titulo}
                      className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.categoria && (
                      <span className="absolute bottom-2 left-2 bg-[#002755] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-md z-10">
                        {item.categoria}
                      </span>
                    )}
                  </div>
                )}
                <h4 className="font-bold text-[13px] text-gray-800 leading-snug mb-1 group-hover:text-sky-600 transition-colors">
                  {item.titulo}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                  {item.extracto || item.contenido}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                  <span>{item.fecha_publicacion ? new Date(item.fecha_publicacion).toLocaleDateString() : 'Reciente'}</span>
                  <span className="text-sky-600 font-semibold hover:underline">Leer más →</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* MODAL: CONFIRMACIÓN DE ELIMINACIÓN (BONITO) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl scale-100 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-rose-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">¿Eliminar Noticia?</h3>
            <p className="text-xs text-gray-500 mb-6 px-2">Esta acción no se puede deshacer. La noticia será borrada permanentemente del sistema.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-md shadow-rose-200"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LECTURA COMPLETA */}
      {selectedNoticia && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedNoticia(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {getImageUrl(selectedNoticia.imagen || selectedNoticia.url_imagen) && (
              <div className="w-full bg-gray-50 rounded-xl mb-5 border border-gray-100 overflow-hidden flex justify-center items-center">
                <img
                  src={getImageUrl(selectedNoticia.imagen || selectedNoticia.url_imagen)}
                  alt={selectedNoticia.titulo}
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                <Calendar size={13} />
                {new Date(selectedNoticia.fecha_publicacion || Date.now()).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                <User size={13} />
                {selectedNoticia.autor_nombre || 'Coordinación GENSTI'}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#002755] mb-2 leading-tight">{selectedNoticia.titulo}</h2>
            
            {selectedNoticia.extracto && (
              <p className="text-sm font-medium text-gray-600 mb-5 italic border-l-4 border-sky-500 pl-4 py-1 bg-sky-50/50 rounded-r-lg">
                {selectedNoticia.extracto}
              </p>
            )}

            <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-5">
              {selectedNoticia.contenido}
            </div>

            <div className="mt-8 text-right border-t border-gray-100 pt-4">
              <button
                onClick={() => setSelectedNoticia(null)}
                className="px-5 py-2.5 text-xs font-bold bg-[#002755] text-white rounded-xl shadow-md hover:bg-[#003877] transition-colors"
              >
                Cerrar Noticia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg text-[#002755] mb-5 flex items-center gap-2">
              {editingNoticia ? <Pencil size={18}/> : <Plus size={18}/>}
              {editingNoticia ? 'Editar Noticia' : 'Publicar Nueva Noticia'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Título *</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Inicio de clases 2026-2"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Categoría</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  placeholder="Ej: General, Académico, Semilleros"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Extracto Corto *</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                  value={form.extracto}
                  onChange={(e) => setForm({ ...form, extracto: e.target.value })}
                  placeholder="Resumen de 1-2 líneas..."
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Contenido Completo *</label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow resize-none"
                  value={form.contenido}
                  onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                  placeholder="Cuerpo completo de la noticia..."
                  required
                ></textarea>
              </div>

              {/* Selector de Archivos y Drag & Drop Implementado */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Imagen de portada</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all bg-gray-50/50 ${
                    isDragging ? 'border-sky-500 bg-sky-50 scale-[1.02]' : 'border-gray-200 hover:border-sky-400'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setForm({ ...form, imagen: e.target.files[0] });
                      }
                    }}
                  />
                  <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                    <UploadCloud className={`${isDragging ? 'text-sky-600' : 'text-gray-400'} transition-colors`} size={28} />
                    <span className="text-xs text-gray-700 font-bold">
                      {form.imagen ? form.imagen.name : 'Haz clic o arrastra una imagen aquí'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">PNG, JPG, WEBP (Max 5MB)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#002755] text-white rounded-xl hover:bg-[#003877] shadow-md transition-colors"
                >
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