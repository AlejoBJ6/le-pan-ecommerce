import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary logic to bypass backend connection
    console.log("Login form submitted:", { email, password });
    // After successful login, redirect to home
    navigate('/');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    alert("Te hemos enviado un correo con instrucciones para recuperar tu contraseña.");
    setIsForgotPassword(false);
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
                
                <button type="submit" className="auth-btn" style={{ marginTop: '10px' }}>Enviar Instrucciones</button>
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
