import React, { useState } from 'react';
import './Contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Acá iría la lógica para enviar el mail al backend
    console.log('Mensaje enviado:', formData);
    setEnviado(true);
    setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    
    // Ocultar el mensaje de éxito después de unos segundos
    setTimeout(() => {
      setEnviado(false);
    }, 5000);
  };

  return (
    <div className="contacto-page">
      <div className="contacto-hero-banner">
        <div className="contacto-hero-content">
          <h1>Contacto</h1>
          <p>Estamos acá para asesorarte. Escribinos ante cualquier duda sobre nuestros equipos.</p>
        </div>
      </div>

      <div className="container contacto-container">
        <div className="contacto-info-wrapper">
          <div className="contacto-info-card">
            <h2>Nuestra Ubicación</h2>
            <p className="info-item">
              <strong><span role="img" aria-label="pin">📍</span> Dirección:</strong> 
              Av. Corrientes 1234, CABA, Argentina
            </p>
            <p className="info-item">
              <strong><span role="img" aria-label="clock">⏰</span> Horarios:</strong> 
              Lunes a Viernes de 9:00 a 18:00 hs
            </p>
            <p className="info-item">
              <strong><span role="img" aria-label="phone">📞</span> Teléfono:</strong> 
              +54 11 1234 5678
            </p>
            <p className="info-item">
              <strong><span role="img" aria-label="mail">✉️</span> Email:</strong> 
              ventas@lepan.com.ar
            </p>
            
            <div className="map-container">
              {/* Mapa embebido genérico de Google Maps apuntando a CABA */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13136.066927954995!2d-58.39343729999999!3d-34.6037389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11be22d1c31fa2c2!2sBuenos%20Aires%2C%20CABA!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar" 
                width="100%" 
                height="250" 
                style={{ border: 0, borderRadius: '12px', marginTop: '20px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación LÉ PAN"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="contacto-form-wrapper">
          <h2 className="form-title">Envianos tu Consulta</h2>
          {enviado ? (
            <div className="mensaje-exito">
              ¡Gracias por tu mensaje! Nos pondremos en contacto a la brevedad.
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="asunto">Asunto</label>
                <input 
                  type="text" 
                  id="asunto" 
                  name="asunto" 
                  value={formData.asunto} 
                  onChange={handleChange} 
                  required 
                  placeholder="Consulta sobre Amasadoras"
                />
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Tu Mensaje</label>
                <textarea 
                  id="mensaje" 
                  name="mensaje" 
                  rows="5" 
                  value={formData.mensaje} 
                  onChange={handleChange} 
                  required 
                  placeholder="Escribí aquí tus dudas..."
                ></textarea>
              </div>
              <button type="submit" className="btn-enviar">Enviar Mensaje</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacto;
