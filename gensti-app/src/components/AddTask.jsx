import React, { useState } from 'react'

export default function AddTask() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Diseñar prototipo no funcional', date: '2026-09-21', status: 'Completada' },
    { id: 2, title: 'Documentación de la plataforma', date: '2026-10-15', status: 'En Progreso' }
  ])

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  // Función básica para sanitizar texto y prevenir inyección de código (XSS)
  const sanitizeInput = (text) => {
    return text.replace(/[<>]/g, '') // Elimina caracteres < y >
  }

  const handleAddTask = (e) => {
    e.preventDefault()

    const cleanTitle = sanitizeInput(title.trim())
    const cleanDate = date.trim()

    // Validaciones de seguridad y contenido
    if (!cleanTitle) {
      setError('El título de la tarea no puede estar vacío.')
      return
    }

    if (!cleanDate) {
      setError('Por favor selecciona una fecha válida.')
      return
    }

    setError('')

    // Crear nueva tarea
    const newTask = {
      id: Date.now(),
      title: cleanTitle,
      date: cleanDate,
      status: 'Pendiente'
    }

    setTasks([...tasks, newTask])
    setTitle('')
    setDate('')
  }

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Tareas</h1>
        <p className="text-sm text-gray-600">Crea y administra los pendientes del proyecto.</p>
      </div>

      {/* Formulario de creación */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Nueva Tarea</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Revisar entregable"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
              + Agregar Tarea
            </button>
          </div>
        </form>
      </div>

      {/* Lista de tareas */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Listado de Tareas</h2>
        </div>

        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="p-6 text-center text-gray-500 text-sm">No hay tareas registradas.</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                  <p className="text-xs text-gray-500">Fecha: {task.date}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      task.status === 'Completada'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'En Progreso'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.status}
                  </span>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}