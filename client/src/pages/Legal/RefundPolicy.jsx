import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Política de Devoluciones y Cambios</h1>
          <p className="legal-subtitle">Última actualización: Abril 2026</p>
        </div>

        <div className="legal-highlight-box" style={{ marginBottom: '40px' }}>
          <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>
            🛡️ Tu satisfacción es nuestra prioridad
          </p>
          <p>
            En Lé Pan queremos que estés 100% conforme con tu compra. Si algo no salió como esperabas,
            tenés <strong>10 días corridos</strong> a partir de la recepción del producto para contactarnos.
          </p>
        </div>

        <div className="legal-section">
          <h2>1. Derecho de Arrepentimiento (10 días)</h2>
          <p>
            De acuerdo a la <strong>Ley 24.240 de Defensa del Consumidor</strong>, contás con{' '}
            <strong>10 (diez) días corridos</strong> desde que recibís el producto para arrepentirte de
            tu compra <strong>sin necesidad de expresar causa</strong> y sin ningún costo adicional.
          </p>
          <p style={{ marginTop: '12px' }}>
            Para iniciar el proceso, utilizá el{' '}
            <Link to="/arrepentimiento">Botón de Arrepentimiento</Link> en nuestro sitio o contactanos a{' '}
            <a href="mailto:contacto@le-pan.com.ar">contacto@le-pan.com.ar</a>.
          </p>
          <p style={{ marginTop: '12px' }}>
            El producto debe ser devuelto en las mismas condiciones en que fue recibido, sin uso y en su
            empaque original. Los gastos de devolución corren por cuenta del vendedor en el caso de
            arrepentimiento dentro del plazo legal.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Devolución por Defecto o Error</h2>
          <p>
            Si el producto llega <strong>dañado, defectuoso o distinto</strong> al solicitado, se aplicará
            el siguiente proceso:
          </p>
          <ul>
            <li>Contactate con nosotros dentro de los <strong>48 horas</strong> de recibido el producto.</li>
            <li>Adjuntá fotos del producto y del embalaje en el correo o WhatsApp.</li>
            <li>Coordinaremos la reposición o devolución según corresponda, sin cargo alguno.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Garantía de Fábrica</h2>
          <p>
            Todos los productos de Lé Pan cuentan con <strong>12 meses de garantía de fábrica</strong>.
            Durante ese período, cubrimos defectos de fabricación y fallas técnicas que no sean
            producto de un uso inadecuado del equipo.
          </p>
          <p style={{ marginTop: '12px' }}>
            Para hacer valer la garantía, conservá tu comprobante de compra (correo de confirmación
            o número de pedido) y contactanos a{' '}
            <a href="mailto:contacto@le-pan.com.ar">contacto@le-pan.com.ar</a>.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Proceso de Reembolso</h2>
          <ul>
            <li>
              <strong>Mercado Pago:</strong> El reembolso se procesa directamente a través de la plataforma
              en un plazo de <strong>5 a 10 días hábiles</strong>.
            </li>
            <li>
              <strong>Transferencia Bancaria:</strong> La devolución se realiza por transferencia a la
              cuenta que nos indiques en un plazo de <strong>3 a 5 días hábiles</strong> desde la
              recepción del producto devuelto.
            </li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Productos No Elegibles para Devolución</h2>
          <ul>
            <li>Productos con daños causados por mal uso o accidentes.</li>
            <li>Productos con signos evidentes de uso que superen la prueba inicial.</li>
            <li>Pedidos personalizados fabricados a medida, salvo defecto de fábrica.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>6. Organismos de Defensa del Consumidor</h2>
          <p>
            Si tu reclamo no es resuelto satisfactoriamente, podés acudir a los organismos oficiales:
          </p>
          <ul>
            <li>
              <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noreferrer">
                Defensa del Consumidor — Argentina.gob.ar ↗
              </a>
            </li>
            <li>
              <a href="https://www.tucuman.gob.ar" target="_blank" rel="noreferrer">
                Dirección de Defensa del Consumidor de Tucumán ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="legal-contact-box">
          <h3>¿Necesitás iniciar una devolución?</h3>
          <p>
            Contactanos directamente por nuestra{' '}
            <Link to="/contacto">página de contacto</Link> o mediante el{' '}
            <Link to="/arrepentimiento">Botón de Arrepentimiento</Link>.<br />
            También podés escribirnos a{' '}
            <a href="mailto:contacto@le-pan.com.ar">contacto@le-pan.com.ar</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
