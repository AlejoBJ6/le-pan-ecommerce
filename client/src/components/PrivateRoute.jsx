import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Cargando...</div>;
  }

  // Verifica si hay usuario (de cualquier rol)
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
