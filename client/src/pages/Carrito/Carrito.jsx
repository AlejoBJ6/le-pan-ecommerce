import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import './Carrito.css';

const Carrito = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);

  const formatPrice = (price) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

  const subtotal = getCartTotal();
  const envio = subtotal > 0 ? (subtotal > 2000000 ? 0 : 25000) : 0; // Envío gratis si supera 2M, si no 25000
  const total = subtotal + envio;

  const handleCheckout = () => {
    // Por el momento no redirecciona a WhatsApp según requested
    alert("Función de checkout (pasarela de pago o confirmación de carrito) en construcción. Ya veremos esto más tarde.");
  };

  return (
    <div className="cart-page bg-gray-light">
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
                <button className="btn-clear-cart" onClick={clearCart}>Vaciar carrito</button>
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
                        <Link to={`/producto/${itemId}`} className="item-name">{item.nombre}</Link>
                        <button className="btn-remove" onClick={() => removeFromCart(itemId)}>Eliminar</button>
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
                        {formatPrice((item.precio || item.price || 0) * item.quantity)}
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
      </div>
    </div>
  );
};

export default Carrito;
