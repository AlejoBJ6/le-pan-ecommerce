import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import productoService from '../services/productoService';
import categoriaService from '../services/categoriaService';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

const Catalogo = () => {
  const location = useLocation();

  // Establecer estado inicial directamente desde la URL para evitar race conditions en el primer render
  const queryParams = new URLSearchParams(location.search);
  const initialCategoria = queryParams.get('categoria') || 'Todas';
  const initialBusqueda = queryParams.get('busqueda') || '';

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriasExtraidas, setCategoriasExtraidas] = useState(['Todas']);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState(initialBusqueda);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(initialCategoria);

  // Ref para hacer scroll al área de filtros (no al top de la página)
  const filtrosRef = useRef(null);

  // Sincronizar parámetro 'categoria' y 'busqueda' de la URL con el estado local
  // Solo cuando la URL cambia por navegación externa (ej: link desde HomePage)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlCategoria = searchParams.get('categoria') || 'Todas';
    const urlBusqueda = searchParams.get('busqueda') || '';

    setCategoriaSeleccionada(urlCategoria);
    setBusqueda(urlBusqueda);
  }, [location.search]);

  // Manejador para cuando se hace click en una pastilla de categoría local.
  // Usa replaceState en lugar de navigate() para NO disparar el scroll-to-top de React Router.
  const handleCategoryClick = (cat) => {
    const searchParams = new URLSearchParams(location.search);
    if (cat === 'Todas') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', cat);
    }

    const newUrl = `${location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    // Actualizar la URL sin navegación → sin scroll reset
    window.history.replaceState(null, '', newUrl);

    // Actualizar estado local directamente
    setCategoriaSeleccionada(cat);
  };


  useEffect(() => {
    const fetchDatos = async () => {
      setCargando(true);
      try {
        const [productosData, categoriasData] = await Promise.all([
          productoService.obtenerProductos({
            nombre: busqueda,
            categoria: categoriaSeleccionada === 'Todas' ? '' : categoriaSeleccionada
          }),
          categoriaService.obtenerCategorias()
        ]);
        // Disponibles primero, agotados al final
        const ordenados = [
          ...productosData.filter(p => p.disponible && p.stock > 0),
          ...productosData.filter(p => !p.disponible || p.stock <= 0),
        ];
        setProductos(ordenados);
        if (categoriasData && categoriasData.length > 0) {
          setCategoriasExtraidas(['Todas', ...categoriasData.map(c => c.nombre)]);
        }
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Intenta de nuevo más tarde.');
        setCargando(false);
      }
    };

    fetchDatos();
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
            {categoriasExtraidas.map((cat) => (
              <button 
                key={cat}
                className={`category-pill ${categoriaSeleccionada === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
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
