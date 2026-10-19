import React from 'react';
import { Bot, Send } from 'lucide-react';

export default function ChatbotWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-[#003877] p-4 flex items-center gap-3 text-white">
        <div className="bg-white/20 p-2 rounded-lg"><Bot size={20} /></div>
        <div>
          <h3 className="font-bold text-sm">Asistente Virtual GENSTI IA</h3>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> En línea - Responde al instante
          </p>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col bg-gray-50/30">
        <div className="flex gap-3 mb-4">
          <div className="w-7 h-7 bg-[#002755] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">
            <Bot size={14} />
          </div>
          <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-xs text-gray-700 leading-relaxed">
            ¡Hola! Soy el Asistente Virtual de GENSTI. Puedo ayudarte con información sobre horarios, pensum académico, eventos, trámites y más. ¿En qué te puedo ayudar hoy?
            <p className="text-[9px] text-gray-400 mt-2">09:00</p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex gap-2 flex-wrap mb-3">
            {["Horarios", "Pensum", "Eventos", "Matrícula"].map(btn => (
              <button key={btn} className="text-[10px] text-sky-600 border border-sky-200 bg-white px-3 py-1.5 rounded-full hover:bg-sky-50 font-medium transition-colors">
                {btn}
              </button>
            ))}
          </div>
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Escribe tu pregunta..." 
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-sky-400 bg-white"
            />
            <button className="absolute right-2 bg-gray-400 text-white p-1.5 rounded-lg hover:bg-sky-500 transition-colors">
              <Send size={14} />
            </button>
          </div>
          <p className="text-center text-[9px] text-gray-400 mt-3">Powered by IA · GENSTI © 2026 - UCC</p>
        </div>
      </div>
    </div>
  );
}