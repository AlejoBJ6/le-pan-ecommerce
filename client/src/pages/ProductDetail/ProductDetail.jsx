import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import productoService from '../../services/productoService';
import { LuWrench, LuShieldCheck, LuTruck, LuCreditCard, LuBadgeCheck } from 'react-icons/lu';
import './ProductDetail.css';

const fallbackData = {
  ventas: 124,
  estrellas: 4.8,
  opiniones: 31,
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
        
        let imagenesTotales = prodData.imagenes?.length > 0 ? [...prodData.imagenes] : [];
        
        // Si es un combo, integramos la primera imagen de cada producto incluido si no está ya
        if (prodData.categoria === 'Combos' && prodData.productosIncluidos) {
          prodData.productosIncluidos.forEach(p => {
            if (p.imagenes && p.imagenes.length > 0) {
              const img = p.imagenes[0];
              if (!imagenesTotales.includes(img)) {
                imagenesTotales.push(img);
              }
            }
          });
        }

        const extendedProd = { ...fallbackData, ...prodData, imagenes: imagenesTotales };
        setProducto(extendedProd);
        setImagenActiva(imagenesTotales.length > 0 ? imagenesTotales[0] : 'https://via.placeholder.com/300x300?text=No+Image');
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
                    <LuCreditCard size={20} color="#00a650" />
                    <span>Pagá en cuotas con <strong style={{ color: '#00a650' }}>Mercado Pago</strong></span>
                  </div>
                </div>

                <div className="product-features">
                  <h3>Especificaciones Técnicas</h3>

                  {/* COMBO: heredamos specs de cada producto incluido */}
                  {producto.categoria === 'Combos' && producto.productosIncluidos && producto.productosIncluidos.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {producto.productosIncluidos.map((prod, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <LuWrench size={16} color="var(--color-primary, #E8820C)" />
                            <strong style={{ color: '#333', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                              {prod.nombre.toLowerCase()}
                            </strong>
                          </div>
                          {prod.caracteristicas && prod.caracteristicas.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: '24px' }}>
                              {prod.caracteristicas.map((c, cidx) => (
                                <li key={cidx} style={{ fontSize: '0.9rem', color: '#555', padding: '2px 0', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ccc' }}></div>
                                  <span><strong>{c.nombre}:</strong> {c.valor}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ color: '#bbb', fontStyle: 'italic', fontSize: '0.85rem', marginLeft: '24px' }}>
                              Sin specs cargadas para este producto.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                  /* PRODUCTO INDIVIDUAL: sus propias specs */
                  ) : producto.caracteristicas && producto.caracteristicas.length > 0 ? (
                     <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {producto.caracteristicas.map((c, idx) => (
                        <li key={idx} style={{ fontSize: '0.9rem', color: '#555', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <LuWrench size={14} color="var(--color-primary, #E8820C)" />
                          <span><strong>{c.nombre}:</strong> {c.valor}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      Sin especificaciones técnicas cargadas aún.
                    </p>
                  )}
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
                  <LuBadgeCheck size={28} />
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
                  <LuTruck size={24} color="#00a650" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ display: 'block', color: '#00a650', fontWeight: 'bold', fontSize: '1.05rem' }}>Envío GRATIS</span>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Entrega a coordinar (Sin cargo)</span>
                  </div>
                </div>
                <div className="guarantee-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <LuShieldCheck size={20} color="#666" style={{ marginTop: '2px', flexShrink: 0 }} />
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
