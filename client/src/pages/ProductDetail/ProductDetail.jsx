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
    { nombre: 'Garantía', valor: '12 meses' },
    { nombre: 'Envío', valor: 'A convenir' }
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
                <h1 className="product-title">{producto.nombre}</h1>

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
            <div className="purchase-card">

              <div className="manufacturer-info">
                <div className="manufacturer-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9"></path></svg>
                </div>
                <div className="manufacturer-text">
                  <span className="manufacturer-title">Fabricante directo</span>
                  <span className="manufacturer-subtitle">Lé Pan — fabricación propia</span>
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
                <div className="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span><strong>Garantía de fábrica</strong>: 12 meses</span>
                </div>
                <div className="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <span><strong>Envío</strong> a coordinar con el equipo</span>
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
