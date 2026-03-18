import React, { useState, useEffect } from 'react';
import './HeroBanner.css';

const slides = [
  {
    id: 1,
    title: "Equipamiento Industrial",
    subtitle: "La mejor calidad para tu panadería",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop" // Imagen temporal (Pan)
  },
  {
    id: 2,
    title: "Hornos Convectores",
    subtitle: "Cocción perfecta garantizada",
    image: "https://images.unsplash.com/photo-1586529723049-74f76231bd76?q=80&w=800&auto=format&fit=crop" // Imagen temporal (Horneado)
  },
  {
    id: 3,
    title: "Amasadoras",
    subtitle: "Rendimiento y durabilidad",
    image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800&auto=format&fit=crop" // Imagen temporal (Masa)
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-banner-container container">
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
