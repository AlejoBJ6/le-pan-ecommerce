import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import './HomePage.css';

// Importamos el servicio y la tarjeta "libre" construida por el compañero
import productoService from '../../services/productoService.js';
import ProductCard from '../../components/ProductCard.jsx';

const HomePage = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [amasadoras, setAmasadoras] = useState([]);
  const [hornos, setHornos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Pedimos a la API los productos de interés concurrente
        const [destacadosRes, amasadorasRes, hornosRes] = await Promise.all([
          productoService.obtenerProductos({ destacado: true }),
          productoService.obtenerProductos({ categoria: 'Amasadoras' }),
          productoService.obtenerProductos({ categoria: 'Hornos' })
        ]);
        
        setProductosDestacados(destacadosRes || []);
        setAmasadoras(amasadorasRes?.slice(0, 4) || []);
        setHornos(hornosRes?.slice(0, 4) || []);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductos();
  }, []);

  return (
    <div className="home-page">
      <HeroBanner />
      
      {/* Container amplio sin el Sidebar */}
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <main className="main-content" style={{ width: '100%' }}>
          <section className="productos-destacados-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
                Productos Destacados
              </h2>
              <Link to="/productos" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}>
                Ver catálogo completo →
              </Link>
            </div>
            {loading ? (
              <p style={{ textAlign: 'center' }}>Cargando productos destacados...</p>
            ) : productosDestacados.length > 0 ? (
              <div className="home-productos-slider">
                {productosDestacados.map((producto) => (
                  <ProductCard 
                    key={producto._id || producto.id} 
                    producto={producto} 
                  />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center' }}>No se encontraron productos destacados.</p>
            )}
          </section>

          {/* Sección extra: Amasadoras */}
          {amasadoras.length > 0 && (
            <section className="productos-extra-section" style={{ marginTop: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '30px' }}>
                <h2 className="section-title" style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, textAlign: 'left' }}>
                  Los Mejores en Amasadoras
                </h2>
                <Link to="/productos?categoria=Amasadoras" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}>
                  Ver catálogo amasadoras →
                </Link>
              </div>
              <div className="home-productos-slider">
                {amasadoras.map((producto) => (
                  <ProductCard key={producto._id} producto={producto} />
                ))}
              </div>
            </section>
          )}

          {/* Sección extra: Hornos */}
          {hornos.length > 0 && (
            <section className="productos-extra-section" style={{ marginTop: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '30px' }}>
                <h2 className="section-title" style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, textAlign: 'left' }}>
                  Ofertas en Hornos
                </h2>
                <Link to="/productos?categoria=Hornos" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}>
                  Ver catálogo hornos →
                </Link>
              </div>
              <div className="home-productos-slider">
                {hornos.map((producto) => (
                  <ProductCard key={producto._id} producto={producto} />
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default HomePage;
