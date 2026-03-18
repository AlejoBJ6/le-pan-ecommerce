import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, actionText = "Añadir" }) => {
  return (
    <div className="product-card">
      <div className="product-card-image">
        {/* Simula el badge OFERTA BOMBA de la ref */}
        {product.oldPrice && <div className="card-badge">OFERTA</div>}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
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
