const BRAND_COLOR_PRIMARY = '#c89f53';
const BRAND_COLOR_DARK = '#111111';
const BRAND_COLOR_CARD = '#1c1c1c';
const BRAND_TEXT = '#f0f0f0';

const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p);

const generateItemsList = (pedidosData) => {
  return pedidosData.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #333; color: ${BRAND_TEXT};">${item.nombre} <br><small style="color: #999;">x${item.cantidad}</small></td>
      <td style="padding: 10px; border-bottom: 1px solid #333; color: ${BRAND_TEXT}; text-align: right;">${formatPrice((item.precio || item.precioFinal || 0) * item.cantidad)}</td>
    </tr>
  `).join('');
};

const baseHtmlTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: ${BRAND_TEXT};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLOR_DARK}; border: 1px solid #333; border-radius: 12px; overflow: hidden; max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 20px; background-color: ${BRAND_COLOR_CARD}; border-bottom: 2px solid ${BRAND_COLOR_PRIMARY};">
              <h1 style="margin: 0; color: ${BRAND_COLOR_PRIMARY}; font-size: 28px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">Lé Pan</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px; background-color: ${BRAND_COLOR_CARD}; border-top: 1px solid #333;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                Este es un correo automático, por favor no respondas a esta dirección.<br>
                Si tienes dudas, contáctanos por WhatsApp.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getTransferenciaEmailHtml = (pedido) => {
  const entrega = pedido.datosEntrega || {};
  const orderNum = pedido._id ? pedido._id.toString().slice(-6).toUpperCase() : '';
  const total = pedido.totales?.total || 0;
  
  const content = `
    <h2 style="color: ${BRAND_TEXT}; font-size: 22px; margin-top: 0;">¡Hola ${entrega.nombre}!</h2>
    <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
      Gracias por elegir Lé Pan. Hemos recibido tu pedido y está a la espera del pago por transferencia bancaria.
    </p>
    
    <div style="background-color: ${BRAND_COLOR_CARD}; border: 1px solid ${BRAND_COLOR_PRIMARY}; border-radius: 8px; padding: 20px; margin: 30px 0;">
      <h3 style="color: ${BRAND_COLOR_PRIMARY}; margin-top: 0; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px;">Datos Bancarios</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 15px;">
        <tr>
          <td style="padding: 6px 0; color: #aaa;">Banco</td>
          <td style="padding: 6px 0; color: ${BRAND_TEXT}; text-align: right;"><strong>Banco Galicia</strong></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #aaa;">Titular</td>
          <td style="padding: 6px 0; color: ${BRAND_TEXT}; text-align: right;"><strong>Le Pan S.R.L.</strong></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #aaa;">CBU</td>
          <td style="padding: 6px 0; color: ${BRAND_TEXT}; text-align: right;"><strong>0070999830004177123456</strong></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #aaa;">Alias</td>
          <td style="padding: 6px 0; color: ${BRAND_TEXT}; text-align: right;"><strong>LEPAN.PAGO</strong></td>
        </tr>
      </table>
    </div>

    <p style="color: #cccccc; font-size: 15px; line-height: 1.6; text-align: center;">
      Una vez realizada la transferencia, podés subir el comprobante en tu Perfil o desde la sección "Consultar Pedido" con tu número de orden: <strong style="color: ${BRAND_COLOR_PRIMARY};">${orderNum}</strong>.
    </p>

    <h3 style="color: ${BRAND_TEXT}; margin-top: 40px; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px;">Resumen del Pedido #${orderNum}</h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 15px; margin-bottom: 20px;">
      ${generateItemsList(pedido.pedidosData)}
      <tr>
        <td style="padding: 15px 10px; color: ${BRAND_TEXT}; font-weight: bold; text-align: right;">Total a Pagar</td>
        <td style="padding: 15px 10px; color: ${BRAND_COLOR_PRIMARY}; font-weight: bold; text-align: right; font-size: 18px;">${formatPrice(total)}</td>
      </tr>
    </table>
  `;

  return baseHtmlTemplate(`Confirmación de Pedido #${orderNum} - Lé Pan`, content);
};

export const getPagoAprobadoEmailHtml = (pedido) => {
  const entrega = pedido.datosEntrega || {};
  const orderNum = pedido._id ? pedido._id.toString().slice(-6).toUpperCase() : '';
  const isMP = pedido.metodoPago === 'mercado_pago';
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: #2e7d32; display: inline-block; padding: 15px; border-radius: 50%; margin-bottom: 20px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 style="color: #4caf50; font-size: 26px; margin: 0;">¡Pago Confirmado!</h2>
    </div>

    <p style="color: #cccccc; font-size: 16px; line-height: 1.6; text-align: center;">
      ¡Hola ${entrega.nombre}! Hemos recibido tu pago de forma exitosa y tu pedido #${orderNum} ya está en preparación.
    </p>
    
    <div style="background-color: ${BRAND_COLOR_CARD}; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
      <p style="color: ${BRAND_TEXT}; font-size: 16px; margin-top: 0;">
        Recuerda que para coordinar el día y horario de entrega de tu compra, es necesario que nos contactes por WhatsApp.
      </p>
      <a href="https://wa.me/5491100000000" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 8px; margin-top: 15px; font-size: 16px;">
        Coordinar entrega por WhatsApp
      </a>
    </div>

    <h3 style="color: ${BRAND_TEXT}; margin-top: 40px; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px;">Detalle de la compra</h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 15px; margin-bottom: 20px;">
      ${generateItemsList(pedido.pedidosData)}
    </table>
  `;

  return baseHtmlTemplate(`Pago Confirmado #${orderNum} - Lé Pan`, content);
};
