import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import './HomePage.css';

// Importamos el servicio y la tarjeta "libre" construida por el compañero
import productoService from '../../services/productoService.js';
import ProductCard from '../../components/ProductCard.jsx';

const mockProductosDestacados = [
  { _id: 'h1', nombre: 'Horno Rotativo 15 Bandejas', categoria: 'Hornos', precio: 3200000, stock: 2, disponible: true, destacado: true, imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'h2', nombre: 'Amasadora Rápida 50kg', categoria: 'Amasadoras', precio: 850000, stock: 5, disponible: true, destacado: true, imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'h3', nombre: 'Sobadora de Pie Industrial', categoria: 'Sobadoras', precio: 520000, stock: 3, disponible: true, destacado: true, imagenes: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'h4', nombre: 'Batidora Planetaria 30L', categoria: 'Batidoras', precio: 450000, stock: 4, disponible: true, destacado: true, imagenes: ['https://images.unsplash.com/photo-1591552599602-9907fbc4efb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] }
];

const mockAmasadoras = [
  { _id: 'a1', nombre: 'Amasadora Rápida 20kg', categoria: 'Amasadoras', precio: 650000, stock: 5, disponible: true, imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'a2', nombre: 'Amasadora Espiral 50kg', categoria: 'Amasadoras', precio: 950000, stock: 2, disponible: true, imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'a3', nombre: 'Amasadora Industrial 100kg', categoria: 'Amasadoras', precio: 1550000, stock: 1, disponible: true, imagenes: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'a4', nombre: 'Amasadora de Mesa 10kg', categoria: 'Amasadoras', precio: 350000, stock: 4, disponible: true, imagenes: ['https://images.unsplash.com/photo-1591552599602-9907fbc4efb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] }
];

const mockHornos = [
  { _id: 'ho1', nombre: 'Horno Rotativo 15 Bandejas', categoria: 'Hornos', precio: 3200000, stock: 2, disponible: true, imagenes: ['https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'ho2', nombre: 'Horno Convector 4 Bandejas', categoria: 'Hornos', precio: 850000, stock: 5, disponible: true, imagenes: ['https://images.unsplash.com/photo-1580975874880-9519199d690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'ho3', nombre: 'Horno Pastelero a Gas', categoria: 'Hornos', precio: 420000, stock: 3, disponible: true, imagenes: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] },
  { _id: 'ho4', nombre: 'Horno Eléctrico Doble', categoria: 'Hornos', precio: 650000, stock: 4, disponible: true, imagenes: ['https://images.unsplash.com/photo-1591552599602-9907fbc4efb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'] }
];

const HomePage = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Pedimos a la API los productos destacados
        const data = await productoService.obtenerProductos({ destacado: true });
        
        // Si la API no trae nada (está vacía), mostramos los renders de muestra:
        if (data.length > 0) {
          setProductosDestacados(data);
        } else {
          setProductosDestacados(mockProductosDestacados);
        }
      } catch (error) {
        console.error("Error al obtener productos destacados:", error);
        // Si hay error en la red, mostramos ejemplos
        setProductosDestacados(mockProductosDestacados);
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
              <div className="productos-grid">
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
          <section className="productos-extra-section" style={{ marginTop: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, textAlign: 'left' }}>
                Los Mejores en Amasadoras
              </h2>
              <Link to="/productos?categoria=Amasadoras" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}>
                Ver catálogo amasadoras →
              </Link>
            </div>
            <div className="productos-grid">
              {mockAmasadoras.map((producto) => (
                <ProductCard key={producto._id} producto={producto} />
              ))}
            </div>
          </section>

          {/* Sección extra: Hornos */}
          <section className="productos-extra-section" style={{ marginTop: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, textAlign: 'left' }}>
                Ofertas en Hornos
              </h2>
              <Link to="/productos?categoria=Hornos" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}>
                Ver catálogo hornos →
              </Link>
            </div>
            <div className="productos-grid">
              {mockHornos.map((producto) => (
                <ProductCard key={producto._id} producto={producto} />
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default HomePage;
