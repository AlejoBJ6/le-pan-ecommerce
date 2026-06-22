/**
 * mobbexService.js
 * Servicio para interactuar con la API REST de Mobbex.
 *
 * Flujo de pago con redirect:
 *  1. createCheckout()  → crea una sesión de pago y retorna la URL de Mobbex
 *  2. El frontend redirige al usuario a esa URL
 *  3. El usuario paga en la página de Mobbex
 *  4. Mobbex redirige de vuelta al return_url (success/failure/pending)
 *  5. Mobbex notifica al webhook el resultado final
 *
 * Documentación: https://mobbex.dev/checkout
 */

import axios from 'axios';
import mobbexConfig from '../config/mobbex.js';

/**
 * Headers requeridos por la API de Mobbex en todas las requests.
 */
const getMobbexHeaders = () => ({
  'x-api-key': mobbexConfig.apiKey,
  'x-access-token': mobbexConfig.accessToken,
  'x-lang': 'es',
  'cache-control': 'no-cache',
  'Content-Type': 'application/json',
});

/**
 * Crea una sesión de checkout en Mobbex.
 *
 * @param {string} pedidoId      - ID del pedido en nuestra DB (se usa como referencia)
 * @param {number} amount        - Monto total en ARS
 * @param {string} description   - Descripción del pedido (máx. 500 chars)
 * @param {string} returnUrl     - URL base del frontend para redirigir tras el pago
 *                                 (Mobbex añade ?status=... al final)
 * @param {string} webhookUrl    - URL pública del backend que recibirá la notificación
 * @returns {{ checkoutUrl: string, checkoutId: string }}
 */
const createCheckout = async (pedidoId, amount, description, returnUrl, webhookUrl) => {
  const body = {
    total: Number(amount),
    currency: 'ARS',
    reference: pedidoId.toString(),
    description: description.substring(0, 500),
    return_url: returnUrl,
    webhook: webhookUrl,
    // Mobbex usa estos campos opcionales para mostrar información en el checkout
    items: [
      {
        image: '',
        description: description.substring(0, 100),
        quantity: 1,
        total: Number(amount),
      },
    ],
  };

  const response = await axios.post(
    `${mobbexConfig.apiUrl}/p/checkout`,
    body,
    { headers: getMobbexHeaders() }
  );

  const data = response.data;

  // La API devuelve { result: true, data: { id, url, ... } }
  if (!data.result) {
    throw new Error(`Mobbex error: ${JSON.stringify(data)}`);
  }

  return {
    checkoutId: data.data?.id || data.id,
    checkoutUrl: data.data?.url || data.url,
  };
};

export { createCheckout };
