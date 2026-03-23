import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../Login/Login.css'; // Reusing the same auth styles

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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
