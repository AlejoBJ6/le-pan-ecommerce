import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Términos y Condiciones</h1>
          <p className="legal-subtitle">Última actualización: Abril 2026</p>
        </div>

        <div className="legal-section">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web <strong>le-pan.com.ar</strong> y realizar compras en él, usted
            acepta cumplir y quedar obligado por los presentes Términos y Condiciones. Si no está de acuerdo
            con alguna parte de estos términos, le solicitamos que no utilice el sitio.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Información del Vendedor</h2>
          <div className="legal-highlight-box">
            <p><strong>Razón Social:</strong> Lé Pan S.R.L.</p>
            <p><strong>Domicilio Comercial:</strong> San Miguel de Tucumán, Tucumán, Argentina.</p>
            <p><strong>Correo de Contacto:</strong> contacto@le-pan.com.ar</p>
          </div>
        </div>

        <div className="legal-section">
          <h2>3. Descripción del Servicio</h2>
          <p>
            Lé Pan es una plataforma de comercio electrónico dedicada a la venta de maquinaria gastronómica
            y panificadora. Los productos ofrecidos en el sitio están sujetos a disponibilidad de stock.
            Nos reservamos el derecho de modificar, discontinuar o limitar la cantidad de cualquier producto
            en cualquier momento sin previo aviso.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Precios y Facturación</h2>
          <p>
            Todos los precios están expresados en pesos argentinos (ARS) e incluyen los impuestos
            correspondientes según la legislación vigente. Los precios pueden ser modificados sin previo
            aviso. El precio válido para su compra es el vigente al momento de confirmar el pedido.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Proceso de Compra</h2>
          <ul>
            <li>Seleccione el/los producto(s) y agréguelos al carrito.</li>
            <li>Complete el formulario con sus datos de entrega.</li>
            <li>Elija su método de pago (Mercado Pago o Transferencia Bancaria).</li>
            <li>Al confirmar, recibirá un número de pedido y un correo de confirmación.</li>
            <li>Para transferencias, tiene <strong>48 horas</strong> para acreditar el pago; de lo contrario el pedido será cancelado automáticamente.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>6. Envíos y Entrega</h2>
          <p>
            Los envíos se coordinan de forma personalizada con cada cliente a través de WhatsApp, una vez
            confirmado el pago. Los plazos de entrega varían según la ubicación geográfica. Lé Pan no asume
            responsabilidad por demoras ajenas a su operación (transportistas, fuerza mayor, etc.).
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Derecho de Arrepentimiento</h2>
          <p>
            De conformidad con la <strong>Ley 24.240 de Defensa del Consumidor</strong> y la{' '}
            <strong>Resolución 424/2020</strong>, el consumidor tiene derecho a revocar la aceptación durante
            un plazo de <strong>10 (diez) días corridos</strong> contados desde la entrega del bien o desde
            la celebración del contrato de servicios, sin responsabilidad alguna y sin necesidad de
            expresar causa.
          </p>
          <p>
            Para ejercer este derecho, el consumidor deberá comunicarse a través del{' '}
            <Link to="/arrepentimiento">Botón de Arrepentimiento</Link> disponible en el sitio, o mediante
            correo electrónico a contacto@le-pan.com.ar.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Propiedad Intelectual</h2>
          <p>
            Todo el contenido publicado en este sitio — incluyendo textos, imágenes, logos, diseños y código
            — es propiedad exclusiva de Lé Pan S.R.L. o de sus licenciantes. Queda prohibida su reproducción
            total o parcial sin autorización expresa por escrito.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Modificaciones</h2>
          <p>
            Lé Pan se reserva el derecho de actualizar estos Términos y Condiciones en cualquier momento.
            Los cambios serán efectivos desde su publicación en el sitio. El uso continued del sitio
            implica la aceptación de los términos vigentes.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Legislación Aplicable</h2>
          <p>
            Estas condiciones se rigen por las leyes de la República Argentina. Ante cualquier controversia
            que no pueda resolverse amistosamente, las partes se someten a la jurisdicción de los Tribunales
            Ordinarios de la Ciudad de San Miguel de Tucumán, con renuncia expresa a cualquier otro fuero.
          </p>
        </div>

        <div className="legal-contact-box">
          <h3>¿Tenés dudas sobre estos Términos?</h3>
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

export default Terms;
