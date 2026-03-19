import React, { useState, useEffect } from 'react';
import productoService from '../services/productoService';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
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

  // Mock temporal para mostrar el diseño si no hay productos reales o hay fallo de API
  const mockProductos = [
    { _id: 'm1', nombre: 'Croissant de Mantequilla', categoria: 'Panadería', precio: 2500, stock: 12, disponible: true, destacado: true, imagenes: ['https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm2', nombre: 'Tarta de Frutos Rojos', categoria: 'Pastelería', precio: 8500, stock: 5, disponible: true, destacado: false, imagenes: ['https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm3', nombre: 'Pan de Masa Madre', categoria: 'Panes', precio: 3200, stock: 8, disponible: true, destacado: false, imagenes: ['https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm4', nombre: 'Macarons Surtidos', categoria: 'Pastelería', precio: 4500, stock: 0, disponible: false, destacado: true, imagenes: ['https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] }
  ];
  
  const productosAMostrar = productos.length > 0 ? productos : mockProductos;

  return (
    <div className="catalogo-page">
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Nuestro Catálogo</h1>
          <p>Descubre nuestra selección de maravillas artesanales</p>
        </div>
      </div>
      
      <div className="catalogo-content-wrapper">
        {cargando ? (
          <div className="catalogo-loading">
            <div className="spinner"></div>
            <p>Cargando sabores exquisitos...</p>
          </div>
        ) : error && productos.length === 0 ? (
          <div className="productos-grid">
            {mockProductos.map((producto) => (
              <ProductCard key={producto._id} producto={producto} />
            ))}
          </div>
        ) : productosAMostrar.length === 0 ? (
          <div className="catalogo-empty">
            <p>Aún no hay productos en nuestro catálogo.</p>
          </div>
        ) : (
          <div className="productos-grid">
            {productosAMostrar.map((producto) => (
              <ProductCard key={producto._id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;
