import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-curve">
      <div className="footer-content container">

        {/* ── BRAND ─────────────────────────────── */}
        <div className="footer-brand">
          <img src="/images/logos/image-removebg-preview.png" alt="Lé Pan Logo" className="footer-logo" />
          <p className="footer-copy">© 2026 LÉ PAN. Todos los derechos reservados.</p>
          <p className="footer-location">San Miguel de Tucumán, Argentina</p>

          {/* AFIP Data Fiscal placeholder */}
          <a
            href="http://qr.afip.gob.ar/?qr=placeholder"
            target="_blank"
            rel="noreferrer"
            className="footer-afip"
            title="Datos Fiscales (AFIP)"
          >
            <img
              src="https://www.afip.gob.ar/images/f960/DATAWEB.jpg"
              alt="Formulario 960/D - Data Fiscal AFIP"
              className="footer-afip-img"
              onError={(e) => {
                e.target.src = "https://static.afip.gob.ar/fe/foot/datos_fiscales.jpg";
              }}
            />
          </a>
        </div>

        {/* ── AYUDA ─────────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Ayuda</h4>
          <nav className="footer-nav">
            <Link to="/consultar-pedido">Consultar Pedido</Link>
            <Link to="/contacto">Contacto</Link>
            <Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link>
            <Link to="/devoluciones">Cambios y Devoluciones</Link>
          </nav>
        </div>

        {/* ── LEGAL ─────────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Legal</h4>
          <nav className="footer-nav">
            <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>
            <Link to="/politica-de-privacidad">Política de Privacidad</Link>
            <Link to="/devoluciones">Política de Devoluciones</Link>
            <a
              href="https://www.argentina.gob.ar/produccion/defensadelconsumidor"
              target="_blank"
              rel="noreferrer"
            >
              Defensa del Consumidor ↗
            </a>
          </nav>
        </div>

        {/* ── REDES ─────────────────────────────── */}
        <div className="footer-social-col">
          <h4 className="footer-col-title">Seguinos</h4>
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
        </div>

      </div>
    </footer>
  );
};

export default Footer;
