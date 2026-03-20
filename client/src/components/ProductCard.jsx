import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ producto }) => {
  return (
    <div className="product-card">
      <Link to={`/producto/${producto._id || 1}`} style={{ display: 'block' }}>
        <div className="product-image-container">
          {/* Usamos un fallback si el producto no tiene imagen */}
          <img 
            src={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : 'https://via.placeholder.com/300x300?text=No+Image'} 
            alt={producto.nombre} 
            className="product-image"
          />
          {producto.destacado && <span className="product-badge">Destacado</span>}
        </div>
      </Link>
      <div className="product-info">
        <Link to={`/producto/${producto._id || 1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name" style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>{producto.nombre}</h3>
        </Link>
        <p className="product-category">{producto.categoria}</p>
        <p className="product-price">${producto.precio}</p>
        <div className="product-actions">
          <button 
            className="btn-add-cart" 
            disabled={!producto.stock || producto.stock === 0 || !producto.disponible}
          >
            {producto.stock > 0 && producto.disponible ? 'Añadir al carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
