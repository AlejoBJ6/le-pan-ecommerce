import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuClipboardList, LuSearch } from 'react-icons/lu';
import { CartContext } from '../../context/CartContext.jsx';
import StepIndicator from '../../components/StepIndicator/StepIndicator.jsx';
import './Carrito.css';

const Carrito = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const formatPrice = (price) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

  const subtotal = getCartTotal();
  const envio = 0; // Envío siempre gratis por decisión del dueño
  const total = subtotal + envio;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page bg-gray-light">
      <StepIndicator currentStep="carrito" />
      <div className="container cart-container">
        
        <h1 className="cart-title">Tu Carrito</h1>

        {cart.length === 0 ? (
          <div className="cart-empty card-box-shadow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>Tu carrito está vacío</h2>
            <p>¿No sabés qué comprar? ¡Miles de maquinarias te esperan!</p>
            <Link to="/productos" className="btn-primary">Descubrir Productos</Link>
          </div>
        ) : (
          <div className="cart-layout">
            
            {/* Lista de Productos */}
            <div className="cart-items-section card-box-shadow">
              <div className="cart-items-header">
                <h3>Productos</h3>
                <button className="btn-clear-cart" onClick={clearCart}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Vaciar carrito
                </button>
              </div>
              
              <ul className="cart-items-list">
                {cart.map((item) => {
                  const itemId = item._id || item.id;
                  const maxStock = item.stock || 99; // Si no hay límite explícito
                  const images = item.imagenes || [];
                  const imgSrc = images.length > 0 ? images[0] : (item.imagen || 'https://via.placeholder.com/150');

                  return (
                    <li key={itemId} className="cart-item">
                      <div className="item-image">
                        <img src={imgSrc} alt={item.nombre} />
                      </div>
                      
                      <div className="item-details">
                        {String(itemId).startsWith('combo-dinamico-') ? (
                          <span className="item-name" style={{ cursor: 'default' }}>{item.nombre}</span>
                        ) : (
                          <Link to={`/producto/${itemId}`} className="item-name">{item.nombre}</Link>
                        )}
                        <button className="btn-remove" onClick={() => removeFromCart(itemId)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          Eliminar
                        </button>
                      </div>

                      <div className="item-quantity-wrapper">
                        <div className="quantity-controls">
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >-</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                          >+</button>
                        </div>
                        {item.stock && <span className="stock-hint">{item.stock} disponibles</span>}
                      </div>

                      <div className="item-price">
                        {formatPrice((item.precio || item.precioFinal || item.price || 0) * item.quantity)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resumen Sidebar */}
            <div className="cart-summary-section">
              <div className="cart-summary card-box-shadow">
                <h3>Resumen de compra</h3>
                
                <div className="summary-row">
                  <span>Productos ({cart.length})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío a domicilio</span>
                  <span>{envio === 0 ? <span className="free-shipping">Gratis</span> : formatPrice(envio)}</span>
                </div>
                
                <hr className="summary-divider" />
                
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="summary-actions">
                  <button className="btn-primary btn-block" onClick={handleCheckout}>Continuar compra</button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Sección para consultar pedido anterior (útil para invitados) */}
        <div className="cart-track-order card-box-shadow">
          <div className="track-order-content">
            <div className="track-order-icon">
              <LuClipboardList size={32} />
            </div>
            <div className="track-order-text">
              <h3>¿Ya hiciste un pedido?</h3>
              <p>Si compraste como invitado, podés consultar el estado de tu pedido y subir el comprobante acá.</p>
            </div>
          </div>
          <button className="btn-track-order" onClick={() => navigate('/consultar-pedido')}>
            <LuSearch size={18} /> Consultar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
