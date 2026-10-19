import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { validateUccEmail, loginUser, registerUser } from '../data/authService';

export default function LoginModal({ isOpen, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const domainValidation = validateUccEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error("Por favor ingresa tu nombre completo.");
        const newUser = registerUser(name, email, password);
        onLoginSuccess(newUser);
      } else {
        const user = loginUser(email, password);
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001e40]/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Encabezado Institucional */}
        <div className="bg-gradient-to-r from-[#002755] to-[#004b99] p-6 text-white text-center relative">
          <div className="w-12 h-12 bg-white rounded-xl mx-auto flex items-center justify-center text-[#002755] font-extrabold text-sm shadow-md mb-3">
            UCC
          </div>
          <h2 className="text-xl font-bold">Plataforma GENSTI</h2>
          <p className="text-xs text-blue-200 mt-1">Programa de Ingeniería de Sistemas</p>
        </div>

        {/* Formulario */}
        <div className="p-6">
          <div className="flex border-b border-gray-100 mb-6">
            <button
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-colors ${!isRegister ? 'border-[#002755] text-[#002755]' : 'border-transparent text-gray-400'}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-colors ${isRegister ? 'border-[#002755] text-[#002755]' : 'border-transparent text-gray-400'}`}
            >
              Crear Cuenta
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Thomas Santiago Ramirez"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Correo Institucional</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRegister ? "usuario@campusucc.edu.co" : "tu_correo@ucc.edu.co"}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              {/* Detector automático de dominio y rol */}
              {email.length > 5 && (
                <div className="mt-2">
                  {domainValidation.isValid ? (
                    <div className={`p-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 ${
                      domainValidation.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}>
                      <CheckCircle2 size={12} /> Rol Detectado: {domainValidation.domainLabel}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic">
                      Dominios válidos: @campusucc.edu.co (Estudiantes) o @ucc.edu.co (Profesores).
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#002755] hover:bg-[#003877] text-white py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {isRegister ? "Registrar e Iniciar Sesión" : "Ingresar a GENSTI"}
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Cuentas demo para pruebas rápidas */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400 text-center space-y-1">
            <p className="font-bold text-gray-500">Cuentas de prueba rápida:</p>
            <p>Estudiante: <code className="bg-gray-100 px-1 rounded">thomas.santi@campusucc.edu.co</code> (Clave: 123)</p>
            <p>Profesor: <code className="bg-gray-100 px-1 rounded">coordinacion@ucc.edu.co</code> (Clave: 123)</p>
          </div>

        </div>
      </div>
    </div>
  );
}