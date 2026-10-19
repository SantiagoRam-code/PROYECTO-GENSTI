const API_BASE_URL = 'http://127.0.0.1:8000/api/eventos/';

export const getEventos = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Error al obtener eventos');
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error('Error en getEventos:', error);
    throw error;
  }
};

export const crearEvento = async (eventoData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventoData),
    });
    if (!response.ok) throw new Error('Error al crear evento');
    return await response.json();
  } catch (error) {
    console.error('Error en crearEvento:', error);
    throw error;
  }
};

export const actualizarEvento = async (id, eventoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventoData),
    });
    if (!response.ok) throw new Error('Error al actualizar evento');
    return await response.json();
  } catch (error) {
    console.error('Error en actualizarEvento:', error);
    throw error;
  }
};

export const eliminarEvento = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar evento');
    return true;
  } catch (error) {
    console.error('Error en eliminarEvento:', error);
    throw error;
  }
};