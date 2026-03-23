import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const Perfil = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getUserProfile();
        setNombre(data.nombre);
        setEmail(data.email);
      } catch (err) {
        setError('Error al cargar datos del perfil');
      }
    };
    fetchProfile();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      await authService.updateUserProfile({ nombre, email, password });
      setMensaje('Perfil actualizado correctamente. Refresca la página si no ves tu nombre actualizado arriba.');
      setPassword('');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '60px 16px', minHeight: '60vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--color-white)', padding: '30px', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Mi Perfil</h2>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        </div>
        
        {mensaje && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px' }}>{mensaje}</div>}
        {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Cambiar Contraseña (opcional)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dejar en blanco para conservar actual" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }} />
          </div>
          <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '14px', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px', transition: 'background-color 0.3s' }}>
            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
          </button>
        </form>

        <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid var(--color-gray)' }}>
           <h3 style={{ color: 'var(--color-dark)', marginBottom: '15px' }}>Mis Órdenes</h3>
           <div style={{ padding: '20px', backgroundColor: 'var(--color-gray-light)', borderRadius: '4px', textAlign: 'center' }}>
             <p style={{ color: 'var(--color-gray)', margin: 0 }}>Aún no has realizado ninguna compra o el sistema de pagos no está activo.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
