import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import productoService from '../../services/productoService';
import './ProductDetail.css';

const fallbackData = {
  ventas: 124,
  estrellas: 4.8,
  opiniones: 31,
  cuotas: 6,
  caracteristicas: [
    { nombre: 'Material', valor: 'Acero Inoxidable' },
    { nombre: 'Producción', valor: 'Uso Industrial Intensivo' },
    { nombre: 'Eficiencia', valor: 'Alta precisión y durabilidad' }
  ]
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [lensStyle, setLensStyle] = useState({});
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProd = async () => {
      try {
        const prodData = await productoService.obtenerProductoPorId(id);
        setProducto({ ...fallbackData, ...prodData });
        setImagenActiva(prodData.imagenes?.length > 0 ? prodData.imagenes[0] : 'https://via.placeholder.com/300x300?text=No+Image');
      } catch (err) {
        console.error("Error cargando detalles del producto", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProd();
  }, [id]);

  const handleAddToCart = () => {
    if (isAdded) return;

    addToCart(producto, cantidad);

    setIsAdded(true);
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
      backgroundPosition: `${ratioX * 100}% ${ratioY * 100}%`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '250% 250%',
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

  if (loading) return <div className="product-page bg-gray-light" style={{ padding: '100px', textAlign: 'center' }}><h2>Cargando detalles del producto...</h2></div>;
  if (!producto) return <div className="product-page bg-gray-light" style={{ padding: '100px', textAlign: 'center' }}><h2>El producto no fue encontrado.</h2><Link to="/productos">Volver al catálogo</Link></div>;

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
                  {producto.imagenes && producto.imagenes.map((img, idx) => (
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
                <h1 className="product-title" style={{ textTransform: 'capitalize', fontSize: '1.6rem', fontWeight: 600, color: '#444' }}>
                  {producto.nombre.toLowerCase()}
                </h1>

                <div className="product-price-section">
                  {producto.precioAnterior > producto.precio && (
                    <div className="old-price">{precioFormat(producto.precioAnterior)}</div>
                  )}
                  <div className="current-price-row">
                    <span className="current-price">{precioFormat(producto.precio)}</span>
                    {producto.precioAnterior > producto.precio && (
                      <span className="discount-tag">
                        {Math.round((1 - producto.precio / producto.precioAnterior) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="payment-installments" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="#00a650" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    <span>Pagá en cuotas con <strong style={{ color: '#00a650' }}>Mercado Pago</strong></span>
                  </div>
                </div>

                <div className="product-features">
                  <h3>Especificaciones Técnicas Principales</h3>
                  <ul>
                    {producto.caracteristicas
                      .filter(c => !c.nombre.toLowerCase().includes('garantía') && !c.nombre.toLowerCase().includes('envío'))
                      .map((c, idx) => (
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
            <div className="purchase-card">

              <div className="manufacturer-info" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff9eb', padding: '12px', borderRadius: '8px', border: '1px solid #ffe8b3' }}>
                <div style={{ color: '#E8820C', marginRight: '12px' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="28" height="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                </div>
                <div className="manufacturer-text">
                  <span className="manufacturer-title" style={{ display: 'block', fontWeight: 'bold', color: '#B36200' }}>Vendedor Verificado</span>
                  <span className="manufacturer-subtitle" style={{ fontSize: '0.85rem', color: '#666' }}>Lé Pan — Fabricante Directo</span>
                </div>
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
                <div className="guarantee-item" style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="#00a650" strokeWidth="2" style={{ marginTop: '2px' }}><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <div>
                    <span style={{ display: 'block', color: '#00a650', fontWeight: 'bold', fontSize: '1.05rem' }}>Envío GRATIS</span>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Entrega a coordinar (Sin cargo)</span>
                  </div>
                </div>
                <div className="guarantee-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="#666" strokeWidth="2" style={{ marginTop: '2px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span style={{ color: '#444' }}><strong>Garantía de fábrica</strong>: 12 meses</span>
                </div>
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
