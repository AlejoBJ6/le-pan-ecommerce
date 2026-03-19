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

  // Sincronizar parámetro 'categoria' de la URL con el estado local
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlCategoria = searchParams.get('categoria');
    if (urlCategoria) {
      setCategoriaSeleccionada(urlCategoria);
    } else {
      setCategoriaSeleccionada('Todas');
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

  // Mock temporal para mostrar el diseño de maquinaria si no hay productos reales o hay fallo de API
  const mockProductos = [
    { _id: 'm1', nombre: 'Horno Rotativo 15 Bandejas', categoria: 'Hornos', precio: 3200000, stock: 2, disponible: true, destacado: true, imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm2', nombre: 'Amasadora Rápida 50kg', categoria: 'Amasadoras', precio: 850000, stock: 5, disponible: true, destacado: false, imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm3', nombre: 'Sobadora de Pie Industrial', categoria: 'Sobadoras', precio: 520000, stock: 3, disponible: true, destacado: false, imagenes: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
    { _id: 'm4', nombre: 'Ralladora de Pan Inox', categoria: 'Complementos', precio: 150000, stock: 0, disponible: false, destacado: true, imagenes: ['https://images.unsplash.com/photo-1621535492984-babb78e7278d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] }
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
