import React, { useState, useEffect } from 'react';
import productoService from '../services/productoService';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  useEffect(() => {
    const fetchProductos = async () => {
      setCargando(true);
      try {
        const data = await productoService.obtenerProductos({
          nombre: busqueda,
          categoria: categoriaSeleccionada
        });
        setProductos(data);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Intenta de nuevo más tarde.');
        setCargando(false);
      }
    };

    fetchProductos();
  }, [busqueda, categoriaSeleccionada]);

  // Mock temporal para mostrar el diseño si no hay productos reales o hay fallo de API
  const mockProductos = [
    { _id: 'm1', nombre: 'Croissant de Mantequilla', categoria: 'Panadería', precio: 2500, stock: 12, disponible: true, destacado: true, imagenes: ['https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm2', nombre: 'Tarta de Frutos Rojos', categoria: 'Pastelería', precio: 8500, stock: 5, disponible: true, destacado: false, imagenes: ['https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm3', nombre: 'Pan de Masa Madre', categoria: 'Panes', precio: 3200, stock: 8, disponible: true, destacado: false, imagenes: ['https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm4', nombre: 'Macarons Surtidos', categoria: 'Pastelería', precio: 4500, stock: 0, disponible: false, destacado: true, imagenes: ['https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] }
  ];
  
  // Como usamos mockLocal temporalmente, si hacemos búsqueda sobre el mock debemos filtrarlo manualmente
  // Esto es sólo necesario porque estamos mockeando en frontend cuando la BD está vacía.
  const isMockActive = productos.length === 0 && !error && !cargando;
  let productosAMostrar = productos.length > 0 ? productos : mockProductos;
  
  if (isMockActive) {
     productosAMostrar = mockProductos.filter(p => {
       const matchNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
       const matchCat = categoriaSeleccionada === 'Todas' || p.categoria === categoriaSeleccionada;
       return matchNombre && matchCat;
     });
  }

  return (
    <div className="catalogo-page">
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Nuestro Catálogo</h1>
          <p>Descubre nuestra selección de maravillas artesanales</p>
        </div>
      </div>
      
      <div className="catalogo-filters-container">
        <div className="catalogo-filters">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="category-filters">
            {['Todas', 'Panadería', 'Pastelería', 'Panes'].map((cat) => (
              <button 
                key={cat}
                className={`category-pill ${categoriaSeleccionada === cat ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
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
