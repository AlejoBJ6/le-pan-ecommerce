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
            <div className="home-section-header">
              <h2 className="section-title">
                Productos Destacados
              </h2>
              <Link to="/productos" className="catalog-link">
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
              <section className="productos-extra-section" key={categoria}>
                <div className="home-section-header secondary">
                  <h2 className="section-title">
                    Lo Mejor en {categoria}
                  </h2>
                  <Link to={`/productos?categoria=${encodeURIComponent(categoria)}`} className="catalog-link">
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
