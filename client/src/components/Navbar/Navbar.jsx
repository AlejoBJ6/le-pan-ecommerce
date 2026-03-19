import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogoOpen, setIsCatalogoOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Efecto para aplicar/quitar la clase 'dark-theme' en el body cuando cambie 'isDarkMode'
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="navbar-wrapper">
      {/* Nivel Superior Oscuro */}
      <div className="navbar-top">
        <div className="container navbar-top-container">
          {/* Logo */}
          <div className="navbar-logo">
            <span className="logo-icon">🥖</span>
            <span className="logo-text">LÉ PAN</span>
          </div>

          {/* Barra de Búsqueda */}
          <div className="navbar-search">
            <input type="text" placeholder="Buscar productos" />
            <button className="search-btn" aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* Acciones derecha */}
          <div className="navbar-actions">
            <button className="action-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Ingresar</span>
            </button>
            <button className="action-link cart-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Mi carrito</span>
              <span className="cart-badge-inline">0</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nivel Inferior Blanco */}
      <nav className="navbar-bottom">
        <div className="container navbar-bottom-container">
          <button 
            className="navbar-menu-btn" 
            aria-label="Abrir menú móvil"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <ul className="navbar-links">
            {/* Los enlaces fueron movidos al menú hamburguesa */}
          </ul>

          <div className="navbar-theme-toggle" onClick={toggleTheme}>
            <span>{isDarkMode ? 'MODO CLARO' : 'MODO OSCURO'}</span>
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </div>
        </div>
      </nav>

      {/* Menú Hamburguesa Drawer */}
      <div 
        className={`navbar-drawer-overlay ${isMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div className={`navbar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={() => setIsMenuOpen(false)}>✕</button>
        <div className="drawer-content">
          <ul className="drawer-menu">
            <li><a href="/">Inicio</a></li>
            <li><a href="/cuenta">Cuenta / Crear cuenta</a></li>
            <li className="drawer-submenu">
              <button 
                onClick={() => setIsCatalogoOpen(!isCatalogoOpen)} 
                className="submenu-toggle"
              >
                Catálogo
                <span className={`arrow ${isCatalogoOpen ? 'open' : ''}`}>▼</span>
              </button>
              {isCatalogoOpen && (
                <ul className="submenu-list">
                  <li><a href="/productos">Ver Todo</a></li>
                  <li><a href="/productos?categoria=Amasadoras">Amasadoras</a></li>
                  <li><a href="/productos?categoria=Hornos">Hornos</a></li>
                  <li><a href="/productos?categoria=Laminadoras">Laminadoras</a></li>
                  <li><a href="/productos?categoria=Batidoras">Batidoras</a></li>
                </ul>
              )}
            </li>
            <li><a href="/combos">Combos armados</a></li>
            <li><a href="/arma-combo">Armá tu combo</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
