import axios from 'axios';

const API_URL = ''; // Se usa el proxy de Vite en desarrollo

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return { headers: { Authorization: `Bearer ${user.token}` } };
  }
  return {};
};

const categoriaService = {
  obtenerCategorias: async () => {
    const { data } = await axios.get(`${API_URL}/api/categorias`);
    return data;
  },

  crearCategoria: async (nombre) => {
    const { data } = await axios.post(
      `${API_URL}/api/categorias`,
      { nombre },
      getAuthHeaders()
    );
    return data;
  },

  eliminarCategoria: async (id) => {
    const { data } = await axios.delete(`${API_URL}/api/categorias/${id}`, getAuthHeaders());
    return data;
  },
};

export default categoriaService;
