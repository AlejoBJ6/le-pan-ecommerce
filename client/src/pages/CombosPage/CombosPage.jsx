import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import comboService from '../../services/comboService';
import './CombosPage.css';

const CombosPage = () => {
  const [combos, setCombos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const data = await comboService.obtenerCombos();
        setCombos(data);
      } catch (error) {
        console.error("Error al cargar los combos", error);
      } finally {
        setCargando(false);
      }
    };
    fetchCombos();
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
