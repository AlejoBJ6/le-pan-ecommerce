import axios from 'axios';

const API_URL = '/api/combos';

const obtenerCombos = async (admin = false) => {
  const url = admin ? `${API_URL}?admin=true` : API_URL;
  const response = await axios.get(url);
  return response.data;
};

const obtenerCombosDestacados = async () => {
  const response = await axios.get(`${API_URL}?destacado=true`);
  return response.data;
};

const obtenerComboPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const crearCombo = async (comboData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, comboData, config);
  return response.data;
};

const actualizarCombo = async (id, comboData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${id}`, comboData, config);
  return response.data;
};

const eliminarCombo = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

const comboService = {
  obtenerCombos,
  obtenerCombosDestacados,
  obtenerComboPorId,
  crearCombo,
  actualizarCombo,
  eliminarCombo,
};

export default comboService;
