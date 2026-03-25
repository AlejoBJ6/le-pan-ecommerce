import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-curve">
      <div className="footer-content container">
        
        <div className="footer-social">
          <a href="#" className="social-icon instagram" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" className="social-icon facebook" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
        </div>

        <div className="footer-links">
          <Link to="#">Términos y condiciones</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="footer-brand">
          <img src="/images/logos/image-removebg-preview.png" alt="Lé Pan Logo" className="footer-logo" />
          <p className="footer-copy">© 2026 LÉ PAN. Todos los derechos reservados.</p>
          <p style={{ fontSize: '0.85rem', color: '#D4A373', marginTop: '4px', letterSpacing: '0.5px' }}>San Miguel de Tucumán, Argentina</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
