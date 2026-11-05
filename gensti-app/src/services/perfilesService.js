const API_BASE_URL = 'http://127.0.0.1:8000/api/';

export const getPerfiles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}perfiles/`);
    if (!response.ok) throw new Error('Error al obtener perfiles');
    return await response.json();
  } catch (error) {
    console.error('Error en getPerfiles:', error);
    return [];
  }
};