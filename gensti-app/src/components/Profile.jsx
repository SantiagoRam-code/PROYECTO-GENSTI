import React, { useState } from 'react'

export default function Profile({ user }) {
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Usuario GENSTI',
    email: user?.email || 'correo@ucc.edu.co',
    role: user?.role || 'Estudiante / Profesor',
    program: 'Ingeniería de Sistemas',
    university: 'Universidad Cooperativa de Colombia'
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulación de actualización de datos en el perfil
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-sm text-gray-600">Administra tus datos personales y configuración de cuenta.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-green-100 text-green-700 text-sm rounded-md">
          ✅ Información actualizada correctamente.
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled
              className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md text-sm text-gray-500 cursor-not-allowed"
            />
            <span className="text-[11px] text-gray-400">El correo institucional no se puede modificar.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programa Académico</label>
              <input
                type="text"
                name="program"
                value={profileData.program}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
              <input
                type="text"
                name="university"
                value={profileData.university}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md text-sm transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
