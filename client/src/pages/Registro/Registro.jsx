import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../Login/Login.css'; // Reusing the same auth styles

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register, error, setError } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });
      navigate('/'); // Redirect to home or dashboard after successful registration
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left auth-left-register">
        <div className="auth-left-content">
          <h1>Únete a Lé Pan</h1>
          <p>Crea tu cuenta y descubre ofertas exclusivas en nuestro catálogo.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Crear Cuenta</h2>
            <p>Completa tus datos para registrarte.</p>
            {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>{error}</div>}
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input 
                type="text" 
                id="nombre" 
                placeholder="Juan Pérez" 
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                placeholder="ejemplo@correo.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className="password-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="auth-btn">Registrarse</button>
            <button type="button" className="auth-btn btn-google">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="google-icon" />
              Registrarse con Google
            </button>
          </form>
          
          <div className="auth-footer">
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
