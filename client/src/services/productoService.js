import axios from 'axios';

// Cambia esta URL si tu backend corre en otro puerto
const API_URL = 'http://localhost:5000/api/productos';

const obtenerProductos = async (filtros = {}) => {
  const params = new URLSearchParams();
  
  if (filtros.nombre) params.append('nombre', filtros.nombre);
  if (filtros.categoria && filtros.categoria !== 'Todas') params.append('categoria', filtros.categoria);
  if (filtros.destacado) params.append('destacado', filtros.destacado);
  if (filtros.limit) params.append('limit', filtros.limit);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  const response = await axios.get(`${API_URL}${queryString}`);
  return response.data;
};

// Puedes añadir más funciones como obtenerProductoPorId más adelante
export default {
  obtenerProductos,
};
