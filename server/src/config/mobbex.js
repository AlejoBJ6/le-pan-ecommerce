/**
 * Configuración centralizada de Mobbex.
 *
 * Mobbex es una pasarela de pago argentina que soporta tarjetas,
 * transferencias, billeteras digitales (Ualá, Naranja X, etc.) y más.
 * Documentación: https://mobbex.dev/
 *
 * Variables de entorno requeridas:
 *   MOBBEX_API_KEY      → API Key del portal de desarrolladores de Mobbex
 *   MOBBEX_ACCESS_TOKEN → Access Token del portal de desarrolladores de Mobbex
 *
 * Credenciales de prueba (cuenta DEMO):
 *   MOBBEX_API_KEY      = zJ8LFTBX6Ba8D611e9io13fDZAwj0QmKO1Hn1yIj
 *   MOBBEX_ACCESS_TOKEN = d31f0721-2f85-44e7-bcc6-15e19d1a53cc
 */

const mobbexConfig = {
  apiKey: process.env.MOBBEX_API_KEY || '',
  accessToken: process.env.MOBBEX_ACCESS_TOKEN || '',
  apiUrl: 'https://api.mobbex.com',
};

export default mobbexConfig;
