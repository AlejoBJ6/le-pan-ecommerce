import React, { useState, useEffect } from 'react';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton.jsx';
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
            <h2 className="section-title" style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800', textAlign: 'center' }}>
              Productos Destacados
            </h2>
            {loading ? (
              <p style={{ textAlign: 'center' }}>Cargando productos destacados...</p>
            ) : productosDestacados.length > 0 ? (
              <div 
                className="productos-grid" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '30px' 
                }}
              >
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
        </main>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default HomePage;
