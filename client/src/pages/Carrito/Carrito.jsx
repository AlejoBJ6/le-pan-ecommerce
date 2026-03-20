import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Carrito.css';

// Mock data para probar el carrito visualmente
const MOCK_CART = [
  {
    id: '1',
    nombre: 'Amasadora Rápida Industrial 50 Kg Acero Inoxidable',
    precio: 1250000,
    cantidad: 1,
    imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop',
    stock: 5,
  },
  {
    id: '2',
    nombre: 'Horno Convector Eléctrico 4 Bandejas',
    precio: 850000,
    cantidad: 2,
    imagen: 'https://images.unsplash.com/photo-1580975874880-9519199d690a?q=80&w=300&auto=format&fit=crop',
    stock: 10,
  }
];

const Carrito = () => {
  const [cartItems, setCartItems] = useState(MOCK_CART);

  const formatPrice = (price) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.cantidad + delta;
        if (newQuantity >= 1 && newQuantity <= item.stock) {
          return { ...item, cantidad: newQuantity };
        }
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const envio = subtotal > 0 ? (subtotal > 2000000 ? 0 : 25000) : 0; // Envío gratis si supera 2M, si no 25000
  const total = subtotal + envio;

  return (
    <div className="cart-page bg-gray-light">
      <div className="container cart-container">
        
        <h1 className="cart-title">Tu Carrito</h1>

        {cartItems.length === 0 ? (
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
              </div>
              
              <ul className="cart-items-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.imagen} alt={item.nombre} />
                    </div>
                    
                    <div className="item-details">
                      <Link to={`/producto/${item.id}`} className="item-name">{item.nombre}</Link>
                      <button className="btn-remove" onClick={() => removeItem(item.id)}>Eliminar</button>
                    </div>

                    <div className="item-quantity-wrapper">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.cantidad <= 1}
                        >-</button>
                        <span className="qty-value">{item.cantidad}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.cantidad >= item.stock}
                        >+</button>
                      </div>
                      <span className="stock-hint">{item.stock} disponibles</span>
                    </div>

                    <div className="item-price">
                      {formatPrice(item.precio * item.cantidad)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resumen Sidebar */}
            <div className="cart-summary-section">
              <div className="cart-summary card-box-shadow">
                <h3>Resumen de compra</h3>
                
                <div className="summary-row">
                  <span>Productos ({cartItems.length})</span>
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
                  <button className="btn-primary btn-block">Continuar compra</button>
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
