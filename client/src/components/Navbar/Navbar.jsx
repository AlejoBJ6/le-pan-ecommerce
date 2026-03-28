import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext.jsx';
import productoService from '../../services/productoService.js';
import categoriaService from '../../services/categoriaService.js';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogoOpen, setIsCatalogoOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [bumpCart, setBumpCart] = useState(false);
  const [categoriasMenu, setCategoriasMenu] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoriaService.obtenerCategorias();
        if (data) setCategoriasMenu(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleCartAdd = () => {
      setBumpCart(true);
      setTimeout(() => setBumpCart(false), 300);
    };
    window.addEventListener('cart-added', handleCartAdd);
    return () => window.removeEventListener('cart-added', handleCartAdd);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileSearchOpen) {
      document.getElementById('mobile-search-input')?.focus();
    }
  }, [isMobileSearchOpen]);

  // Efecto para tema oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Efecto para autocompletado de búsqueda con Debounce
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const fetchSuggestions = async () => {
        try {
          const data = await productoService.obtenerProductos({ nombre: searchTerm });
          setSuggestions(data.slice(0, 5)); // Máximo 5 sugerencias
          setShowSuggestions(true);
        } catch (e) {
          console.error("Error al obtener sugerencias", e);
        }
      };

      const debounce = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/productos');
    }
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const handeSuggestionClick = (name) => {
    navigate(`/productos?busqueda=${encodeURIComponent(name)}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-top">
        <div className={`container navbar-top-container ${isMobileSearchOpen ? 'mobile-search-active' : ''}`}>

          {/* Lado Izquierdo: Hamburguesa + Logo */}
          <div className="navbar-left">
            <button
              className="navbar-menu-btn"
              aria-label="Abrir menú móvil"
              onClick={() => setIsMenuOpen(true)}
              style={{ visibility: isMenuOpen ? 'hidden' : 'visible' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <Link to="/" className="navbar-logo">
              <img src="/images/logos/image-removebg-preview.png" alt="Lé Pan Logo" className="logo-img" />
            </Link>
          </div>

          {/* Centro: Barra de Búsqueda */}
          <form className="navbar-search" onSubmit={handleSearch}>
            {isMobileSearchOpen && (
              <button
                type="button"
                className="search-close-btn"
                onClick={() => setIsMobileSearchOpen(false)}
                aria-label="Cerrar búsqueda"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Buscar productos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button
              type="submit"
              className="search-btn"
              aria-label="Buscar"
              onClick={(e) => {
                if (window.innerWidth <= 768 && !isMobileSearchOpen) {
                  e.preventDefault();
                  setIsMobileSearchOpen(true);
                }
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Sugerencias Autocompletado */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map(s => (
                  <li key={s._id} onClick={() => handeSuggestionClick(s.nombre)}>
                    {s.nombre}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* Lado Derecho: Acciones y Tema */}
          <div className="navbar-actions">

            <div className="navbar-theme-toggle desktop-only-theme" onClick={toggleTheme}>
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

            {user ? (
              <>
                {user.rol === 'admin' && (
                  <button className="action-link" onClick={() => navigate('/admin')} title="Panel Admin">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </button>
                )}

                <button className="action-link" onClick={() => navigate('/perfil')} title="Mi Perfil">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
              </>
            ) : (
              <button className="action-link" onClick={() => navigate('/login')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            )}
            <button className={`action-link cart-link ${bumpCart ? 'cart-bump' : ''}`} onClick={() => navigate('/carrito')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {getCartCount() > 0 && (
                <span className={`cart-badge-inline ${bumpCart ? 'bounce' : ''}`}>{getCartCount()}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Hamburguesa Drawer */}
      <div
        className={`navbar-drawer-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div className={`navbar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={() => setIsMenuOpen(false)}>✕</button>
        <div className="drawer-content">
          <ul className="drawer-menu">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
            {user ? (
              <>
                <li><span style={{ color: 'var(--color-primary)', fontWeight: 600, padding: '16px 0', display: 'block' }}>Hola, {user.nombre}</span></li>
                <li>
                  <Link to="/perfil" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Mi Perfil
                  </Link>
                </li>
                {user.rol === 'admin' && (
                  <li>
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}>
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      Panel Administrativo
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar sesión</Link></li>
            )}
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
                  <li><Link to="/productos" onClick={() => setIsMenuOpen(false)}>Ver Todo</Link></li>
                  {categoriasMenu.map(cat => (
                    <li key={cat._id || cat.nombre}>
                      <Link to={`/productos?categoria=${encodeURIComponent(cat.nombre)}`} onClick={() => setIsMenuOpen(false)}>
                        {cat.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><Link to="/combos" onClick={() => setIsMenuOpen(false)}>Combos armados</Link></li>
            <li><Link to="/arma-combo" onClick={() => setIsMenuOpen(false)}>Armá tu combo</Link></li>
            <li><Link to="/contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
            <li className="mobile-only-theme">
              <button
                onClick={toggleTheme}
                className="submenu-toggle"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isDarkMode ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <span>Modo Oscuro</span>
                  </>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
