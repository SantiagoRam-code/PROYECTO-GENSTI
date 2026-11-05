const API_BASE_URL = 'http://127.0.0.1:8000/api/';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data;
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al registrar usuario');
    return data;
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
};