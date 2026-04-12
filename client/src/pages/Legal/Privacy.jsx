import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Política de Privacidad</h1>
          <p className="legal-subtitle">Última actualización: Abril 2026</p>
        </div>

        <div className="legal-section">
          <h2>1. Responsable del Tratamiento</h2>
          <div className="legal-highlight-box">
            <p><strong>Razón Social:</strong> Lé Pan S.R.L.</p>
            <p><strong>Domicilio:</strong> San Miguel de Tucumán, Tucumán, Argentina.</p>
            <p><strong>Contacto:</strong> <a href="mailto:contacto@le-pan.com.ar">contacto@le-pan.com.ar</a></p>
          </div>
          <p style={{ marginTop: '16px' }}>
            El presente documento describe cómo Lé Pan recopila, utiliza y protege la información personal
            de los usuarios, en cumplimiento de la <strong>Ley 25.326 de Protección de los Datos Personales</strong>{' '}
            de la República Argentina y sus disposiciones complementarias.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Datos que Recopilamos</h2>
          <p>Al utilizar nuestro sitio podemos recopilar los siguientes datos:</p>
          <ul>
            <li><strong>Datos de registro:</strong> Nombre, apellido y dirección de correo electrónico al crear una cuenta.</li>
            <li><strong>Datos de entrega:</strong> Nombre completo, dirección postal, ciudad, provincia, código postal y teléfonos de contacto.</li>
            <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas y tiempo de permanencia (no identificables de forma personal).</li>
            <li><strong>Comprobantes de pago:</strong> Imágenes que usted carga voluntariamente para acreditar transferencias bancarias.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Finalidad del Tratamiento</h2>
          <p>Los datos personales recabados se utilizan exclusivamente para:</p>
          <ul>
            <li>Procesar y gestionar sus pedidos de compra.</li>
            <li>Coordinar la entrega de productos.</li>
            <li>Enviar confirmaciones de compra y notificaciones del estado de su pedido.</li>
            <li>Atender consultas y reclamos a través de nuestros canales de contacto.</li>
            <li>Mejorar la experiencia de navegación y el funcionamiento del sitio.</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            <strong>No vendemos, cedemos ni comercializamos</strong> sus datos personales a terceros sin su
            consentimiento explícito, salvo que sea exigido por obligación legal.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Protección de Datos</h2>
          <p>
            Implementamos medidas técnicas y organizativas para garantizar la seguridad de su información:
          </p>
          <ul>
            <li>Cifrado de datos en tránsito mediante <strong>SSL/TLS</strong>.</li>
            <li>Contraseñas almacenadas con hash seguro (<strong>bcrypt</strong>).</li>
            <li>Control de acceso basado en roles: sólo el administrador puede ver datos completos de pedidos.</li>
            <li>Rate limiting y protección contra ataques de fuerza bruta en los endpoints de autenticación.</li>
            <li>Imágenes almacenadas de forma segura en <strong>Cloudinary</strong>.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Uso de Cookies</h2>
          <p>
            Nuestro sitio utiliza <strong>localStorage</strong> y <strong>sessionStorage</strong> del
            navegador para mantener su sesión activa y recordar su carrito de compras. No utilizamos
            cookies de seguimiento publicitario de terceros.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Sus Derechos</h2>
          <p>
            En virtud de la Ley 25.326, usted tiene derecho a:
          </p>
          <ul>
            <li><strong>Acceder</strong> a los datos personales que obran en nuestra base de datos.</li>
            <li><strong>Rectificar</strong> datos inexactos o incompletos.</li>
            <li><strong>Suprimir</strong> sus datos cuando ya no sean necesarios para los fines del tratamiento.</li>
            <li><strong>Oponerse</strong> al tratamiento de sus datos en determinadas circunstancias.</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            Para ejercer cualquiera de estos derechos, escríbanos a{' '}
            <a href="mailto:contacto@le-pan.com.ar">contacto@le-pan.com.ar</a> indicando su nombre completo
            y el derecho que desea ejercer. Responderemos dentro del plazo legal establecido.
          </p>
          <div className="legal-highlight-box" style={{ marginTop: '16px' }}>
            <p>
              La Dirección Nacional de Protección de Datos Personales, Órgano de Control de la Ley N° 25.326,
              tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al
              incumplimiento de las normas sobre protección de datos personales.
            </p>
          </div>
        </div>

        <div className="legal-section">
          <h2>7. Retención de Datos</h2>
          <p>
            Los datos de pedidos se conservan por un período mínimo de <strong>5 años</strong> por
            obligaciones fiscales y comerciales vigentes en Argentina. Los datos de cuenta permanecen
            activos mientras la cuenta esté en uso. Puede solicitar la eliminación de su cuenta
            contactándonos directamente.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Cambios en esta Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier
            cambio significativo publicando la nueva política en esta página con la fecha de actualización.
          </p>
        </div>

        <div className="legal-contact-box">
          <h3>¿Preguntas sobre tu privacidad?</h3>
          <p>
            Comunicate con nosotros a través de nuestra{' '}
            <Link to="/contacto">página de contacto</Link> o escribinos a{' '}
            <a href="mailto:contacto@le-pan.com.ar">contacto@le-pan.com.ar</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
