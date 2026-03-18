import React from 'react';
import './Navbar.css';

const Navbar = () => {
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
          <button className="navbar-menu-btn" aria-label="Abrir menú móvil">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <ul className="navbar-links">
            <li><a href="#" className="highlight">🏷️ Ofertas</a></li>
            <li><a href="#">Armá tu equipo</a></li>
            <li><a href="#">Amasadoras</a></li>
            <li><a href="#">Hornos</a></li>
            <li><a href="#">Laminadoras</a></li>
            <li><a href="#">Batidoras</a></li>
            <li><a href="#">EMPRESAS</a></li>
          </ul>

          <div className="navbar-theme-toggle">
            <span>MODO CLARO</span>
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
