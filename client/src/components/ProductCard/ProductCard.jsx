import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, actionText = "Añadir" }) => {
  return (
    <div className="product-card">
      <Link to={`/producto/${product._id || product.id || 1}`} style={{ display: 'block' }}>
        <div className="product-card-image">
          {/* Simula el badge OFERTA BOMBA de la ref */}
          {product.oldPrice && <div className="card-badge">OFERTA</div>}
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
      </Link>
      <div className="product-card-info">
        <Link to={`/producto/${product._id || product.id || 1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-card-name" style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>{product.name}</h3>
        </Link>
        <div className="product-prices">
          {product.oldPrice && (
            <p className="product-card-old-price">${product.oldPrice.toLocaleString('es-AR')}</p>
          )}
          <p className="product-card-price">$ {product.price.toLocaleString('es-AR')}</p>
        </div>
        <button className="product-card-btn" aria-label={`${actionText} ${product.name}`}>
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
