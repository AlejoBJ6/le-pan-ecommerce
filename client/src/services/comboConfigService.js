import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return { headers: { Authorization: `Bearer ${user.token}` } };
  }
  return {};
};

const comboConfigService = {
  obtenerConfig: async () => {
    const { data } = await axios.get(`${API_URL}/api/combo-config`);
    return data;
  },

  actualizarConfig: async (configData) => {
    const { data } = await axios.put(`${API_URL}/api/combo-config`, configData, getAuthHeaders());
    return data;
  },
};

export default comboConfigService;
