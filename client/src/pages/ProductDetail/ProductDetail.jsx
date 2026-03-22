import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

// Mock data adaptada a maquinarias de panadería
const MOCK_PRODUCT = {
  id: '1',
  nombre: 'Amasadora Rápida Industrial 50 Kg Acero Inoxidable',
  precio: 1250000,
  precioAnterior: 1400000,
  cuotas: 6,
  imagenes: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1472&auto=format&fit=crop', // Panadería genérica de prueba
    'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549929424-df3991eb8f45?q=80&w=1527&auto=format&fit=crop'
  ],
  categoria: 'Amasadoras',
  ventas: 124,
  estrellas: 4.8,
  opiniones: 31,
  caracteristicas: [
    { nombre: 'Capacidad', valor: '50 Kg' },
    { nombre: 'Material', valor: 'Acero Inoxidable 304' },
    { nombre: 'Voltaje', valor: '380V Trifásica' },
    { nombre: 'Potencia', valor: '4 HP' },
    { nombre: 'Tipo de uso', valor: 'Industrial Pesado' }
  ],
  descripcion: 'La Amasadora Rápida Industrial de 50 Kg está diseñada para panaderías de alta producción. Su cuba y espiral de acero inoxidable garantizan durabilidad y máxima higiene en el amasado. Cuenta con dos velocidades y reloj temporizador, optimizando la creación de masas hidratadas, franceses, pizzas y repostería en general.',
  stock: 5,
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(MOCK_PRODUCT);
  const [imagenActiva, setImagenActiva] = useState(MOCK_PRODUCT.imagenes[0]);
  const [cantidad, setCantidad] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [lensStyle, setLensStyle] = useState({});
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    // Scroll to top upon rendering
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (isAdded) return;
    setIsAdded(true);
    window.dispatchEvent(new CustomEvent('cart-added'));
    setTimeout(() => setIsAdded(false), 2000);
  };

  const precioFormat = (precio) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(precio);

  const handleMouseMove = (e) => {
    if (window.innerWidth <= 768) return;
    
    const container = e.currentTarget;
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const lensSize = 150; // Tamaño del recuadro de zoom
    
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;
    
    // Restringir el lente dentro del contenedor
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > width - lensSize) lensX = width - lensSize;
    if (lensY > height - lensSize) lensY = height - lensSize;

    setLensStyle({
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${lensSize}px`,
      height: `${lensSize}px`,
    });

    const ratioX = lensX / (width - lensSize);
    const ratioY = lensY / (height - lensSize);

    setZoomStyle({
      backgroundImage: `url(${imagenActiva})`,
      backgroundPosition: `${ratioX * 100}% ${ratioY * 100}%`
    });
  };

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) setShowZoom(true);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) setShowZoom(false);
  };

  const handleImageClick = () => {
    setIsMobileModalOpen(true);
  };

  return (
    <div className="product-page bg-gray-light">
      <div className="container product-container">
        
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Volver</Link> <span className="separator">|</span>
          <Link to="/productos">Maquinarias</Link> <span className="separator">&gt;</span>
          <Link to={`/productos?categoria=${producto.categoria}`}>{producto.categoria}</Link> <span className="separator">&gt;</span>
          <span className="current">{producto.nombre}</span>
        </div>

        <div className="product-main-layout">
          
          {/* Main Left Section */}
          <div className="product-main-card card-box-shadow">
            <div className="product-grid">
              
              {/* Gallery Section */}
              <div className="product-gallery">
                <div className="gallery-thumbnails">
                  {producto.imagenes.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumbnail ${imagenActiva === img ? 'active' : ''}`}
                      onClick={() => setImagenActiva(img)}
                    >
                      <img src={img} alt={`Miniatura ${idx + 1}`} />
                    </div>
                  ))}
                </div>
                <div 
                  className="gallery-main-image"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleImageClick}
                >
                  <img src={imagenActiva} alt={producto.nombre} />
                  {showZoom && <div className="zoom-lens" style={lensStyle}></div>}
                </div>
                {showZoom && <div className="zoom-window card-box-shadow" style={zoomStyle}></div>}
              </div>

              {/* Info Section */}
              <div className="product-info">
                <div className="product-condition">
                  Nuevo | +{Math.floor(producto.ventas / 100) * 100} vendidos
                </div>
                <h1 className="product-title">{producto.nombre}</h1>
                
                <div className="product-rating">
                  <span className="stars">
                    ★★★★★
                  </span>
                  <span className="rating-value">{producto.estrellas}</span>
                  <span className="rating-count">({producto.opiniones})</span>
                </div>

                <div className="product-price-section">
                  {producto.precioAnterior && (
                    <div className="old-price">{precioFormat(producto.precioAnterior)}</div>
                  )}
                  <div className="current-price-row">
                    <span className="current-price">{precioFormat(producto.precio)}</span>
                    {producto.precioAnterior && (
                      <span className="discount-tag">
                        {Math.round((1 - producto.precio / producto.precioAnterior) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="payment-installments">
                    en {producto.cuotas}x de {precioFormat(producto.precio / producto.cuotas)} sin interés
                  </div>
                </div>

                <div className="product-features">
                  <h3>Lo que tenés que saber de este producto</h3>
                  <ul>
                    {producto.caracteristicas.map((c, idx) => (
                      <li key={idx}>
                        <strong>{c.nombre}:</strong> {c.valor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Description Section (Full Width inside Main Card) */}
            <div className="product-description-section">
              <h2>Descripción</h2>
              <p>{producto.descripcion}</p>
            </div>
          </div>

          {/* Right Sidebar - Purchase Card */}
          <div className="product-sidebar">
            <div className="purchase-card card-box-shadow">
              
              <div className="shipping-info">
                <div className="shipping-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                </div>
                <div className="shipping-text">
                  <span className="shipping-title">Llega gratis mañana</span>
                  <span className="shipping-subtitle">Enviando a tu código postal</span>
                </div>
              </div>

              <div className="store-info">
                <span>Vendido por <strong>Tienda Lé Pan</strong></span>
                <span className="store-badge">MercadoLíder Platinum</span>
              </div>

              <div className="stock-info">
                <h3>Stock disponible</h3>
                <div className="quantity-selector">
                  <label htmlFor="qty">Cantidad:</label>
                  <select 
                    id="qty" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  >
                    {[...Array(producto.stock).keys()].map(n => (
                      <option key={n + 1} value={n + 1}>{n + 1} unidad{n > 0 ? 'es' : ''}</option>
                    ))}
                  </select>
                  <span className="available-stock">({producto.stock} disponibles)</span>
                </div>
              </div>

              <div className="purchase-actions">
                <button className="btn-buy-now" onClick={() => navigate('/carrito')}>Comprar ahora</button>
                <button 
                  className={`btn-add-cart ${isAdded ? 'btn-added' : ''}`} 
                  onClick={handleAddToCart}
                >
                  {isAdded ? '¡Añadido al carrito! ✓' : 'Agregar al carrito'}
                </button>
              </div>

              <div className="purchase-guarantees">
                <p>🛡️ <strong>Compra Protegida</strong>, recibí el producto que esperabas o te devolvemos tu dinero.</p>
                <p>🏆 <strong>Garantía de fábrica</strong>: 12 meses.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Modal móvil a pantalla completa */}
      {isMobileModalOpen && (
        <div className="mobile-image-modal" onClick={() => setIsMobileModalOpen(false)}>
          <button className="close-mobile-modal" onClick={() => setIsMobileModalOpen(false)}>×</button>
          <img src={imagenActiva} alt={producto.nombre} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
