import React, { useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard.jsx';
import './ProductSection.css';

const ProductSection = ({ title, products, actionText }) => {
  const scrollRef = useRef(null);

  return (
    <section className="product-section container">
      <h2 className="section-title">{title}</h2>
      
      {/* Contenedor con scroll horizontal */}
      <div className="product-scroll-container" ref={scrollRef}>
        <div className="product-scroll-track">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              actionText={actionText} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
