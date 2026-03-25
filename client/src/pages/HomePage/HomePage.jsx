import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import './HomePage.css';

// Importamos el servicio y la tarjeta "libre" construida por el compañero
import productoService from '../../services/productoService.js';
import ProductCard from '../../components/ProductCard.jsx';

const HomePage = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Obtenemos TODOS los productos del backend
        const todosLosProductos = await productoService.obtenerProductos();

        // Destacados directos
        const destacados = todosLosProductos.filter(p => p.destacado);
        setProductosDestacados(destacados);

        // Agrupar el resto por categorías (omitimos "Combos" porque tienen su propia página)
        const categoriasMap = {};
        todosLosProductos.forEach(p => {
          if (p.categoria && p.categoria !== 'Combos') {
            if (!categoriasMap[p.categoria]) {
              categoriasMap[p.categoria] = [];
            }
            categoriasMap[p.categoria].push(p);
          }
        });

        setProductosPorCategoria(categoriasMap);
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
              <p style={{ textAlign: 'center' }}>Cargando inicio...</p>
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

          {/* DYNAMIC CATEGORY RENDER */}
          {Object.entries(productosPorCategoria).map(([categoria, productosDeCategoria]) => (
            productosDeCategoria.length > 0 && (
              <section className="productos-extra-section" style={{ marginTop: '60px' }} key={categoria}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '30px' }}>
                  <h2 className="section-title" style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, textAlign: 'left' }}>
                    Lo Mejor en {categoria}
                  </h2>
                  <Link to={`/productos?categoria=${encodeURIComponent(categoria)}`} style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}>
                    Ver catálogo de {categoria.toLowerCase()} →
                  </Link>
                </div>
                <div className="home-productos-slider">
                  {/* SLICE 0, 4 para solo mostrar 4 como maximo */}
                  {productosDeCategoria.slice(0, 4).map((producto) => (
                    <ProductCard key={producto._id || producto.id} producto={producto} />
                  ))}
                </div>
              </section>
            )
          ))}

        </main>
      </div>
    </div>
  );
};

export default HomePage;
