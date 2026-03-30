import axios from 'axios';

// Cambia esta URL si tu backend corre en otro puerto
const API_URL = 'http://localhost:5000/api/productos';

const obtenerProductos = async (filtros = {}) => {
  const params = new URLSearchParams();
  
  if (filtros.nombre) params.append('nombre', filtros.nombre);
  if (filtros.categoria && filtros.categoria !== 'Todas') params.append('categoria', filtros.categoria);
  if (filtros.destacado) params.append('destacado', filtros.destacado);
  if (filtros.limit) params.append('limit', filtros.limit);
  if (filtros.eliminados) params.append('eliminados', filtros.eliminados);
  if (filtros.admin) params.append('admin', filtros.admin);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  const response = await axios.get(`${API_URL}${queryString}`);
  return response.data;
};

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

const obtenerProductoPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const crearProducto = async (productoData) => {
  const response = await axios.post(API_URL, productoData, getAuthHeaders());
  return response.data;
};

const actualizarProducto = async (id, productoData) => {
  const response = await axios.put(`${API_URL}/${id}`, productoData, getAuthHeaders());
  return response.data;
};

const eliminarProducto = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

const restaurarProducto = async (id) => {
  const response = await axios.put(`${API_URL}/${id}`, { eliminado: false, disponible: true }, getAuthHeaders());
  return response.data;
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const config = getAuthHeaders();
  config.headers['Content-Type'] = 'multipart/form-data';

  // Subir la imagen al endpoint principal de nuestro servidor
  const response = await axios.post('http://localhost:5000/api/upload', formData, config);
  return response.data;
};

export default {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restaurarProducto,
  uploadImage
};
