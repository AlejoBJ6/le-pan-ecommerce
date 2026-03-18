import React from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import ProductSection from '../../components/ProductSection/ProductSection.jsx';
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import './HomePage.css';

const mockDestacados = [
  ...Array(5).fill().map((_, i) => ({
    id: i + 1, 
    name: 'Amasadora Espiral Industrial 50kg de Alto Rendimiento', 
    price: 850000, 
    oldPrice: 950000, // agregado oldPrice simulando ofertas
    image: 'https://images.unsplash.com/photo-1555529733-0e670560f8e1?q=80&w=400&auto=format&fit=crop'
  }))
];

const mockHornos = [
  ...Array(4).fill().map((_, i) => ({
    id: i + 6, 
    name: 'Horno Convector Inteligente 10 Bandejas', 
    price: 1800000, 
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f928a1f?q=80&w=400&auto=format&fit=crop'
  }))
];

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <HeroBanner />
      
      <div className="container main-grid">
        <Sidebar />
        
        <main className="main-content">
          <ProductSection 
            title="Ofertas Bomba" 
            products={mockDestacados} 
            actionText="Añadir al carrito" 
          />
          <ProductSection 
            title="Destacados en Hornos" 
            products={mockHornos} 
            actionText="Ver más" 
          />
        </main>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default HomePage;
