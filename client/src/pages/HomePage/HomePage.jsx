import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import './HomePage.css';

// Importamos el servicio y la tarjeta "libre" construida por el compañero
import productoService from '../../services/productoService.js';
import comboService from '../../services/comboService.js';
import ProductCard from '../../components/ProductCard.jsx';
import { LuShieldCheck } from 'react-icons/lu';

// ── Carrusel por categoría ────────────────────────────────
const ITEMS_VISIBLE = 4; // Cuántas tarjetas se muestran a la vez
const MAX_ITEMS = 8;     // Máximo de productos a cargar en el carrusel

const CarruselCategoria = ({ productos, categoria }) => {
  const sliderRef = useRef(null);
  const CARD_WIDTH = 276; // 260px tarjeta + 16px gap

  const scroll = useCallback((dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir * CARD_WIDTH * 2, behavior: 'smooth' });
  }, []);

  // Limitar los productos mostrados
  const productosLimitados = productos.slice(0, MAX_ITEMS);
  const tieneExtra = productosLimitados.length > ITEMS_VISIBLE;

  return (
    <div className="carrusel-wrapper">
      {tieneExtra && (
        <button className="carrusel-btn carrusel-btn--prev" onClick={() => scroll(-1)} aria-label="Anterior">
          &#8592;
        </button>
      )}
      <div className="home-productos-slider" ref={sliderRef}>
        {productosLimitados.map((producto) => (
          <ProductCard key={producto._id || producto.id} producto={producto} />
        ))}
      </div>
      {tieneExtra && (
        <button className="carrusel-btn carrusel-btn--next" onClick={() => scroll(1)} aria-label="Siguiente">
          &#8594;
        </button>
      )}
    </div>
  );
};

const HomePage = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [combosArmados, setCombosArmados] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtenemos TODOS los productos y Combos en paralelo
        const [todosLosProductos, todosLosCombos] = await Promise.all([
          productoService.obtenerProductos(),
          comboService.obtenerCombos()
        ]);

        // Filtrar solo los disponibles con stock
        const productosDisponibles = todosLosProductos.filter(p => p.disponible && p.stock > 0);
        const combosDisponibles = todosLosCombos.filter(c => c.disponible !== false);

        // Destacados directos (Mix de Productos y Combos) — solo disponibles
        const destacados = [
          ...productosDisponibles.filter(p => p.destacado),
          ...combosDisponibles.filter(c => c.destacado).map(c => ({...c, categoria: 'Combos'}))
        ];
        
        setProductosDestacados(destacados);
        
        // Save only available combos
        setCombosArmados(combosDisponibles.map(c => ({...c, categoria: 'Combos'})));

        // Agrupar el resto por categorías — solo disponibles
        const categoriasMap = {};
        productosDisponibles.forEach(p => {
          if (p.categoria && p.categoria !== 'Combos') {
            if (!categoriasMap[p.categoria]) {
              categoriasMap[p.categoria] = [];
            }
            categoriasMap[p.categoria].push(p);
          }
        });

        setProductosPorCategoria(categoriasMap);
      } catch (error) {
        console.error("Error al obtener datos principales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
              <CarruselCategoria productos={productosDestacados.slice(0, 8)} />
            ) : (
              <p style={{ textAlign: 'center' }}>No se encontraron productos destacados.</p>
            )}
          </section>

          {/* COMBOS ARMADOS SECTION */}
          {!loading && combosArmados.length > 0 && (
            <section className="productos-extra-section">
              <div className="home-section-header secondary">
                <h2 className="section-title">
                  Combos Armados
                </h2>
                <Link to="/combos" className="catalog-link">
                  Ver todos los combos →
                </Link>
              </div>
              <CarruselCategoria productos={combosArmados} />
            </section>
          )}

          {/* Categorías con carrusel navegable (Máximo 4) */}
          {Object.entries(productosPorCategoria).slice(0, 4).map(([categoria, productosDeCategoria]) => (
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
                <CarruselCategoria productos={productosDeCategoria} categoria={categoria} />
              </section>
            )
          ))}
          {/* Botón Ver Todo si hay más de 4 categorías */}
          {Object.keys(productosPorCategoria).length > 4 && (
            <div className="ver-todo-container">
              <Link to="/productos" className="btn-ver-todo">
                Explorar todas las categorías
              </Link>
            </div>
          )}

          {/* ── SOLICITUD DE ARREPENTIMIENTO (Res. 424/2020) ─────────── */}
          <section className="arrepentimiento-section">
            <div className="arrepentimiento-inner">
              <div className="arrep-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <LuShieldCheck size={20} color="var(--color-primary, #E8820C)" />
                  <strong>Solicitud de Arrepentimiento</strong>
                </div>
                <span>
                  Tenés <strong>10 días</strong> para arrepentirte de tu compra sin dar explicaciones.
                  Es tu derecho según la Ley 24.240.
                </span>
              </div>
              <Link to="/arrepentimiento" className="arrep-btn">
                Iniciar solicitud
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default HomePage;
