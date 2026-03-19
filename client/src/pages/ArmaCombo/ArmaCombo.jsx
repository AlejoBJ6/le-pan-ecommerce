import React, { useState } from 'react';
import './ArmaCombo.css';

const mockHornos = [
  { _id: 'ho1', nombre: 'Horno Rotativo 15 Bandejas', precio: 3200000, imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'ho2', nombre: 'Horno Convector 4 Bandejas', precio: 850000, imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'ho3', nombre: 'Horno Pastelero a Gas', precio: 420000, imagenes: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
];

const mockAmasadoras = [
  { _id: 'a1', nombre: 'Amasadora Rápida 20kg', precio: 650000, imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'a2', nombre: 'Amasadora Espiral 50kg', precio: 950000, imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'a3', nombre: 'Batidora Planetaria 30L', precio: 450000, imagenes: ['https://images.unsplash.com/photo-1591552599602-9907fbc4efb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
];

const SelectableCard = ({ producto, isSelected, onSelect }) => (
  <div className={`selectable-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(producto)}>
    <div className="selectable-image">
      <img src={producto.imagenes[0]} alt={producto.nombre} loading="lazy" />
      {isSelected && <div className="selected-badge">✓</div>}
    </div>
    <div className="selectable-info">
      <h3 className="selectable-name">{producto.nombre}</h3>
      <p className="selectable-price">${producto.precio.toLocaleString('es-AR')}</p>
      <button className="selectable-btn">{isSelected ? 'Seleccionado' : 'Seleccionar'}</button>
    </div>
  </div>
);

const ArmaCombo = () => {
  const [horno, setHorno] = useState(null);
  const [amasadora, setAmasadora] = useState(null);

  const subtotal = (horno?.precio || 0) + (amasadora?.precio || 0);
  const discountEligible = horno && amasadora;
  const discountAmount = discountEligible ? subtotal * 0.1 : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="arma-combo-page">
      <div className="arma-hero-banner">
        <div className="arma-hero-content">
          <h1>Armá tu Combo</h1>
          <p>Llevá tu <strong>Horno</strong> + <strong>Amasadora/Batidora</strong> y obtené automáticamente un <strong>10% de descuento directo</strong> en tu carrito.</p>
        </div>
      </div>
      
      <div className="container arma-layout">
        
        {/* Left Side: Product Selection */}
        <div className="arma-selections">
          <section className="arma-step">
            <h2 className="step-title">Paso 1: Elegí tu Horno</h2>
            <div className="productos-grid">
              {mockHornos.map(p => (
                <SelectableCard key={p._id} producto={p} isSelected={horno?._id === p._id} onSelect={setHorno} />
              ))}
            </div>
          </section>

          <section className="arma-step">
            <h2 className="step-title">Paso 2: Elegí tu Complemento</h2>
            <div className="productos-grid">
              {mockAmasadoras.map(p => (
                <SelectableCard key={p._id} producto={p} isSelected={amasadora?._id === p._id} onSelect={setAmasadora} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Sticky Calculator */}
        <aside className="arma-summary-wrapper">
          <div className="arma-summary-card">
            <h2>Tu Resumen</h2>
            
            <div className="summary-list">
              <div className="summary-item">
                <span className="summary-label">Horno:</span>
                <div className="summary-details">
                  <span className="summary-name">{horno ? horno.nombre : 'Sin seleccionar'}</span>
                  <span className="summary-price">{horno ? `$${horno.precio.toLocaleString('es-AR')}` : '-'}</span>
                </div>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Complemento:</span>
                <div className="summary-details">
                  <span className="summary-name">{amasadora ? amasadora.nombre : 'Sin seleccionar'}</span>
                  <span className="summary-price">{amasadora ? `$${amasadora.precio.toLocaleString('es-AR')}` : '-'}</span>
                </div>
              </div>
            </div>

            <div className="summary-totals">
              <div className="summary-row subtotal">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-AR')}</span>
              </div>
              
              <div className={`summary-row discount ${discountEligible ? 'active' : ''}`}>
                <span>Descuento Combo (10%)</span>
                <span>- ${discountAmount.toLocaleString('es-AR')}</span>
              </div>
              
              <div className="summary-row grand-total">
                <span>Total Final</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <button className="btn-checkout-combo" disabled={!discountEligible}>
              {discountEligible ? '🛒 Añadir Combo al Carrito' : 'Seleccioná ambos para comprar'}
            </button>
            {!discountEligible && <p className="combo-hint">El descuento se activa automáticamente al elegir 1 horno y 1 complemento.</p>}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default ArmaCombo;
