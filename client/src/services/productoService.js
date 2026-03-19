import axios from 'axios';

// Cambia esta URL si tu backend corre en otro puerto
const API_URL = 'http://localhost:5000/api/productos';

const obtenerProductos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Puedes añadir más funciones como obtenerProductoPorId más adelante
export default {
  obtenerProductos,
};
