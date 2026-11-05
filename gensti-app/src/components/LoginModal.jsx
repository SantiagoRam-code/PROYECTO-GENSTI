import React, { useState } from 'react';
import { Lock, User, Mail, UserCheck, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../data/authService';

// Importación directa
import genstiLogo from '../assets/gensti-logo.jpg';
import uccLogo from '../assets/ucc-logo.png';

export default function LoginModal({ isOpen, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        if (!form.username || !form.password || !form.name) {
          setError('Por favor completa todos los campos requeridos.');
          setLoading(false);
          return;
        }
        const data = await registerUser(form);
        localStorage.setItem('gensti_token', data.token);
        onLoginSuccess(data.user);
      } else {
        if (!form.username || !form.password) {
          setError('Ingresa tu usuario y contraseña.');
          setLoading(false);
          return;
        }
        const data = await loginUser(form.username, form.password);
        localStorage.setItem('gensti_token', data.token);
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Credenciales no válidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#002755] to-sky-500"></div>

        <div className="text-center mb-6">
          
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-md flex items-center justify-center">
              <img 
                src={genstiLogo} 
                alt="GensTI" 
                className="h-12 w-auto object-contain rounded-lg"
              />
            </div>
            
            <div className="bg-white p-1.5 px-3 rounded-xl border border-gray-100 shadow-md flex items-center justify-center">
              <img 
                src={uccLogo} 
                alt="UCC" 
                className="h-11 w-auto object-contain"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#002755]">
            {isRegistering ? 'Crear Cuenta GENSTI' : 'Iniciar Sesión'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Plataforma Académica — Universidad Cooperativa de Colombia
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Nombre Completo *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre y Apellidos"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Usuario *</label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Nombre de usuario"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Correo Institucional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="usuario@campusucc.edu.co"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Contraseña *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#002755] hover:bg-[#003877] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md mt-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Procesando...' : isRegistering ? 'Crear Cuenta y Entrar' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-5 text-center border-t border-gray-100 pt-4">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="text-xs text-sky-600 font-bold hover:underline cursor-pointer"
          >
            {isRegistering ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}