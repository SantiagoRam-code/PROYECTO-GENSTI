const API_BASE_URL = 'http://127.0.0.1:8000/api/noticias/';

export const getNoticias = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Error al obtener noticias');
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error('Error en getNoticias:', error);
    throw error;
  }
};

export const crearNoticia = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData, // FormData establece el header multipart automáticamente
    });
    if (!response.ok) throw new Error('Error al crear noticia');
    return await response.json();
  } catch (error) {
    console.error('Error en crearNoticia:', error);
    throw error;
  }
};

export const actualizarNoticia = async (id, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${id}/`, {
      method: 'PATCH',
      body: formData,
    });
    if (!response.ok) throw new Error('Error al actualizar noticia');
    return await response.json();
  } catch (error) {
    console.error('Error en actualizarNoticia:', error);
    throw error;
  }
};

export const eliminarNoticia = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar noticia');
    return true;
  } catch (error) {
    console.error('Error en eliminarNoticia:', error);
    throw error;
  }
};