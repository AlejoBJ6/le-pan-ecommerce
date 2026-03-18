import React from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import ProductSection from '../../components/ProductSection/ProductSection.jsx';
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './HomePage.css';

// Mock data para probar la UI hasta que esté la API
const mockDestacados = [
  { id: 1, name: 'Amasadora Espiral 50kg Industrial', price: 850000, image: 'https://images.unsplash.com/photo-1555529733-0e670560f8e1?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Horno Convector 4 Bandejas', price: 1200000, image: 'https://images.unsplash.com/photo-1590846406792-0adc7f928a1f?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Sobadora Industrial 500mm', price: 650000, image: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?q=80&w=400&auto=format&fit=crop' },
  { id: 4, name: 'Batidora Planetaria 20L', price: 420000, image: 'https://images.unsplash.com/photo-1586529723049-74f76231bd76?q=80&w=400&auto=format&fit=crop' },
  { id: 5, name: 'Cortadora de Pan de Molde', price: 310000, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
];

const mockHornos = [
  { id: 6, name: 'Horno de Piso Mampostería', price: 2500000, image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=400&auto=format&fit=crop' },
  { id: 7, name: 'Horno Rotativo 15 Bandejas', price: 3800000, image: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?q=80&w=400&auto=format&fit=crop' },
  { id: 8, name: 'Horno Convector 10 Bandejas', price: 1800000, image: 'https://images.unsplash.com/photo-1590846406792-0adc7f928a1f?q=80&w=400&auto=format&fit=crop' },
  { id: 9, name: 'Horno Túnel Continuo', price: 8500000, image: 'https://images.unsplash.com/photo-1586529723049-74f76231bd76?q=80&w=400&auto=format&fit=crop' },
];

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      
      <main>
        <HeroBanner />
        <ProductSection 
          title="Los más destacados" 
          products={mockDestacados} 
          actionText="Añadir" 
        />
        <ProductSection 
          title="Hornos" 
          products={mockHornos} 
          actionText="Ver más" 
        />
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default HomePage;
