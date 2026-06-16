/**
 * Configuración centralizada de MODO Pagos.
 *
 * MODO requiere un gateway subyacente (Decidir/Payway, Fiserv, Getnet, etc.)
 * Documentación: https://merchants.playdigital.com.ar/docs
 *
 * Variables de entorno requeridas:
 *   MODO_ENV          → 'preprod' | 'prod'   (default: 'preprod')
 *   MODO_USERNAME     → Username provisto por MODO tras el alta
 *   MODO_PASSWORD     → Password provisto por MODO tras el alta
 *   MODO_STORE_ID     → Store ID provisto por MODO
 *   MODO_PROCESSOR_CODE → Código del gateway (ej: "DECIDIR_PLUS")
 *   MODO_CC_CODE      → Código de financiación (ej: "AHO")
 */

const MODO_URLS = {
  preprod: 'https://merchants.preprod.playdigital.com.ar',
  prod: 'https://merchants.playdigital.com.ar',
};

const env = (process.env.MODO_ENV || 'preprod').trim();

const modoConfig = {
  baseUrl: MODO_URLS[env] || MODO_URLS.preprod,
  username: process.env.MODO_USERNAME || 'PLACEHOLDER_USERNAME',
  password: process.env.MODO_PASSWORD || 'PLACEHOLDER_PASSWORD',
  storeId: process.env.MODO_STORE_ID || 'PLACEHOLDER_STORE_ID',
  processorCode: process.env.MODO_PROCESSOR_CODE || 'PLACEHOLDER_PROCESSOR',
  ccCode: process.env.MODO_CC_CODE || 'AHO',
  // Header obligatorio en todas las requests a MODO
  userAgent: 'LePan-Ecommerce',
  // Tiempo de expiración del QR en segundos (MODO default: 300 = 5 min)
  qrExpirationSeconds: 300,
};

export default modoConfig;
