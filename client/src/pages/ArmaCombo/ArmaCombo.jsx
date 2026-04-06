import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import productoService from '../../services/productoService.js';
import categoriaService from '../../services/categoriaService.js';
import comboConfigService from '../../services/comboConfigService.js';
import { useCustomAlert } from '../../components/useCustomAlert';
import { LuPackage, LuCirclePlus, LuShoppingCart, LuCheck } from 'react-icons/lu';
import './ArmaCombo.css';

const SelectableCard = ({ producto, isSelected, onSelect, onVerDetalle, selectionCount }) => (
  <div className={`selectable-card ${isSelected ? 'selected' : ''}`}>
    <div className="selectable-image" onClick={() => onSelect(producto)}>
      <img src={producto.imagenes[0]} alt={producto.nombre} loading="lazy" />
      {isSelected && <div className="selected-badge">✓</div>}
      {selectionCount > 1 && isSelected && (
        <div className="selection-count-badge">{selectionCount}</div>
      )}
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const ArmaCombo = () => {
  const [todosLosProductos, setTodosLosProductos] = useState([]);
  const [categoriasList, setCategoriasList] = useState(['Todas']);
  const [comboConfig, setComboConfig] = useState({ 
    maxPrincipal: 1, maxComplemento: 1, descuento: 10,
    tipoDescuento: 'porcentaje', categoriasPrincipal: [], categoriasComplemento: []
  });
  const [loading, setLoading] = useState(true);

  const [filtroPaso1, setFiltroPaso1] = useState('Todas');
  const [filtroPaso2, setFiltroPaso2] = useState('Todas');

  // Arrays to hold multiple selection (admin can allow > 1)
  const [items1, setItems1] = useState([]);
  const [items2, setItems2] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);

  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const { showAlert, AlertComponent } = useCustomAlert();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resProductos, resCategorias, resConfig] = await Promise.all([
          productoService.obtenerProductos(),
          categoriaService.obtenerCategorias(),
          comboConfigService.obtenerConfig()
        ]);
        setTodosLosProductos(resProductos.filter(p => p.categoria !== 'Combos'));
        if (resCategorias && resCategorias.length > 0) {
          setCategoriasList(['Todas', ...resCategorias.map(c => c.nombre)]);
        }
        if (resConfig) {
          setComboConfig({
            maxPrincipal: resConfig.maxPrincipal || 1,
            maxComplemento: resConfig.maxComplemento || 1,
            descuento: resConfig.descuento ?? 10,
            tipoDescuento: resConfig.tipoDescuento || 'porcentaje',
            categoriasPrincipal: resConfig.categoriasPrincipal || [],
            categoriasComplemento: resConfig.categoriasComplemento || [],
          });
        }
      } catch (err) {
        console.error("Error cargando datos para combos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  // UseEffect for auto-selection from URL
  useEffect(() => {
    if (loading || todosLosProductos.length === 0) return;
    
    const searchParams = new URLSearchParams(location.search);
    const preselectId = searchParams.get('preselect');
    
    if (preselectId) {
      const prod = todosLosProductos.find(p => p._id === preselectId);
      if (prod) {
        const cat = prod.categoria;
        const isPrincipalCat = comboConfig.categoriasPrincipal?.length === 0 || comboConfig.categoriasPrincipal?.includes(cat);
        const isCompCat = comboConfig.categoriasComplemento?.length === 0 || comboConfig.categoriasComplemento?.includes(cat);

        // Prioridad 1: Si es categoría principal Y hay espacio (o lo forzamos si es el primer clic desde fuera)
        if (isPrincipalCat) {
          if (!items1.find(i => i._id === prod._id)) {
            // Si el límite es 1 y ya hay algo, lo reemplazamos para que el usuario vea lo que acaba de elegir
            if (comboConfig.maxPrincipal === 1) {
              setItems1([prod]);
            } else if (items1.length < comboConfig.maxPrincipal) {
              setItems1(prev => [...prev, prod]);
            }
          }
        } 
        // Prioridad 2: Si no fue principal o ya está lleno, pero es categoría complemento
        else if (isCompCat) {
          if (!items2.find(i => i._id === prod._id)) {
            if (comboConfig.maxComplemento === 1) {
              setItems2([prod]);
            } else if (items2.length < comboConfig.maxComplemento) {
              setItems2(prev => [...prev, prod]);
            }
          }
        }

        // Limpiar URL
        window.history.replaceState(null, '', '/arma-combo');

        // Scroll suave al resumen o al siguiente paso si ya se llenó
        const comboCompletoRef = document.querySelector('.arma-summary-card');
        if (comboCompletoRef) {
          comboCompletoRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [loading, todosLosProductos, location.search, comboConfig]);

  const toggleItem = (list, setList, producto, max) => {
    const exists = list.find(p => p._id === producto._id);
    if (exists) {
      setList(list.filter(p => p._id !== producto._id));
    } else {
      if (list.length < max) {
        setList([...list, producto]);
      } else if (max === 1) {
        // Auto-reemplaza si el límite es 1
        setList([producto]);
      } else {
        showAlert('Límite alcanzado', `Solo puedes seleccionar hasta ${max} productos en este paso. Desmarcá alguno para elegir este.`, 'info');
      }
    }
  };

  // Categories already selected in the other step
  const selectedCatsFromPaso1 = items1.map(i => i.categoria);
  const selectedCatsFromPaso2 = items2.map(i => i.categoria);

  const baseFilter1 = p => comboConfig.categoriasPrincipal.length === 0 || comboConfig.categoriasPrincipal.includes(p.categoria);
  const baseFilter2 = p => comboConfig.categoriasComplemento.length === 0 || comboConfig.categoriasComplemento.includes(p.categoria);

  // List of categories actually allowed in each step (minus the ones selected in the other)
  // If the admin didn't specify categories (length 0), we use all categories from the list
  const allowedCatsPaso1 = (comboConfig.categoriasPrincipal.length > 0 
    ? comboConfig.categoriasPrincipal 
    : categoriasList.filter(c => c !== 'Todas'))
    .filter(c => !selectedCatsFromPaso2.includes(c));

  const allowedCatsPaso2 = (comboConfig.categoriasComplemento.length > 0 
    ? comboConfig.categoriasComplemento 
    : categoriasList.filter(c => c !== 'Todas'))
    .filter(c => !selectedCatsFromPaso1.includes(c));

  // If the current category filter is no longer in the allowed list, reset to 'Todas'
  useEffect(() => {
    if (filtroPaso1 !== 'Todas' && allowedCatsPaso1.length > 0 && !allowedCatsPaso1.includes(filtroPaso1)) {
      setFiltroPaso1('Todas');
    }
  }, [selectedCatsFromPaso2, allowedCatsPaso1, filtroPaso1]);

  useEffect(() => {
    if (filtroPaso2 !== 'Todas' && allowedCatsPaso2.length > 0 && !allowedCatsPaso2.includes(filtroPaso2)) {
      setFiltroPaso2('Todas');
    }
  }, [selectedCatsFromPaso1, allowedCatsPaso2, filtroPaso2]);

  const productosPaso1 = todosLosProductos.filter(p => 
    allowedCatsPaso1.includes(p.categoria) &&
    (filtroPaso1 === 'Todas' ? true : p.categoria === filtroPaso1)
  );
  const productosPaso2 = todosLosProductos.filter(p => 
    allowedCatsPaso2.includes(p.categoria) &&
    (filtroPaso2 === 'Todas' ? true : p.categoria === filtroPaso2)
  );

  const subtotal = [...items1, ...items2].reduce((acc, p) => acc + p.precio, 0);
  const comboComplete = items1.length >= comboConfig.maxPrincipal && items2.length >= comboConfig.maxComplemento;
  const discountAmount = comboComplete 
    ? (comboConfig.tipoDescuento === 'porcentaje' ? subtotal * (comboConfig.descuento / 100) : comboConfig.descuento)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleAddToCart = () => {
    if (!comboComplete) {
      // Show explicit error via custom alert
      const missingPrincipal = Math.max(0, comboConfig.maxPrincipal - items1.length);
      const missingComplemento = Math.max(0, comboConfig.maxComplemento - items2.length);
      
      let mensaje = 'Para finalizar y armar este combo, te falta seleccionar:\n\n';
      if (missingPrincipal > 0) mensaje += `• ${missingPrincipal} producto(s) principal(es).\n`;
      if (missingComplemento > 0) mensaje += `• ${missingComplemento} complemento(s).\n`;
      
      showAlert('Combo Incompleto', mensaje, 'error');
      return;
    }
    
    if (isAdded) return;
    
    const allNames = [...items1, ...items2].map(p => p.nombre).join(' + ');
    addToCart({
      _id: `combo-dinamico-${Date.now()}`,
      nombre: `Combo ${comboConfig.tipoDescuento === 'porcentaje' ? comboConfig.descuento + '% OFF' : '$' + comboConfig.descuento + ' OFF'}: ${allNames}`,
      precio: total,
      imagenes: [items1[0]?.imagenes[0]],
      categoria: 'Combo Armado'
    }, 1);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const filterPills = (current, setCurrent, categoriasPermitidas) => {
    // We always show 'Todas' plus the allowed categories
    const listToShow = ['Todas', ...categoriasPermitidas.filter(c => c !== 'Todas')];
      
    return (
      <div className="category-filters" style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {listToShow.map(cat => (
          <button 
            key={cat} 
            className={`category-pill ${current === cat ? 'active' : ''}`}
            onClick={() => setCurrent(cat)}
            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--color-primary)', background: current === cat ? 'var(--color-primary)' : 'white', color: current === cat ? 'var(--color-dark)' : 'var(--color-primary)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold' }}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="arma-combo-page">
      <div className="arma-hero-banner">
        <div className="arma-hero-content">
          <h1>Armá tu Combo</h1>
          <p>
            Elegí <strong>{comboConfig.maxPrincipal} producto{comboConfig.maxPrincipal > 1 ? 's' : ''} principal{comboConfig.maxPrincipal > 1 ? 'es' : ''}</strong> y <strong>{comboConfig.maxComplemento} complemento{comboConfig.maxComplemento > 1 ? 's' : ''}</strong> y ahorrá automáticamente <strong>{comboConfig.tipoDescuento === 'porcentaje' ? `un ${comboConfig.descuento}% de descuento` : `$${comboConfig.descuento.toLocaleString('es-AR')} de descuento`}</strong>.
          </p>
        </div>
      </div>
      
      <div className="container arma-layout">
        
        {/* Left Side: Product Selection */}
        <div className="arma-selections">
          <section className="arma-step" id="paso-1">
            <h2 className="step-title">
              Paso 1: Elegí tu Producto Principal
              <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: 'var(--color-gray)', fontWeight: 'normal' }}>
                ({items1.length}/{comboConfig.maxPrincipal} seleccionados)
              </span>
            </h2>
            {filterPills(filtroPaso1, setFiltroPaso1, allowedCatsPaso1)}
            <div className="productos-grid">
              {loading ? <p>Cargando productos...</p> : productosPaso1.map(p => (
                <SelectableCard 
                  key={p._id} 
                  producto={p} 
                  isSelected={!!items1.find(i => i._id === p._id)}
                  onSelect={(prod) => {
                    toggleItem(items1, setItems1, prod, comboConfig.maxPrincipal);
                    // El scroll fue quitado o pospuesto para evitar saltos molestos de pantalla si reemplazan producto
                  }} 
                  onVerDetalle={setProductoDetalle}
                />
              ))}
            </div>
          </section>

          <section className="arma-step" id="paso-2">
            <h2 className="step-title">
              Paso 2: Elegí tu Complemento
              <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: 'var(--color-gray)', fontWeight: 'normal' }}>
                ({items2.length}/{comboConfig.maxComplemento} seleccionados)
              </span>
            </h2>
            {filterPills(filtroPaso2, setFiltroPaso2, allowedCatsPaso2)}
            <div className="productos-grid">
              {loading ? <p>Cargando complementos...</p> : productosPaso2.map(p => (
                <SelectableCard 
                  key={p._id} 
                  producto={p} 
                  isSelected={!!items2.find(i => i._id === p._id)}
                  onSelect={(prod) => toggleItem(items2, setItems2, prod, comboConfig.maxComplemento)}
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
                <span className="summary-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LuPackage size={18} /> Principales ({items1.length}/{comboConfig.maxPrincipal})</span>
                <div className="summary-details">
                  {items1.length === 0 ? (
                    <span className="summary-empty">Sin seleccionar...</span>
                  ) : items1.map(i => (
                    <div key={i._id} className="summary-product-row">
                      <span className="summary-name">{i.nombre}</span>
                      <span className="summary-price">${i.precio.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="summary-item">
                <span className="summary-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LuCirclePlus size={18} /> Complementos ({items2.length}/{comboConfig.maxComplemento})</span>
                <div className="summary-details">
                  {items2.length === 0 ? (
                    <span className="summary-empty">Sin seleccionar...</span>
                  ) : items2.map(i => (
                    <div key={i._id} className="summary-product-row">
                      <span className="summary-name">{i.nombre}</span>
                      <span className="summary-price">${i.precio.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="summary-totals">
              <div className="summary-row subtotal">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-AR')}</span>
              </div>
              
              <div className={`summary-row discount ${comboComplete ? 'active' : ''}`}>
                <span>Descuento Combo {comboConfig.tipoDescuento === 'porcentaje' ? `(${comboConfig.descuento}%)` : `Fijo`}</span>
                <span>- ${discountAmount.toLocaleString('es-AR')}</span>
              </div>
              
              <div className="summary-row grand-total">
                <span>Total Final</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <button 
              className={`btn-checkout-combo ${isAdded ? 'btn-added' : ''} ${!comboComplete ? 'btn-incomplete' : ''}`}
              onClick={handleAddToCart}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                opacity: 1 // Override default disabled opacity to keep it visible
              }}
            >
              {isAdded ? <><LuCheck size={20} /> ¡Combo Añadido!</> : (comboComplete ? <><LuShoppingCart size={20} /> Añadir Combo al Carrito</> : `Añadir Combo al Carrito`)}
            </button>
            {!comboComplete && <p className="combo-hint" style={{ color: 'var(--color-primary)' }}>Requiere armar el combo completo para poder llevar al carrito.</p>}
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
                    // Detect in which list this belongs contextually
                    const isComplementoSection = !!productosPaso2.find(p => p._id === productoDetalle._id);
                    const isPrincipalSection = !!productosPaso1.find(p => p._id === productoDetalle._id);

                    if (isPrincipalSection) {
                      toggleItem(items1, setItems1, productoDetalle, comboConfig.maxPrincipal);
                    } else if (isComplementoSection) {
                      toggleItem(items2, setItems2, productoDetalle, comboConfig.maxComplemento);
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
      
      {AlertComponent}
    </div>
  );
};

export default ArmaCombo;
