import React, { useState, useEffect } from 'react';
import './HeroBanner.css';

const slides = [
  {
    id: 1,
    title: "# RENOVÁ TU PANADERÍA",
    subtitle: "Maquinaria con tecnología de punta",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    id: 2,
    title: "OFERTAS EN HORNOS",
    subtitle: "Cocción perfecta garantizada",
    image: "https://images.unsplash.com/photo-1586529723049-74f76231bd76?q=80&w=1200&auto=format&fit=crop" 
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-banner-container">
      <div className="hero-banner">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="banner-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            ></button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;
