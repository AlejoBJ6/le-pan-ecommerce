import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comprobar si hay usuario en localStorage al cargar la app
  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const data = await authService.login(userData);
      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
