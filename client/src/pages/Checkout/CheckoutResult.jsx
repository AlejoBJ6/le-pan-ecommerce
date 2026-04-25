import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepIndicator from '../../components/StepIndicator/StepIndicator.jsx';
import pedidoService from '../../services/pedidoService.js';
import { LuSearch } from 'react-icons/lu';
import './Checkout.css'; // Usamos los mismos estilos del checkout general

const CheckoutResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const status = location.pathname.includes('success') ? 'success' : 
                 location.pathname.includes('failure') ? 'failure' : 'pending';
                 
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');

  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // Failsafe para desarrollo local o bloqueos de Ngrok/Localtunnel:
  useEffect(() => {
    if (status === 'success' && paymentId) {
      pedidoService.forceWebhookVerify(paymentId)
        .catch(err => console.log('Silencioso: Webhook failsafe ya se ejecutó u ocurrió error', err));
    }
  }, [status, paymentId]);

  // Recuperar detalles de la orden para mostrar el botón de WhatsApp
  useEffect(() => {
    if (status === 'success') {
      const localOrderId = localStorage.getItem('lepan_guest_last_order_id');
      const localEmail = localStorage.getItem('lepan_guest_last_email');
      
      const targetId = orderId || localOrderId;
      if (targetId && localEmail) {
        setLoadingOrder(true);
        pedidoService.trackPedido(targetId, localEmail)
          .then(data => {
            setOrderData(data);
          })
          .catch(err => console.log('No se pudieron recuperar los detalles de la orden localmente', err))
          .finally(() => setLoadingOrder(false));
      }
    }
  }, [status, orderId]);

  // ── WhatsApp message builder ─────────────────────────────
  const buildWhatsAppLink = () => {
    if (!orderData) return '#';
    const OWNER_WHATSAPP_NUMBER = '5491100000000';
    const entrega = orderData.datosEntrega || {};
    const total = orderData.totales?.total || 0;
    const orderNum = orderData._id ? orderData._id.slice(-6).toUpperCase() : (orderId || '');

    const items = orderData.pedidosData
      ?.map(i => `  • ${i.nombre} x${i.cantidad} — ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((i.precio || i.precioFinal || 0) * i.cantidad)}`)
      .join('%0A') || '';

    const dir = `${entrega.direccion}${entrega.piso ? `, ${entrega.piso}` : ''}, ${entrega.ciudad}, ${entrega.provincia} (CP ${entrega.cp})`;

    const msg = [
      `¡Hola! 👋 Soy *${entrega.nombre} ${entrega.apellido}* y acabo de hacer un pedido en *Lé Pan*.`,
      ``,
      `📋 *Pedido #${orderNum}*`,
      `${items}`,
      ``,
      `💰 *Total pagado (MP):* ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(total)}`,
      `📍 *Dirección:* ${dir}`,
      ``,
      `Me gustaría coordinar la entrega. ¡Gracias!`,
    ].join('%0A');

    return `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${msg}`;
  };

  const entrega = orderData?.datosEntrega || {};
  const orderNum = orderData?._id ? orderData._id.slice(-6).toUpperCase() : (orderId || '');

  return (
    <div className="checkout-page">
      <StepIndicator currentStep="resumen" />
      <div className="checkout-container container">
        <div className="checkout-step resumen-step">
          
          {status === 'success' && orderData && !loadingOrder ? (
            // VISTA ENRIQUECIDA CON DATOS DE ORDEN (Idéntica a Transferencia)
            <div className="success-animation">
              <div className="success-circle">
                <svg viewBox="0 0 52 52" className="checkmark-svg">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#25D366" strokeWidth="2" className="checkmark-circle" />
                  <path fill="none" stroke="#25D366" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 26 l8 8 l16-16" className="checkmark-check" />
                </svg>
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--color-dark)' }}>¡Gracias por tu compra, {entrega.nombre}! 🎉</h2>
              <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '8px' }}>
                Tu pago a través de Mercado Pago fue procesado con éxito.
              </p>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '24px' }}>
                📲 Te contactaremos por WhatsApp para coordinar la entrega.
              </p>
              
              <div className="order-summary-badge" style={{ 
                backgroundColor: 'white', border: '1px dashed var(--color-gold)', borderRadius: '12px', 
                padding: '16px', marginBottom: '24px', display: 'inline-block', minWidth: '200px'
              }}>
                <p className="order-number" style={{ margin: 0, fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Número de operación</p>
                <strong style={{ fontSize: '1.8rem', color: 'var(--color-primary)', display: 'block', marginTop: '4px' }}>#{orderNum}</strong>
                {paymentId && <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '8px' }}>Ref MP: {paymentId}</p>}
              </div>

              {entrega.email && (
                <p className="order-email" style={{ marginBottom: '24px' }}>
                  Recibirás el detalle de tu compra en <strong>{entrega.email}</strong>
                </p>
              )}
              
              {!localStorage.getItem('user') && (
                <div style={{ 
                  marginBottom: '25px', padding: '12px 16px', backgroundColor: 'var(--color-bg, #fffbf2)', 
                  border: '1px solid #f5c89a', borderRadius: '10px', fontSize: '0.88rem', color: '#856404',
                  display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left'
                }}>
                  <LuSearch size={22} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
                  <span>
                    <strong>¿Necesitas volver más tarde?</strong> Guardá tu número de pedido. Podés consultar el estado desde la sección <strong>Consultar Pedido</strong> en el pie de la página o directamente desde el carrito.
                  </span>
                </div>
              )}

              <div className="resumen-actions" style={{ marginTop: '20px' }}>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    backgroundColor: '#25D366', color: 'white', padding: '14px 24px',
                    borderRadius: '10px', fontWeight: '700', fontSize: '1rem',
                    textDecoration: 'none', width: '100%', boxSizing: 'border-box',
                    boxShadow: '0 4px 14px rgba(37,211,102,0.35)', transition: 'all 0.2s',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.057 23.571a.5.5 0 0 0 .615.612l5.832-1.53A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.766 9.766 0 0 1-4.983-1.362l-.357-.214-3.706.972.99-3.614-.234-.371A9.78 9.78 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                  </svg>
                  Coordinar entrega por WhatsApp
                </a>
                {localStorage.getItem('user') && (
                  <button className="btn-resumen-secondary" onClick={() => navigate('/perfil')}>
                    Ver mis pedidos
                  </button>
                )}
                <button className="btn-resumen-primary" onClick={() => navigate('/productos')}>
                  Seguir comprando
                </button>
              </div>
            </div>
          ) : status === 'success' ? (
            // VISTA FALLBACK SI NO CARGAN LOS DATOS A TIEMPO
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
              <div className="resumen-actions" style={{ marginTop: '40px' }}>
                <button className="btn-resumen-secondary" onClick={() => navigate('/perfil')}>Ver mis pedidos</button>
                <button className="btn-resumen-primary" onClick={() => navigate('/productos')}>Seguir comprando</button>
              </div>
            </div>
          ) : null}
          
          {status === 'failure' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
              <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>El pago no se pudo procesar</h2>
              <p style={{ color: '#555', fontSize: '1.1rem' }}>Hubo un problema con la tarjeta o el medio de pago. Por favor intenta de nuevo.</p>
              <div className="resumen-actions" style={{ marginTop: '40px' }}>
                <button className="btn-resumen-secondary" onClick={() => navigate('/perfil')}>Ver mis pedidos</button>
                <button className="btn-resumen-primary" onClick={() => navigate('/productos')}>Seguir comprando</button>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
              <h2 style={{ color: '#f57c00', marginBottom: '15px' }}>Pago Pendiente / En proceso</h2>
              <p style={{ color: '#555', fontSize: '1.1rem' }}>Si pagaste por un medio en efectivo (como Rapipago o Pago Fácil), recordá que puede demorar unas horas en acreditarse.</p>
              {orderId && <p className="order-number" style={{marginTop: '15px'}}>Identificador del pedido: <strong>#{orderId.slice(-6).toUpperCase()}</strong></p>}
              <div className="resumen-actions" style={{ marginTop: '40px' }}>
                <button className="btn-resumen-secondary" onClick={() => navigate('/perfil')}>Ver mis pedidos</button>
                <button className="btn-resumen-primary" onClick={() => navigate('/productos')}>Seguir comprando</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutResult;
