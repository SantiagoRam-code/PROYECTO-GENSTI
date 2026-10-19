import React, { useState } from 'react';
import { X, Send, Inbox, FileText, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';

const PQRS_META = {
  peticion: { label: "Petición", color: "bg-blue-100 text-blue-700 border-blue-200", desc: "Solicitud de información o trámites." },
  queja: { label: "Queja", color: "bg-orange-100 text-orange-700 border-orange-200", desc: "Inconformidad con la atención o servicio." },
  reclamo: { label: "Reclamo", color: "bg-rose-100 text-rose-700 border-rose-200", desc: "Exigencia por vulneración de derechos." },
  sugerencia: { label: "Sugerencia", color: "bg-emerald-100 text-emerald-700 border-emerald-200", desc: "Propuesta de mejora académica o física." }
};

export default function PQRSModal({ isOpen, onClose, userRole, currentUser, pqrsList, onAddPQRS, onRespondPQRS, onDeletePQRS }) {
  const [tab, setTab] = useState(userRole === 'admin' ? 'inbox' : 'new');
  
  // Formulario estudiante
  const [type, setType] = useState('peticion');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [anonymous, setAnonymous] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Formulario respuesta admin
  const [respondingId, setRespondingId] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || description.trim().length < 15) return;

    const newPQRS = {
      id: `PQRS-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      anonymous,
      author: anonymous ? "Anónimo" : currentUser,
      status: "recibido",
      response: "",
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    onAddPQRS(newPQRS);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setTab('inbox');
      setSubject('');
      setDescription('');
    }, 1500);
  };

  const handleSendResponse = (id) => {
    if (!adminResponse.trim()) return;
    onRespondPQRS(id, adminResponse);
    setRespondingId(null);
    setAdminResponse('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#002755] to-[#004b99] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Módulo de PQRS — GENSTI</h3>
              <p className="text-[10px] text-blue-200">Atención a solicitudes académicas y administrativas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setTab('inbox')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              tab === 'inbox' ? 'border-[#002755] text-[#002755] bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Inbox size={14} /> Solicitudes ({pqrsList.length})
          </button>
          
          {userRole === 'student' && (
            <button
              onClick={() => setTab('new')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                tab === 'new' ? 'border-[#002755] text-[#002755] bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <FileText size={14} /> Nueva Solicitud
            </button>
          )}
        </div>

        {/* Contenido Modal */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: RADICAR NUEVA PQRS */}
          {tab === 'new' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} /> Solicitud radicada exitosamente. Redirigiendo...
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Tipo de Solicitud</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(PQRS_META).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        type === key ? `${PQRS_META[key].color} border-current ring-1 ring-current` : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs font-bold">{PQRS_META[key].label}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{PQRS_META[key].desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Asunto</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej. Problema con la nota del primer corte"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción Detallada</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explica los hechos con claridad, incluyendo materia, código y fechas..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded-xl w-full">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="accent-[#002755]"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Anónimo</p>
                      <p className="text-[9px] text-gray-400">Ocultar mi nombre</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#002755] hover:bg-[#003877] text-white py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send size={14} /> Radicar Solicitud
              </button>
            </form>
          )}

          {/* TAB 2: LISTADO DE SOLICITUDES */}
          {tab === 'inbox' && (
            <div className="space-y-4">
              {pqrsList.length === 0 ? (
                <div className="text-center py-10">
                  <Inbox size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs font-bold text-gray-500">No hay PQRS registradas</p>
                  <p className="text-[10px] text-gray-400 mt-1">Las nuevas solicitudes aparecerán en este panel.</p>
                </div>
              ) : (
                pqrsList.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-2 relative">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${PQRS_META[item.type]?.color || 'bg-gray-100 text-gray-700'}`}>
                          {PQRS_META[item.type]?.label || item.type}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'resuelto' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status === 'resuelto' ? 'Resuelto' : 'En proceso'}
                        </span>
                      </div>

                      {/* Radicado y Botón de Eliminación */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">{item.id}</span>
                        {onDeletePQRS && (
                          <button
                            onClick={() => onDeletePQRS(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                            title="Eliminar solicitud"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-gray-800">{item.subject}</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{item.description}</p>
                    
                    <div className="text-[10px] text-gray-400 flex justify-between pt-1 border-t border-gray-100">
                      <span>Radicado por: <strong>{item.author}</strong></span>
                      <span>{item.date}</span>
                    </div>

                    {/* Respuesta del Admin */}
                    {item.response && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1">
                        <p className="font-bold text-[10px] text-blue-700">Respuesta Oficial:</p>
                        <p className="text-[11px]">{item.response}</p>
                      </div>
                    )}

                    {/* Acción de Responder para Admin */}
                    {userRole === 'admin' && !item.response && (
                      <div className="mt-3 pt-2">
                        {respondingId === item.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={adminResponse}
                              onChange={(e) => setAdminResponse(e.target.value)}
                              placeholder="Escribe la respuesta oficial para el estudiante..."
                              className="w-full p-2 border border-blue-200 rounded-lg text-xs bg-white focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSendResponse(item.id)}
                                className="bg-[#002755] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                              >
                                Enviar Respuesta
                              </button>
                              <button
                                onClick={() => setRespondingId(null)}
                                className="bg-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-lg"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRespondingId(item.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Responder a Estudiante
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}