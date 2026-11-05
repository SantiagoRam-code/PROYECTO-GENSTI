import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';

export default function ChatbotWidget() {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: '¡Hola! Soy GENSTI AI, tu tutor e ingeniero virtual de Sistemas en la UCC. 🚀 ¿En qué te puedo colaborar hoy?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const suggestions = [
    "¿En qué puede trabajar un egresado?",
    "¿Cuándo finalizan las clases?",
    "¿Qué herramientas se usan en GENSTI?",
    "¿Cómo registro una solicitud PQRS?"
  ];

  // Desplazamiento interno controlado (sin mover la ventana principal del navegador)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`Respuesta del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev, 
        { sender: 'bot', text: data.reply || 'No fue posible obtener una respuesta adecuada.' }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: 'No se pudo establecer conexión con el servidor. Por favor verifica que el servidor de Django se encuentre activo.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-[520px] overflow-hidden transition-colors">
      
      {/* HEADER DEL CHATBOT */}
      <div className="bg-gradient-to-r from-[#002755] to-sky-700 text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <Bot size={20} className="text-sky-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              GENSTI AI Assistant <Sparkles size={13} className="text-amber-300 animate-pulse" />
            </h3>
            <p className="text-[10px] text-blue-200">Tutor e Ingeniero Virtual UCC</p>
          </div>
        </div>
      </div>

      {/* HISTORIAL DE MENSAJES (scrolls internamente) */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 dark:bg-gray-900/40"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-sky-600 text-white' 
                : 'bg-[#002755] text-sky-300'
            }`}>
              {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>

            <div className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-sm ${
              msg.sender === 'user'
                ? 'bg-sky-600 text-white rounded-tr-none'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium italic p-1">
            <Bot size={14} className="animate-spin text-sky-500" />
            GENSTI AI está analizando tu consulta...
          </div>
        )}
      </div>

      {/* CHIPS DE SUGERENCIA RÁPIDA */}
      <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 overflow-x-auto flex gap-1.5 no-scrollbar">
        {suggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            disabled={loading}
            className="text-[10px] font-semibold bg-sky-50 dark:bg-gray-700 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-full border border-sky-100 dark:border-gray-600 hover:bg-sky-100 dark:hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* CAJA DE ENTRADA */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta sobre materias, salidas laborales o GENSTI..."
          className="flex-1 text-xs border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#002755] hover:bg-sky-900 text-white p-2 px-3.5 rounded-xl transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-sm"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}