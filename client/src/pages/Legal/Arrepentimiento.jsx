import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaSpinner } from 'react-icons/fa';
import './LegalPage.css';

const Arrepentimiento = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pedido, setPedido] = useState('');
  const [motivo, setMotivo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Arma el link con los datos y abre WhatsApp como canal de contacto
    const msg = encodeURIComponent(
      `*Solicitud de Arrepentimiento — Lé Pan*\n\nNombre: ${nombre}\nEmail: ${email}\nNúmero de pedido: ${pedido}\nMotivo: ${motivo}`
    );
    const whatsapp = `https://wa.me/5491100000000?text=${msg}`;
    
    // Simulamos un breve retraso para mejorar el feedback visual de UX
    setTimeout(() => {
      window.open(whatsapp, '_blank');
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="legal-page">
      <div className="legal-container" style={{ maxWidth: '680px' }}>
        <div className="legal-header">
          <h1>Botón de Arrepentimiento</h1>
          <p className="legal-subtitle">
            Resolución N° 424/2020 — Secretaría de Comercio Interior
          </p>
        </div>

        <div className="legal-highlight-box" style={{ marginBottom: '36px' }}>
          <p style={{ 
            fontWeight: 700, 
            fontSize: '1.05rem', 
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-primary, #E8820C)'
          }}>
            <FaShieldAlt /> Tu derecho está garantizado
          </p>
          <p>
            Tenés <strong>10 días corridos</strong> desde que recibiste el producto para arrepentirte de
            tu compra, <strong>sin necesidad de dar explicaciones y sin ningún costo</strong>, de acuerdo
            a la <strong>Ley 24.240 de Defensa del Consumidor</strong>.
          </p>
        </div>

        {submitted ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: 'linear-gradient(135deg, #e8f5e9, #f0f9f0)',
            borderRadius: '16px',
            border: '1px solid #a5d6a7'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#2e7d32', marginBottom: '12px' }}>¡Solicitud enviada!</h2>
            <p style={{ color: '#444', lineHeight: '1.7' }}>
              Tu solicitud de arrepentimiento fue registrada. Procesaremos tu pedido en un plazo máximo de{' '}
              <strong>10 días hábiles</strong>. Recibirás el reembolso en el mismo medio de pago que
              utilizaste para tu compra.
            </p>
            <p style={{ marginTop: '16px', color: '#555', fontSize: '0.9rem' }}>
              ¿Preguntas? Escribinos a{' '}
              <a href="mailto:contacto@le-pan.com.ar" style={{ color: 'var(--color-primary)' }}>
                contacto@le-pan.com.ar
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, color: 'var(--color-dark)' }}>Nombre completo *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Juan Pérez"
                style={inputStyle}
                disabled={loading}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, color: 'var(--color-dark)' }}>Correo electrónico *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="juan@correo.com"
                style={inputStyle}
                disabled={loading}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, color: 'var(--color-dark)' }}>Número de pedido *</label>
              <input
                type="text"
                required
                value={pedido}
                onChange={e => setPedido(e.target.value)}
                placeholder="Ej: A1B2C3"
                style={inputStyle}
                disabled={loading}
              />
              <small style={{ color: '#888' }}>
                Lo encontrás en el correo de confirmación o en{' '}
                <Link to="/consultar-pedido" style={{ color: 'var(--color-primary)' }}>Consultar Pedido</Link>.
              </small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                Motivo (opcional)
              </label>
              <textarea
                rows={4}
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Podés dejarlo en blanco — no es obligatorio expresar un motivo."
                style={{ ...inputStyle, resize: 'vertical' }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '16px',
                background: loading ? '#ccc' : 'var(--color-primary, #E8820C)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.3px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" /> Procesando...
                </>
              ) : (
                'Enviar solicitud de arrepentimiento'
              )}
            </button>

            <p style={{ fontSize: '0.82rem', color: '#888', textAlign: 'center', lineHeight: '1.6' }}>
              Al enviar, serás redirigido a WhatsApp para confirmar tu solicitud con nuestro equipo.
              También podés escribirnos directamente a{' '}
              <a href="mailto:contacto@le-pan.com.ar" style={{ color: 'var(--color-primary)' }}>
                contacto@le-pan.com.ar
              </a>.
            </p>
          </form>
        )}

        <div className="legal-section" style={{ marginTop: '48px' }}>
          <h2>¿Cómo funciona el proceso?</h2>
          <ul>
            <li>Completá el formulario de arriba o contactanos directamente.</li>
            <li>Nuestro equipo confirmará la recepción de tu solicitud dentro de las <strong>48 horas hábiles</strong>.</li>
            <li>Coordinaremos la devolución del producto sin costo para vos.</li>
            <li>El reembolso se procesará dentro de los <strong>10 días hábiles</strong> siguientes, en el mismo medio de pago utilizado.</li>
          </ul>
        </div>

        <div className="legal-contact-box">
          <h3>Defensa del Consumidor</h3>
          <p>
            Si no obtenés respuesta, podés radicar tu reclamo en la{' '}
            <a
              href="https://www.argentina.gob.ar/produccion/defensadelconsumidor"
              target="_blank"
              rel="noreferrer"
            >
              Dirección Nacional de Defensa del Consumidor ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '0.97rem',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  outline: 'none',
  background: 'var(--color-bg, #fff)',
  color: 'var(--color-dark, #1a1a1a)',
};

export default Arrepentimiento;
