
export const TIPOS_EVENTO = {
  Hackathon: 'bg-pink-100 text-pink-600',
  Taller: 'bg-amber-100 text-amber-700',
  Conferencia: 'bg-green-100 text-green-700',
  Otro: 'bg-sky-100 text-sky-700',
};

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// "2026-09-20" -> "20 Sep 2026"
export const formatFecha = (key) => {
  const [y, m, d] = key.split('-');
  return `${Number(d)} ${MESES_CORTOS[Number(m) - 1]} ${y}`;
};

// Las fechas siempre como "YYYY-MM-DD" y las horas como "HH:MM"
export const EVENTS_INICIALES = [
  {
    id: 1,
    title: 'HackathonUCC — Soluciones Sostenibles',
    type: 'Hackathon',
    date: '2026-09-20',
    start: '08:00',
    end: '20:00',
    place: 'Auditorio Principal, Sede Bogotá',
    spots: 12,
    description: 'Maratón de 12 horas para crear soluciones tecnológicas con impacto ambiental. Equipos de 3 a 5 personas.',
  },
  {
    id: 2,
    title: 'Taller: Docker y Kubernetes en Producción',
    type: 'Taller',
    date: '2026-09-24',
    start: '14:00',
    end: '17:00',
    place: 'Lab. de Redes, Piso 3',
    spots: 25,
    description: 'Taller práctico sobre contenedores y despliegue. Traer portátil con Docker instalado.',
  },
  {
    id: 3,
    title: 'Entrega de proyectos de semillero',
    type: 'Otro',
    date: '2026-09-30',
    start: '10:00',
    end: '12:00',
    place: 'Por definir',
    spots: 0,
    description: '',
  },
  {
    id: 4,
    title: 'Conferencia: El Futuro del Desarrollo Web',
    type: 'Conferencia',
    date: '2026-10-01',
    start: '10:00',
    end: '12:00',
    place: 'Sala de Conferencias 201',
    spots: 80,
    description: 'Charla sobre tendencias en frameworks, rendimiento y herramientas de IA para desarrolladores web.',
  },
];