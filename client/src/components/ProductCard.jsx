import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import './ProductCard.css';

const isVideo = (url) => typeof url === 'string' && url.match(/\.(mp4|webm|mov)$/i);

const ProductCard = ({ producto }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, cart } = useContext(CartContext);

  const itemEnCarrito = cart.find(item => (item._id || item.id) === (producto._id || producto.id));
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.quantity : 0;
  // Si no tiene la propiedad stock (ej. algunos combos), asumimos 99.
  const stockLimite = producto.stock !== undefined ? producto.stock : 99;
  const canAddMore = cantidadEnCarrito < stockLimite;

  const handleAddToCart = (e) => {
    if (e) e.preventDefault();
    if (!producto.disponible || !canAddMore || isAdded) return;
    
    addToCart(producto, 1);
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };


  const esComboObj = producto.categoria === 'Combos' || producto.precioFinal !== undefined || (producto.items && producto.items.length > 0);
  const physicallyHasStock = esComboObj ? producto.disponible : (producto.stock > 0 && producto.disponible);
  const canAddToCartUI = physicallyHasStock && canAddMore;

  return (
    <div className="product-card">
      <Link to={`/producto/${producto._id || 1}`} style={{ display: 'block' }}>
        <div className="product-image-container">
          {/* Usamos un fallback si el producto no tiene imagen */}
          {(producto.imagenes && producto.imagenes.length > 0 && isVideo(producto.imagenes[0])) ? (
            <video 
              src={producto.imagenes[0]} 
              muted autoPlay loop playsInline
              className="product-image"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <img 
              src={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : 'https://via.placeholder.com/300x300?text=No+Image'} 
              alt={producto.nombre} 
              className="product-image"
            />
          )}
          {producto.destacado && <span className="product-badge">Destacado</span>}
        </div>
      </Link>
      <div className="product-info">
        <Link to={`/producto/${producto._id || 1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name" style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>{producto.nombre}</h3>
        </Link>
        <p className="product-category">{producto.categoria}</p>
        <div className="product-price-container" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '10px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <p className="product-price" style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-dark)' }}>
              ${(producto.precio || producto.precioFinal || 0).toLocaleString('es-AR')}
            </p>
            {(producto.precioAnterior || producto.precioSinDescuento) > (producto.precio || producto.precioFinal) && (
              <p style={{ margin: 0, textDecoration: 'line-through', color: 'var(--color-gray)', fontSize: '0.9rem' }}>
                ${(producto.precioAnterior || producto.precioSinDescuento).toLocaleString('es-AR')}
              </p>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '0.3px' }}>
            Precio final • IVA incluido
          </div>
        </div>
        <div className="product-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className={`btn-add-cart ${isAdded ? 'btn-added' : ''}`} 
            disabled={!physicallyHasStock || !canAddMore || isAdded}
            onClick={handleAddToCart}
            style={{ opacity: (!physicallyHasStock || !canAddMore) ? 0.7 : 1 }}
          >
            {isAdded ? '¡Añadido! ✓' : (physicallyHasStock ? (canAddMore ? 'Añadir al carrito' : 'Stock máximo alcanzado') : 'Agotado')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
