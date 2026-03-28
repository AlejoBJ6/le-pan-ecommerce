import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Obtener headers de auth
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

// Registrar usuario
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  // Prevent auto-login on registration
  
  return response.data;
};

// Login de usuario
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('user');
};

const getUserProfile = async () => {
  const response = await axios.get(API_URL + 'profile', getAuthHeaders());
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(API_URL + 'profile', userData, getAuthHeaders());
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await axios.post(API_URL + 'forgotpassword', { email });
  return response.data;
};

const resetPassword = async (token, password) => {
  // Petición pública. No requiere getAuthHeaders.
  const response = await axios.put(API_URL + `resetpassword/${token}`, { password });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
};

export default authService;
