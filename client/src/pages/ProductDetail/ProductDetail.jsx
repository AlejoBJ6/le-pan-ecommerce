import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import productoService from '../../services/productoService';
import comboConfigService from '../../services/comboConfigService';
import comboService from '../../services/comboService';
import { useCustomAlert } from '../../components/useCustomAlert';
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
  const [isLoadingCombo, setIsLoadingCombo] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useContext(CartContext);
  const { showAlert, AlertComponent } = useCustomAlert();

  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [lensStyle, setLensStyle] = useState({});
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProd = async () => {
      try {
        let prodData;
        let isComboModel = false;
        try {
          prodData = await productoService.obtenerProductoPorId(id);
        } catch (err) {
          // Si falla como producto, probamos como combo
          prodData = await comboService.obtenerComboPorId(id);
          prodData.categoria = 'Combos'; // Mock categorization para mantener diseño de UI
          isComboModel = true;
        }
        
        let imagenesTotales = prodData.imagenes?.length > 0 ? [...prodData.imagenes] : [];
        
        // Extraer imagenes hijo si es Combo
        if (isComboModel && prodData.items && prodData.items.length > 0) {
          prodData.items.forEach(item => {
            const p = item.producto;
            if (p && p.imagenes && p.imagenes.length > 0) {
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

  // Calcular stock disponible real (stock total - lo que ya está en el carrito)
  const itemEnCarrito = cart.find(item => (item._id || item.id) === (producto?._id || id));
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.quantity : 0;
  const stockDisponibleReal = producto ? Math.max(0, producto.stock - cantidadEnCarrito) : 0;

  // Ajustar cantidad seleccionada si supera el stock disponible real
  useEffect(() => {
    if (stockDisponibleReal > 0 && cantidad > stockDisponibleReal) {
      setCantidad(stockDisponibleReal);
    } else if (stockDisponibleReal === 0 && cantidad !== 0) {
      setCantidad(0);
    } else if (stockDisponibleReal > 0 && cantidad === 0) {
      setCantidad(1);
    }
  }, [stockDisponibleReal, cantidad]);

  const handleAddToCart = () => {
    if (isAdded) return;

    addToCart(producto, cantidad);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddToCombo = async () => {
    if (!producto.stock || producto.stock === 0 || !producto.disponible) return;

    setIsLoadingCombo(true);
    try {
      const config = await comboConfigService.obtenerConfig();
      const cat = producto.categoria;
      
      const isAllowedAsPrincipal = config.categoriasPrincipal?.length === 0 || config.categoriasPrincipal?.includes(cat);
      const isAllowedAsComplemento = config.categoriasComplemento?.length === 0 || config.categoriasComplemento?.includes(cat);

      if (!isAllowedAsPrincipal && !isAllowedAsComplemento) {
        let allowed = [];
        if (config.categoriasPrincipal?.length > 0) allowed.push(...config.categoriasPrincipal);
        if (config.categoriasComplemento?.length > 0) allowed.push(...config.categoriasComplemento);
        const allowedText = allowed.length > 0 ? allowed.join(', ') : 'cualquier otra';
        
        showAlert(
          'Producto no permitido en combos',
          `El administrador configuró que la categoría "${cat}" no se puede usar para combos. Permite: ${allowedText}.`,
          'error'
        );
      } else {
        navigate(`/arma-combo?preselect=${producto._id}`);
      }
    } catch (error) {
      console.error(error);
      showAlert('Error', 'No se pudo validar la configuración de combos. Intenta de nuevo más tarde.', 'error');
    } finally {
      setIsLoadingCombo(false);
    }
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
                <h1 className="product-title">
                  {producto.nombre.toLowerCase()}
                </h1>

                <div className="product-price-section">
                  { (producto.precioAnterior || producto.precioSinDescuento) > (producto.precio || producto.precioFinal) && (
                    <div className="old-price">{precioFormat(producto.precioAnterior || producto.precioSinDescuento)}</div>
                  )}
                  <div className="current-price-row">
                    <span className="current-price">{precioFormat(producto.precio || producto.precioFinal)}</span>
                    { (producto.precioAnterior || producto.precioSinDescuento) > (producto.precio || producto.precioFinal) && (
                      <span className="discount-tag">
                        {Math.round((1 - (producto.precio || producto.precioFinal) / (producto.precioAnterior || producto.precioSinDescuento)) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="payment-installments">
                    <LuCreditCard size={20} className="mp-icon" />
                    <span>Pagá en cuotas con <strong className="mp-text">Mercado Pago</strong></span>
                  </div>
                </div>

                <div className="product-features">
                  <h3>Especificaciones Técnicas</h3>

                  {/* COMBO: heredamos specs de cada producto incluido */}
                  {producto.categoria === 'Combos' && ((producto.items && producto.items.length > 0) || (producto.productosIncluidos && producto.productosIncluidos.length > 0)) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(producto.items ? producto.items.map(i => i.producto).filter(Boolean) : producto.productosIncluidos).map((prod, idx) => (
                        <div key={idx}>
                          <div className="combo-product-header">
                          <LuWrench size={16} color="var(--color-primary, #E8820C)" />
                            <strong className="combo-product-name">
                              {prod.nombre.toLowerCase()}
                            </strong>
                          </div>
                          {prod.caracteristicas && prod.caracteristicas.length > 0 ? (
                            <ul className="product-specs-list">
                              {prod.caracteristicas.map((c, cidx) => (
                                <li key={cidx} className="spec-item">
                                  <div className="spec-dot"></div>
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
                     <ul className="product-specs-list-simple">
                      {producto.caracteristicas.map((c, idx) => (
                        <li key={idx} className="spec-item-simple">
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

              <div className="manufacturer-info">
                <div className="manufacturer-badge-icon">
                  <LuBadgeCheck size={28} />
                </div>
                <div className="manufacturer-text">
                  <span className="manufacturer-title">Vendedor Verificado</span>
                  <span className="manufacturer-subtitle">Lé Pan — Fabricante Directo</span>
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
                    disabled={stockDisponibleReal <= 0}
                  >
                    {stockDisponibleReal > 0 ? (
                      [...Array(stockDisponibleReal).keys()].map(n => (
                        <option key={n + 1} value={n + 1}>{n + 1} unidad{n > 0 ? 'es' : ''}</option>
                      ))
                    ) : (
                      <option value="0">0 unidades</option>
                    )}
                  </select>
                  <span className="available-stock">
                    {stockDisponibleReal <= 0 ? (
                      <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                        {cantidadEnCarrito >= producto.stock ? '(Stock máximo en carrito)' : '(Sin stock disponible)'}
                      </span>
                    ) : (
                      `(${stockDisponibleReal} disponibles)`
                    )}
                  </span>
                </div>
              </div>

              <div className="purchase-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  className="btn-buy-now" 
                  disabled={stockDisponibleReal <= 0 || isAdded}
                  onClick={() => {
                    addToCart(producto, cantidad);
                    navigate('/carrito');
                  }}
                  style={{ opacity: stockDisponibleReal <= 0 ? 0.7 : 1, cursor: stockDisponibleReal <= 0 ? 'not-allowed' : 'pointer' }}
                >
                  {stockDisponibleReal <= 0 ? (cantidadEnCarrito > 0 ? 'Stock máximo alcanzado' : 'Agotado') : 'Comprar ahora'}
                </button>
                <button
                  className={`btn-add-cart ${isAdded ? 'btn-added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={stockDisponibleReal <= 0 || isAdded}
                  style={{ opacity: stockDisponibleReal <= 0 ? 0.7 : 1, cursor: stockDisponibleReal <= 0 ? 'not-allowed' : 'pointer' }}
                >
                  {isAdded ? '¡Añadido al carrito! ✓' : (stockDisponibleReal <= 0 ? (cantidadEnCarrito > 0 ? 'Stock máximo alcanzado' : 'Agotado') : 'Agregar al carrito')}
                </button>
                
                {producto.categoria !== 'Combos' && (
                  <button 
                    className="btn-add-combo" 
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--color-primary)',
                      background: 'transparent',
                      color: 'var(--color-primary)',
                      borderRadius: 'var(--radius-sm, 6px)',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: (!producto.stock || producto.stock === 0 || !producto.disponible || isLoadingCombo) ? 'not-allowed' : 'pointer',
                      opacity: (!producto.stock || producto.stock === 0 || !producto.disponible) ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                    }}
                    disabled={!producto.stock || producto.stock === 0 || !producto.disponible || isLoadingCombo}
                    onClick={handleAddToCombo}
                    onMouseOver={(e) => {
                      if(producto.stock > 0 && producto.disponible && !isLoadingCombo) {
                        e.target.style.background = 'var(--color-primary)';
                        e.target.style.color = '#fff';
                      }
                    }}
                    onMouseOut={(e) => {
                      if(producto.stock > 0 && producto.disponible && !isLoadingCombo) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--color-primary)';
                      }
                    }}
                  >
                    {isLoadingCombo ? 'Validando...' : 'Añadir al combo'}
                  </button>
                )}
              </div>

              <div className="purchase-guarantees">
                <div className="guarantee-item shipping">
                  <LuTruck size={24} className="guarantee-icon" />
                  <div>
                    <span className="guarantee-title">Envío Gratis <span style={{ fontWeight: 500, color: '#777' }}>(A coordinar)</span></span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <LuShieldCheck size={20} className="guarantee-icon-sec" />
                  <span className="guarantee-text"><strong>Garantía de fábrica</strong>: 12 meses</span>
                </div>

                {/* Microcopy de devolución — elimina dudas antes de comprar */}
                <div style={{
                  marginTop: '8px',
                  paddingTop: '10px',
                  borderTop: '1px dashed rgba(0,0,0,0.1)',
                  fontSize: '0.8rem',
                  color: '#777',
                  lineHeight: '1.5',
                }}>
                  🔙 <Link to="/devoluciones" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}>
                    10 días para arrepentirte sin cargo
                  </Link>. Sin preguntas.
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
      
      {AlertComponent}
    </div>
  );
};

export default ProductDetail;
