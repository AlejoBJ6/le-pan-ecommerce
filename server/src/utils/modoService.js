/**
 * modoService.js
 * Servicio para interactuar con la API REST de MODO Pagos.
 *
 * Flujo:
 *  1. getAccessToken()          → autentica y obtiene Bearer token (cacheado 50 min)
 *  2. createPaymentRequest()    → crea intención de pago, devuelve datos del QR
 *  3. getPaymentStatus()        → consulta el estado de un Payment Request
 */

import axios from 'axios';
import modoConfig from '../config/modo.js';

// ─── Cache simple del token (en memoria, se renueva antes de expirar) ──────
let _cachedToken = null;
let _tokenExpiry = 0;

/**
 * Obtiene un Bearer Token de MODO.
 * MODO usa Basic Auth (username:password) para obtener el token.
 * El token tiene una vida de ~60 minutos; cacheamos por 50 para ser conservadores.
 */
const getAccessToken = async () => {
  const now = Date.now();
  if (_cachedToken && now < _tokenExpiry) {
    return _cachedToken;
  }

  const response = await axios.post(
    `${modoConfig.baseUrl}/v1/auth/token`,
    {
      username: modoConfig.username,
      password: modoConfig.password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': modoConfig.userAgent,
      },
    }
  );

  const { access_token, expires_in } = response.data;
  _cachedToken = access_token;
  // Cacheamos con 10 minutos de margen antes de la expiración real
  _tokenExpiry = now + ((expires_in || 3600) - 600) * 1000;

  return _cachedToken;
};

/**
 * Crea un Payment Request en MODO.
 * Devuelve los datos necesarios para mostrar el QR al cliente.
 *
 * @param {string} pedidoId   - ID del pedido en nuestra DB (external_intention_id)
 * @param {number} amount     - Monto en ARS
 * @param {string} description - Descripción del pedido (máx. 100 chars)
 * @returns {{ payment_request_id, qr_data, deep_link, expiration }}
 */
const createPaymentRequest = async (pedidoId, amount, description) => {
  const token = await getAccessToken();

  const body = {
    description: description.substring(0, 100),
    amount: Number(amount),
    currency: 'ARS',
    cc_code: modoConfig.ccCode,
    processor_code: modoConfig.processorCode,
    store_id: modoConfig.storeId,
    external_intention_id: pedidoId.toString(),
  };

  const response = await axios.post(
    `${modoConfig.baseUrl}/v2/payment-requests/`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': modoConfig.userAgent,
      },
    }
  );

  const data = response.data;

  return {
    payment_request_id: data.payment_request_id || data.id,
    qr_data: data.qr?.data || data.qr_data || data.qr,
    deep_link: data.deep_link || null,
    expiration: data.expiration_date || null,
  };
};

/**
 * Consulta el estado actual de un Payment Request en MODO.
 *
 * Estados posibles:
 *  - 'CREATED'   → QR generado, esperando escaneo
 *  - 'IN_PROGRESS' → En proceso
 *  - 'APPROVED'  → Pago aprobado
 *  - 'REJECTED'  → Pago rechazado
 *  - 'EXPIRED'   → QR expirado
 *  - 'CANCELLED' → Cancelado
 *
 * @param {string} paymentRequestId
 * @returns {{ status, payment_request_id, amount, external_intention_id }}
 */
const getPaymentStatus = async (paymentRequestId) => {
  const token = await getAccessToken();

  const response = await axios.get(
    `${modoConfig.baseUrl}/v2/payment-requests/${paymentRequestId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': modoConfig.userAgent,
      },
    }
  );

  return response.data;
};

export { getAccessToken, createPaymentRequest, getPaymentStatus };
