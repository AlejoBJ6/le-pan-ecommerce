import React, { useState } from 'react';
import contactoService from '../../services/contactoService';
import './Contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [estado, setEstado] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ loading: true, success: false, error: null });
    
    try {
      await contactoService.enviarMensaje(formData);
      setEstado({ loading: false, success: true, error: null });
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      
      // Ocultar el mensaje de éxito después de unos segundos
      setTimeout(() => {
        setEstado(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      setEstado({ loading: false, success: false, error: 'Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.' });
    }
  };

  return (
    <div className="contacto-page">
      <div className="contacto-hero-banner">
        <div className="contacto-hero-content">
          <h1>Contacto</h1>
          <p>Estamos acá para asesorarte. Dejanos tu consulta y te responderemos a la brevedad.</p>
        </div>
      </div>

      <div className="container contacto-container" style={{ justifyContent: 'center' }}>
        <div className="contacto-form-wrapper" style={{ maxWidth: '700px', flex: 'none', width: '100%' }}>
          <h2 className="form-title" style={{ textAlign: 'center' }}>Envíanos tu Mensaje</h2>
          
          {estado.error && (
            <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              {estado.error}
            </div>
          )}

          {estado.success ? (
            <div className="mensaje-exito">
              ¡Gracias por tu mensaje! Lo recibimos correctamente y te estaremos respondiendo a la brevedad a tu correo.
            </div>
          ) : (
            <form className="contacto-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ej: Juan Pérez"
                  disabled={estado.loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="ejemplo@correo.com"
                  disabled={estado.loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="asunto">Asunto (Opcional)</label>
                <input 
                  type="text" 
                  id="asunto" 
                  name="asunto" 
                  value={formData.asunto} 
                  onChange={handleChange} 
                  placeholder="Consulta sobre Hornos"
                  disabled={estado.loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Tu Mensaje</label>
                <textarea 
                  id="mensaje" 
                  name="mensaje" 
                  rows="6" 
                  value={formData.mensaje} 
                  onChange={handleChange} 
                  required 
                  placeholder="Escribí aquí tus dudas..."
                  disabled={estado.loading}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn-enviar" 
                style={{ opacity: estado.loading ? 0.7 : 1, cursor: estado.loading ? 'wait' : 'pointer' }}
                disabled={estado.loading}
              >
                {estado.loading ? 'Enviando...' : 'Enviar Consulta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacto;
