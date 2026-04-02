import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import StepIndicator from '../../components/StepIndicator/StepIndicator.jsx';
import pedidoService from '../../services/pedidoService.js';
import { LuChevronRight, LuChevronLeft, LuShieldCheck, LuPhone, LuTruck, LuCreditCard, LuBuilding2, LuPackage, LuNotebook } from 'react-icons/lu';
import './Checkout.css';

const MP_GREEN = '#00a650';

/* ─── STEP 1: Entrega ───────────────────────────────────── */
const StepEntrega = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="checkout-step">
      <h2 className="checkout-step-title">Datos de entrega</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nombre *</label>
            <input type="text" placeholder="Juan" value={data.nombre} onChange={e => onChange('nombre', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))} required />
          </div>
          <div className="form-group">
            <label>Apellido *</label>
            <input type="text" placeholder="Pérez" value={data.apellido} onChange={e => onChange('apellido', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input type="email" placeholder="juan@correo.com" value={data.email} onChange={e => onChange('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Teléfono *</label>
            <input type="tel" placeholder="11 1234-5678" value={data.telefono} onChange={e => onChange('telefono', e.target.value.replace(/[^0-9+\-\s()]/g, ''))} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Provincia *</label>
            <select value={data.provincia} onChange={e => onChange('provincia', e.target.value)} required>
              <option value="">Seleccioná tu provincia</option>
              {['Buenos Aires', 'Capital Federal (CABA)', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Ciudad *</label>
            <input type="text" placeholder="Buenos Aires" value={data.ciudad} onChange={e => onChange('ciudad', e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]/g, ''))} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group flex-2">
            <label>Dirección *</label>
            <input type="text" placeholder="Av. Corrientes 1234" value={data.direccion} onChange={e => onChange('direccion', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Piso / Depto</label>
            <input type="text" placeholder="3B" maxLength="6" value={data.piso} onChange={e => onChange('piso', e.target.value.trim().toUpperCase())} />
          </div>
          <div className="form-group">
            <label>Código Postal *</label>
            <input type="text" placeholder="1000" maxLength="5" value={data.cp} onChange={e => onChange('cp', e.target.value.replace(/[^0-9]/g, ''))} required />
          </div>
        </div>
        <div className="form-group">
          <label>Notas adicionales</label>
          <textarea placeholder="Instrucciones especiales para la entrega..." value={data.notas} onChange={e => onChange('notas', e.target.value)} rows="2" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn-checkout-next" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
            Continuar al pago <LuChevronRight size={20} />
          </button>
          <button type="button" className="btn-checkout-back" onClick={onBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
            <LuChevronLeft size={18} /> Volver
          </button>
        </div>
      </form>
    </div>
  );
};

/* ─── STEP 2: Pago ──────────────────────────────────────── */
const StepPago = ({ cart, getCartTotal, onNext, onBack, loading }) => {
  const [metodo, setMetodo] = useState('mercado_pago');

  const subtotal = getCartTotal();
  const envio = 0; // Envío siempre gratis según requerimiento del cliente
  const total = subtotal + envio;

  const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="checkout-step">
      <h2 className="checkout-step-title">Método de pago</h2>

      {/* MP Logo banner removido por sugerencia de UI */}

      {/* Method Tabs */}
      <div className="payment-method-tabs">
        {[
          { key: 'mercado_pago', label: 'Mercado Pago', icon: <LuCreditCard size={20} /> },
          { key: 'transferencia', label: 'Transferencia Bancaria', icon: <LuBuilding2 size={20} /> },
        ].map(m => (
          <button
            key={m.key}
            className={`method-tab ${metodo === m.key ? 'active' : ''}`}
            onClick={() => setMetodo(m.key)}
          >
            <span className="method-icon">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {metodo === 'mercado_pago' && (
        <div className="mp-info-box">
          <p className="mp-info-text">
            Serás redirigido de forma segura a Mercado Pago para completar tu compra. Podrás abonar con:
          </p>
          <ul className="mp-methods-list">
            <li>
              <div className="mp-method-badge">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" height="14"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="14"/>
              </div>
              Tarjetas de crédito y débito
            </li>
            <li>
              <div className="mp-method-badge">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/MercadoPago_logo.png/1200px-MercadoPago_logo.png" alt="MercadoPago" height="14"/>
              </div>
              Dinero en tu cuenta
            </li>
            <li>
              <div className="mp-method-badge text-only">
                EFECTIVO
              </div>
              Pago Fácil / Rapipago
            </li>
          </ul>
        </div>
      )}

      {metodo === 'transferencia' && (
        <div className="transfer-info">
          <div className="info-icon"><LuBuilding2 size={28} color="#555" /></div>
          <h3>Transferencia Bancaria</h3>
          <p>Al confirmar tu pedido recibirás los datos bancarios por email. Tenés <strong>48hs</strong> para realizar el pago.</p>
          <div className="bank-data">
            <div className="bank-row"><span>Banco</span><strong>Banco Galicia</strong></div>
            <div className="bank-row"><span>Titular</span><strong>Le Pan S.R.L.</strong></div>
            <div className="bank-row"><span>CBU</span><strong>0070999830004177123456</strong></div>
            <div className="bank-row"><span>Alias</span><strong>LEPAN.PAGO</strong></div>
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="checkout-order-summary">
        <h4>Tu pedido</h4>
        {cart.map(item => (
          <div key={item._id} className="checkout-order-item">
            <span className="checkout-order-name">{item.nombre} × {item.quantity}</span>
            <span>{formatPrice((item.precio || 0) * item.quantity)}</span>
          </div>
        ))}
        <div className="checkout-order-sep"></div>
        <div className="checkout-order-row">
          <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div className="checkout-order-row" style={{ flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>Envío</span>
            <span style={{ color: MP_GREEN, fontWeight: 'bold' }}>Gratis</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#777' }}>Entrega estimada: 3 a 5 días hábiles</span>
        </div>
        <div className="checkout-order-row checkout-order-total" style={{ marginTop: '12px' }}>
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        <button className="btn-checkout-next" onClick={() => onNext({ metodoPago: metodo, total, envio, subtotal })} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
          {loading ? (
            <><span className="spinner-border"></span>Procesando seguro...</>
          ) : (
            <><LuShieldCheck size={18} />Confirmar y pagar</>
          )}
        </button>
        <button className="btn-checkout-back" onClick={onBack} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
          <LuChevronLeft size={18} /> Volver
        </button>
      </div>
    </div>
  );
};

/* ─── STEP 3: Resumen / Confirmación ─────────────────────── */
const StepResumen = ({ entrega, finalOrderData }) => {
  const navigate = useNavigate();
  const total = finalOrderData ? finalOrderData.totales.total : 0;
  const orderNum = finalOrderData ? finalOrderData._id.slice(-6).toUpperCase() : Math.floor(Math.random() * 900000) + 100000;
  const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p);

  const fMin = finalOrderData && finalOrderData.datosEntrega?.fechaEstimadaMin ? new Date(finalOrderData.datosEntrega.fechaEstimadaMin).toLocaleDateString() : '';
  const fMax = finalOrderData && finalOrderData.datosEntrega?.fechaEstimadaMax ? new Date(finalOrderData.datosEntrega.fechaEstimadaMax).toLocaleDateString() : '';

  return (
    <div className="checkout-step resumen-step">
      <div className="success-animation">
        <div className="success-circle">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle cx="26" cy="26" r="25" fill="none" stroke="#00a650" strokeWidth="2" className="checkmark-circle" />
            <path fill="none" stroke="#00a650" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 26 l8 8 l16-16" className="checkmark-check" />
          </svg>
        </div>
        <h2>¡Pedido recibido!</h2>
        <p className="order-number">Número de pedido: <strong>#{orderNum}</strong></p>
        <p className="order-email">Te enviaremos la confirmación a <strong>{entrega.email}</strong></p>

        {fMin && fMax && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e9f5ff', borderRadius: '8px', border: '1px solid #bce0fd', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <LuTruck size={18} color="#17a2b8" />
            <strong>Entrega estimada:</strong> Entre el {fMin} y el {fMax}
          </div>
        )}
      </div>

      <div className="resumen-cards">
        <div className="resumen-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LuPackage size={18} /> Productos</h4>
          {finalOrderData && finalOrderData.pedidosData ? finalOrderData.pedidosData.map((item, idx) => (
            <div key={idx} className="checkout-order-item">
              <span>{item.nombre} × {item.cantidad}</span>
              <span>{formatPrice((item.precio || 0) * item.cantidad)}</span>
            </div>
          )) : null}
          <div className="checkout-order-sep"></div>
          <div className="checkout-order-row checkout-order-total">
            <span>Total pagado</span><span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="resumen-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LuTruck size={18} /> Datos de entrega</h4>
          <p><strong>{entrega.nombre} {entrega.apellido}</strong></p>
          <p>{entrega.direccion}{entrega.piso ? `, ${entrega.piso}` : ''}</p>
          <p>{entrega.ciudad}, {entrega.provincia} ({entrega.cp})</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LuPhone size={15} /> {entrega.telefono}</p>
          {entrega.notas && <p className="notas-entrega" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LuNotebook size={15} /> {entrega.notas}</p>}
        </div>
      </div>

      <div className="resumen-actions">
        <button className="btn-resumen-secondary" onClick={() => navigate('/perfil')}>
          Ver mis pedidos
        </button>
        <button className="btn-resumen-primary" onClick={() => navigate('/productos')}>
          Seguir comprando
        </button>
      </div>
    </div>
  );
};

/* ─── MAIN CHECKOUT ──────────────────────────────────────── */
const STEP_KEYS = ['carrito', 'entrega', 'pago', 'resumen'];

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mapeamos el parámetro de la URL (0, 1, 2)
  const pasoQuery = parseInt(searchParams.get('paso'), 10);
  const subStep = isNaN(pasoQuery) || pasoQuery < 0 || pasoQuery > 2 ? 0 : pasoQuery;

  // Envoltorio para mantener compatibilidad con componentes que usan setState
  const setSubStep = (stepOrUpdater) => {
    const nextStep = typeof stepOrUpdater === 'function' ? stepOrUpdater(subStep) : stepOrUpdater;
    setSearchParams({ paso: nextStep });
  };

  const [loading, setLoading] = useState(false);
  const [finalOrderData, setFinalOrderData] = useState(null);
  const stepKey = STEP_KEYS[subStep + 1]; // offset: carrito is step 0 in indicator

  const [entrega, setEntrega] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    provincia: '', ciudad: '', direccion: '', piso: '', cp: '', notas: ''
  });

  useEffect(() => {
    if (cart.length === 0 && subStep < 2) navigate('/carrito');
    if (!user) {
      alert("Debes iniciar sesión para finalizar tu compra");
      navigate('/login?redirect=checkout');
    }
  }, [cart, user]);

  const handleEntregaChange = (field, value) => setEntrega(e => ({ ...e, [field]: value }));

  const advanceStep = async (pagoPayload) => {
    if (subStep === 1) {
      // Create order via API
      try {
        setLoading(true);
        const orderPayload = {
          items: cart.map(item => ({
            productoId: item._id, // Usamos el ID de combo o producto normal
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.quantity,
            imagen: item.imagen || (item.imagenes && item.imagenes.length > 0 ? item.imagenes[0] : ''),
            esCombo: item.esCombo || false
          })),
          datosEntrega: entrega,
          totales: {
            subtotal: pagoPayload.subtotal,
            envio: pagoPayload.envio,
            total: pagoPayload.total
          },
          metodoPago: pagoPayload.metodoPago
        };
        const createdOrder = await pedidoService.crearPedido(orderPayload);
        setFinalOrderData(createdOrder);
        clearCart();
        
        if (createdOrder.init_point) {
          // Redirigir a Mercado Pago
          window.location.href = createdOrder.init_point;
          return; // Detenemos la ejecución aquí
        }

        setSubStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        alert(error.response?.data?.message || 'Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    } else {
      setSubStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const backStep = () => {
    if (subStep === 0) { navigate('/carrito'); return; }
    setSubStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="checkout-page">
      <StepIndicator currentStep={stepKey} />

      <div className="checkout-container container">
        {subStep === 0 && (
          <StepEntrega data={entrega} onChange={handleEntregaChange} onNext={advanceStep} onBack={backStep} />
        )}
        {subStep === 1 && (
          <StepPago cart={cart} getCartTotal={getCartTotal} onNext={advanceStep} onBack={backStep} loading={loading} />
        )}
        {subStep === 2 && (
          <StepResumen entrega={entrega} finalOrderData={finalOrderData} />
        )}
      </div>
    </div>
  );
};

export default Checkout;
