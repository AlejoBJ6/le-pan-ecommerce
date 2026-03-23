import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../Login/Login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');
    setMensaje('');

    try {
      await authService.resetPassword(token, password);
      setMensaje('¡Contraseña restablecida exitosamente! Serás redirigido para iniciar sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left auth-left-login">
        <div className="auth-left-content">
          <h1>Lé Pan</h1>
          <p>Restablecimiento de contraseña seguro.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Crear Nueva Contraseña</h2>
            <p>Ingresa y confirma tu nueva contraseña fuerte.</p>
            {mensaje && <div style={{ color: 'green', marginTop: '10px', fontSize: '0.9rem', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px' }}>{mensaje}</div>}
            {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{error}</div>}
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="password">Nueva Contraseña</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            
            <button type="submit" className="auth-btn" style={{ marginTop: '10px' }} disabled={loading}>
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
