import React, { useState } from 'react';
import './ArmaCombo.css';

const mockHornos = [
  { 
    _id: 'ho1', nombre: 'Horno Rotativo 15 Bandejas', precio: 3200000, 
    imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
    descripcion: 'Horno rotativo ideal para alta producción ininterrumpida. Su cocción pareja garantiza productos uniformes.',
    caracteristicas: [{nombre: 'Capacidad', valor: '15 Bandejas 60x40'}, {nombre: 'Alimentación', valor: 'Corriente Trifásica'}]
  },
  { 
    _id: 'ho2', nombre: 'Horno Convector 4 Bandejas', precio: 850000, 
    imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
    descripcion: 'Solución compacta para locales con espacio reducido. Cocción por convección forzada para dorados perfectos.',
    caracteristicas: [{nombre: 'Capacidad', valor: '4 Bandejas 40x30'}, {nombre: 'Control', valor: 'Panel Digital'}, {nombre: 'Vapor', valor: 'Inyección manual'}]
  },
  { 
    _id: 'ho3', nombre: 'Horno Pastelero a Gas', precio: 420000, 
    imagenes: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
    descripcion: 'Horno clásico a gas de múltiples cámaras, especial para pastelería tradicional, pizzas y empanadas.',
    caracteristicas: [{nombre: 'Pisos', valor: '3 Cámaras refractarias'}, {nombre: 'Gas', valor: 'Envasado / Natural'}]
  },
];

const mockAmasadoras = [
  { 
    _id: 'a1', nombre: 'Amasadora Rápida 20kg', precio: 650000, 
    imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
    descripcion: 'Máquina robusta que reduce el tiempo de amasado a la mitad comparado con amasadoras convencionales.',
    caracteristicas: [{nombre: 'Capacidad', valor: '20kg de masa'}, {nombre: 'Motor', valor: '1.5 HP'}, {nombre: 'Material', valor: 'Acero Inoxidable'}]
  },
  { 
    _id: 'a2', nombre: 'Amasadora Espiral 50kg', precio: 950000, 
    imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
    descripcion: 'Sistema de espiral invertida para masas altamente hidratadas, perfecta para pan de masa madre y artesanales.',
    caracteristicas: [{nombre: 'Capacidad', valor: '50kg de masa'}, {nombre: 'Velocidades', valor: '2 marchas + Reversa'}]
  },
  { 
    _id: 'a3', nombre: 'Batidora Planetaria 30L', precio: 450000, 
    imagenes: ['https://images.unsplash.com/photo-1591552599602-9907fbc4efb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
    descripcion: 'Equipo multifuncional para batir cremas, montar claras y mezclar masas ligeras. Incluye 3 accesorios intercambiables.',
    caracteristicas: [{nombre: 'Capacidad', valor: '30 Litros'}, {nombre: 'Accesorios', valor: 'Globo, Lira, Gancho'}]
  },
];

const SelectableCard = ({ producto, isSelected, onSelect, onVerDetalle }) => (
  <div className={`selectable-card ${isSelected ? 'selected' : ''}`}>
    <div className="selectable-image" onClick={() => onSelect(producto)}>
      <img src={producto.imagenes[0]} alt={producto.nombre} loading="lazy" />
      {isSelected && <div className="selected-badge">✓</div>}
    </div>
    <div className="selectable-info">
      <h3 className="selectable-name" onClick={() => onSelect(producto)}>{producto.nombre}</h3>
      <p className="selectable-price" onClick={() => onSelect(producto)}>${producto.precio.toLocaleString('es-AR')}</p>
      <div className="selectable-actions">
        <button className="selectable-btn" onClick={() => onSelect(producto)}>
          {isSelected ? 'Seleccionado' : 'Seleccionar'}
        </button>
        <button 
          className="selectable-info-btn" 
          title="Ver detalle"
          onClick={(e) => { e.stopPropagation(); onVerDetalle(producto); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </button>
      </div>
    </div>
  </div>
);

const ArmaCombo = () => {
  const [horno, setHorno] = useState(null);
  const [amasadora, setAmasadora] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null); // Modal Quick View

  const handleAddToCart = () => {
    if (!discountEligible || isAdded) return;
    setIsAdded(true);
    window.dispatchEvent(new CustomEvent('cart-added'));
    setTimeout(() => setIsAdded(false), 2000);
  };

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
          <section className="arma-step" id="paso-1">
            <h2 className="step-title">Paso 1: Elegí tu Horno</h2>
            <div className="productos-grid">
              {mockHornos.map(p => (
                <SelectableCard 
                  key={p._id} 
                  producto={p} 
                  isSelected={horno?._id === p._id} 
                  onSelect={(prod) => {
                    setHorno(prod);
                    setTimeout(() => {
                      // El offset de -100px aprox se maneja mejor si el header/navbar existe,
                      // scrollIntoView('start') lo pegará arriba, pero está bien para dar foco.
                      const nextStep = document.getElementById('paso-2');
                      if (nextStep) {
                        const y = nextStep.getBoundingClientRect().top + window.scrollY - 120;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }, 250);
                  }} 
                  onVerDetalle={setProductoDetalle}
                />
              ))}
            </div>
          </section>

          <section className="arma-step" id="paso-2">
            <h2 className="step-title">Paso 2: Elegí tu Complemento</h2>
            <div className="productos-grid">
              {mockAmasadoras.map(p => (
                <SelectableCard 
                  key={p._id} 
                  producto={p} 
                  isSelected={amasadora?._id === p._id} 
                  onSelect={setAmasadora} 
                  onVerDetalle={setProductoDetalle}
                />
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

            <button 
              className={`btn-checkout-combo ${isAdded ? 'btn-added' : ''}`} 
              disabled={!discountEligible}
              onClick={handleAddToCart}
            >
              {isAdded ? '¡Combo Añadido! ✓' : (discountEligible ? '🛒 Añadir Combo al Carrito' : 'Seleccioná ambos para comprar')}
            </button>
            {!discountEligible && <p className="combo-hint">El descuento se activa automáticamente al elegir 1 horno y 1 complemento.</p>}
          </div>
        </aside>

      </div>

      {/* Quick View Modal */}
      {productoDetalle && (
        <div className="quick-view-overlay" onClick={() => setProductoDetalle(null)}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setProductoDetalle(null)}>✕</button>
            <div className="qv-modal-content">
              <div className="qv-image">
                <img src={productoDetalle.imagenes[0]} alt={productoDetalle.nombre} />
              </div>
              <div className="qv-info">
                <h2>{productoDetalle.nombre}</h2>
                <p className="qv-price">${productoDetalle.precio.toLocaleString('es-AR')}</p>
                <div className="qv-description">
                  <h3>Descripción</h3>
                  <p>{productoDetalle.descripcion || 'Sin descripción detallada.'}</p>
                </div>
                {productoDetalle.caracteristicas && (
                  <div className="qv-features">
                    <h3>Características</h3>
                    <ul>
                      {productoDetalle.caracteristicas.map((c, i) => (
                        <li key={i}><strong>{c.nombre}:</strong> {c.valor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button 
                  className="qv-select-btn"
                  onClick={() => {
                    if (mockHornos.some(h => h._id === productoDetalle._id)) {
                      setHorno(productoDetalle);
                      setTimeout(() => {
                        const nextStep = document.getElementById('paso-2');
                        if (nextStep) {
                          const y = nextStep.getBoundingClientRect().top + window.scrollY - 120;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 250);
                    } else {
                      setAmasadora(productoDetalle);
                    }
                    setProductoDetalle(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Seleccionar en combo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArmaCombo;
