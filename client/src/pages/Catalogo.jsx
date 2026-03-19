import React, { useState, useEffect } from 'react';
import productoService from '../services/productoService';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

const Catalogo = () => {
  const [productos, setProductos] = pos = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.obtenerProductos();
        setProductos(data);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Intenta de nuevo más tarde.');
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  if (cargando) {
    return (
      <div className="catalogo-loading">
        <div className="spinner"></div>
        <p>Cargando sabores exquisitos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="catalogo-error">{error}</div>;
  }

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h1>Nuestro Catálogo</h1>
        <p>Descubre todos nuestros productos artesanales</p>
      </div>
      
      {productos.length === 0 ? (
        <div className="catalogo-empty">
          <p>Aún no hay productos en nuestro catálogo.</p>
        </div>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalogo;
