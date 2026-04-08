import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepIndicator from '../../components/StepIndicator/StepIndicator.jsx';
import pedidoService from '../../services/pedidoService.js';
import './Checkout.css'; // Usamos los mismos estilos del checkout general

const CheckoutResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const status = location.pathname.includes('success') ? 'success' : 
                 location.pathname.includes('failure') ? 'failure' : 'pending';
                 
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('payment_id');

  // Failsafe para desarrollo local o bloqueos de Ngrok/Localtunnel:
  // Si volvemos a esta pantalla con éxito, forzamos manualmente a nuestro backend 
  // a revisar este pago simulando que llegó el Webhook.
  useEffect(() => {
    if (status === 'success' && paymentId) {
      pedidoService.forceWebhookVerify(paymentId)
        .catch(err => console.log('Silencioso: Webhook failsafe ya se ejecutó u ocurrió error', err));
    }
  }, [status, paymentId]);

  return (
    <div className="checkout-page">
      <StepIndicator currentStep="resumen" />
      <div className="checkout-container container">
        <div className="checkout-step resumen-step">
          
          {status === 'success' && (
            <div className="success-animation">
              <div className="success-circle">
                <svg viewBox="0 0 52 52" className="checkmark-svg">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#00a650" strokeWidth="2" className="checkmark-circle" />
                  <path fill="none" stroke="#00a650" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 26 l8 8 l16-16" className="checkmark-check" />
                </svg>
              </div>
              <h2 style={{color: '#00a650'}}>¡Pago Aprobado!</h2>
              {orderId && <p className="order-number">Identificador del pedido: <strong>#{orderId.slice(-6).toUpperCase()}</strong></p>}
              {paymentId && <p className="order-email">Nro de transacción de Mercado Pago: <strong>{paymentId}</strong></p>}
            </div>
          )}
          
          {status === 'failure' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
              <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>El pago no se pudo procesar</h2>
              <p style={{ color: '#555', fontSize: '1.1rem' }}>Hubo un problema con la tarjeta o el medio de pago. Por favor intenta de nuevo.</p>
            </div>
          )}

          {status === 'pending' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
              <h2 style={{ color: '#f57c00', marginBottom: '15px' }}>Pago Pendiente / En proceso</h2>
              <p style={{ color: '#555', fontSize: '1.1rem' }}>Si pagaste por un medio en efectivo (como Rapipago o Pago Fácil), recordá que puede demorar unas horas en acreditarse.</p>
              {orderId && <p className="order-number" style={{marginTop: '15px'}}>Identificador del pedido: <strong>#{orderId.slice(-6).toUpperCase()}</strong></p>}
            </div>
          )}

          <div className="resumen-actions" style={{ marginTop: '40px' }}>
            <button className="btn-resumen-secondary" onClick={() => navigate('/perfil')}>
              Ver mis pedidos
            </button>
            <button className="btn-resumen-primary" onClick={() => navigate('/productos')}>
              Seguir comprando
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutResult;
