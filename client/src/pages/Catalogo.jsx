import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import productoService from '../services/productoService';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

const Catalogo = () => {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // Sincronizar parámetro 'categoria' y 'busqueda' de la URL con el estado local
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlCategoria = searchParams.get('categoria');
    const urlBusqueda = searchParams.get('busqueda');
    
    if (urlCategoria) {
      setCategoriaSeleccionada(urlCategoria);
    } else {
      setCategoriaSeleccionada('Todas');
    }

    if (urlBusqueda) {
      setBusqueda(urlBusqueda);
    } else {
      setBusqueda('');
    }
  }, [location.search]);

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


  return (
    <div className="catalogo-page">
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Equipamiento Industrial</h1>
          <p>Maquinaria profesional de alta durabilidad para llevar tu panadería al siguiente nivel</p>
        </div>
      </div>
      
      <div className="catalogo-filters-container">
        <div className="catalogo-filters" style={{ justifyContent: 'center' }}>
          <div className="category-filters">
            {['Todas', 'Amasadoras', 'Hornos', 'Laminadoras', 'Batidoras', 'Sobadoras', 'Complementos'].map((cat) => (
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
          <div className="catalogo-error">
            <p>{error}</p>
          </div>
        ) : productos.length === 0 ? (
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
    </div>
  );
};

export default Catalogo;
