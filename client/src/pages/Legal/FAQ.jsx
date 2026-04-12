import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

const faqs = [
  {
    pregunta: '¿Cómo puedo hacer un pedido?',
    respuesta: 'Navegá por nuestro catálogo, agregá el producto que querés a tu carrito y seguí los pasos del checkout. Podés comprar como invitado o creando una cuenta para ver tu historial.',
  },
  {
    pregunta: '¿Cuáles son los métodos de pago disponibles?',
    respuesta: 'Aceptamos pagos a través de Mercado Pago (tarjetas de crédito/débito, dinero en cuenta MP, Pago Fácil, Rapipago) y transferencia bancaria directa. Para transferencias, tenés 48 horas para acreditar el pago.',
  },
  {
    pregunta: '¿Cómo funciona el envío?',
    respuesta: 'El envío es GRATIS para todo el país. Una vez confirmado tu pago, nos comunicaremos con vos por WhatsApp para coordinar el día y horario de entrega según tu zona.',
  },
  {
    pregunta: '¿Puedo armar un combo personalizado?',
    respuesta: 'Sí. Desde la sección "Arma tu Combo" podés seleccionar un producto principal y uno o varios complementos para armar tu combo a medida con un precio especial.',
  },
  {
    pregunta: '¿Qué hago si me arrepiento de mi compra?',
    respuesta: 'Tenés 10 días corridos desde que recibís el producto para arrepentirte de tu compra sin costo ni necesidad de dar explicaciones. Usá el Botón de Arrepentimiento en nuestro sitio o escribinos a contacto@le-pan.com.ar.',
  },
  {
    pregunta: '¿Los productos tienen garantía?',
    respuesta: 'Sí. Todos nuestros productos tienen 12 meses de garantía de fábrica contra defectos de fabricación.',
  },
  {
    pregunta: '¿Cómo puedo consultar el estado de mi pedido?',
    respuesta: 'Desde la sección "Consultar Pedido" en el pie de página podés ingresar tu número de pedido y correo para ver el estado actualizado. Si tenés cuenta, también lo podés ver desde "Mi Perfil".',
  },
  {
    pregunta: '¿Mis datos están seguros?',
    respuesta: 'Absolutamente. Usamos cifrado SSL en todas las comunicaciones, las contraseñas se almacenan con hash seguro y nunca compartimos tus datos personales con terceros sin tu consentimiento.',
  },
  {
    pregunta: '¿Puedo modificar o cancelar un pedido?',
    respuesta: 'Podés solicitar la cancelación dentro de las 24 horas de realizado el pedido contactándonos por correo o WhatsApp. Una vez que el pedido entró en proceso de preparación no es posible modificarlo.',
  },
  {
    pregunta: '¿Dónde están ubicados?',
    respuesta: 'Somos una empresa con sede en San Miguel de Tucumán, Argentina, y enviamos a todo el país.',
  },
];

const FaqItem = ({ pregunta, respuesta }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className={`faq-question ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        {pregunta}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq-answer">{respuesta}</div>}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Preguntas Frecuentes</h1>
          <p className="legal-subtitle">Todo lo que necesitás saber antes de comprar</p>
        </div>

        <div style={{ marginBottom: '48px' }}>
          {faqs.map((faq, idx) => (
            <FaqItem key={idx} pregunta={faq.pregunta} respuesta={faq.respuesta} />
          ))}
        </div>

        <div className="legal-contact-box">
          <h3>¿No encontraste tu respuesta?</h3>
          <p>
            Escribinos a través de nuestra{' '}
            <Link to="/contacto">página de contacto</Link> o directamente a{' '}
            <a href="mailto:contacto@le-pan.com.ar">contacto@le-pan.com.ar</a>.{' '}
            Respondemos en menos de 24 horas hábiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
