import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#001e40] text-blue-200 mt-8 py-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center text-[#001e40] text-[10px]">UCC</div>
              GENSTI · UCC
            </div>
            <p className="text-[11px] text-blue-300/80 leading-relaxed pr-6">
              Programa de Ingeniería de Sistemas de la Universidad Cooperativa de Colombia. Formando líderes tecnológicos desde 1958.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs mb-4">Accesos Rápidos</h4>
            <ul className="space-y-2.5 text-[11px] text-blue-300/80">
              <li><a href="#" className="hover:text-white transition-colors">Portal Académico</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Biblioteca Virtual</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Correo Institucional</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Aula Virtual</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs mb-4">Contacto</h4>
            <ul className="space-y-2.5 text-[11px] text-blue-300/80">
              <li>gensti@ucc.edu.co</li>
              <li>+57 (601) 123-4567</li>
              <li>Calle 10 #No. 1 - 64, Centro, Ibague, Tolima.</li>
              <li className="pt-2"><span className="bg-white/10 px-2.5 py-1 rounded-md text-[10px] text-blue-200">Lun-Vie 7:00-19:00</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] text-blue-300/60">
          <p>© 2026 Universidad Cooperativa de Colombia - Todos los derechos reservados</p>
          <p className="font-mono">Plataforma GENSTI</p>
        </div>
      </div>
    </footer>
  );
}