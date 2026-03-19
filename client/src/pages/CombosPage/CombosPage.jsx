import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import './CombosPage.css';

// Mock data para los Combos Armados
const mockCombos = [
  { _id: 'c1', nombre: 'Combo Emprendedor: Amasadora 20kg + Horno 4 Bandejas', categoria: 'Combos', precio: 1350000, oldPrice: 1500000, stock: 5, disponible: true, imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'c2', nombre: 'Combo Panadería: Horno Rotativo + Batidora 30L', categoria: 'Combos', precio: 3500000, oldPrice: 3800000, stock: 2, disponible: true, imagenes: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'c3', nombre: 'Combo Pastelería: Batidora 10L + Horno Convector', categoria: 'Combos', precio: 800000, oldPrice: 950000, stock: 3, disponible: true, imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'c4', nombre: 'Combo Industrial: Sobadora + Amasadora 50kg', categoria: 'Combos', precio: 1250000, oldPrice: 1370000, stock: 4, disponible: true, imagenes: ['https://images.unsplash.com/photo-1591552599602-9907fbc4efb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] }
];

const CombosPage = () => {
  const [combos, setCombos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simulando una carga de la API
    setTimeout(() => {
      setCombos(mockCombos);
      setCargando(false);
    }, 800);
  }, []);

  return (
    <div className="combos-page">
      <div className="combos-hero-banner">
        <div className="combos-hero-content">
          <h1>Combos Armados</h1>
          <p>Llevá el equipo completo para tu panadería o pastelería a un precio promocional y empezá a producir hoy mismo.</p>
        </div>
      </div>
      
      <div className="catalogo-content-wrapper">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem', color: 'var(--color-dark)' }}>
          Elegí tu Combo Ideal
        </h2>
        {cargando ? (
          <div className="catalogo-loading">
            <div className="spinner"></div>
            <p>Buscando las mejores ofertas...</p>
          </div>
        ) : (
          <div className="productos-grid">
            {combos.map((combo) => (
              <ProductCard key={combo._id} producto={combo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombosPage;
