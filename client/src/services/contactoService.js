import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contacto';

// Helper de autenticación
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
  }
  return {};
};

const enviarMensaje = async (mensajeData) => {
  const response = await axios.post(API_URL, mensajeData);
  return response.data;
};

const obtenerMensajes = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const marcarComoLeido = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/leido`, {}, getAuthHeaders());
  return response.data;
};

const eliminarMensaje = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export default {
  enviarMensaje,
  obtenerMensajes,
  marcarComoLeido,
  eliminarMensaje
};
