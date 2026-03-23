import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useContext(AuthContext);

  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [loadingForgot, setLoadingForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoadingForgot(true);
    setForgotMessage('');
    setForgotError('');
    try {
      const data = await authService.forgotPassword(email);
      setForgotMessage(data.message);
      setLoadingForgot(false);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Error al solicitar el borrado de clave');
      setLoadingForgot(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left auth-left-login">
        <div className="auth-left-content">
          <h1>Bienvenido a Lé Pan</h1>
          <p>La mejor calidad en equipamiento para panaderías.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrapper">
          {isForgotPassword ? (
            <>
              <div className="auth-header">
                <h2>Recuperar Contraseña</h2>
                <p>Ingresa tu correo asociado y te enviaremos instrucciones.</p>
                {forgotMessage && <div style={{ color: 'green', marginTop: '10px', fontSize: '0.9rem', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px' }}>{forgotMessage}</div>}
                {forgotError && <div style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{forgotError}</div>}
              </div>
              
              <form className="auth-form" onSubmit={handleForgotSubmit}>
                <div className="input-group">
                  <label htmlFor="reset-email">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="reset-email" 
                    placeholder="ejemplo@correo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button type="submit" className="auth-btn" style={{ marginTop: '10px' }} disabled={loadingForgot}>
                  {loadingForgot ? 'Enviando...' : 'Enviar Instrucciones'}
                </button>
                <button 
                  type="button" 
                  className="auth-btn" 
                  style={{ backgroundColor: 'transparent', color: 'var(--color-dark)', border: '1.5px solid var(--color-gray-light)', boxShadow: 'none' }} 
                  onClick={() => setIsForgotPassword(false)}
                >
                  Volver al inicio de sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="auth-header">
                <h2>Iniciar Sesión</h2>
                <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
                {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>{error}</div>}
              </div>
              
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="ejemplo@correo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Contraseña</label>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <button 
                      type="button" 
                      className="forgot-password" 
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }} 
                      onClick={() => setIsForgotPassword(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
                
                <button type="submit" className="auth-btn">Ingresar</button>
                <button type="button" className="auth-btn btn-google">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="google-icon" />
                  Ingresar con Google
                </button>
              </form>
              
              <div className="auth-footer">
                <p>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
