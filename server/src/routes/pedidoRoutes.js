import express from 'express';
import {
  crearPedido,
  getMisPedidos,
  getAllPedidos,
  updateEstadoPedido,
  webhookMercadoPago,
  subirComprobante,
  trackPedido
} from '../controllers/pedidoController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta Base: /api/pedidos
// POST: optionalProtect → usuarios logueados asocian el pedido a su cuenta, invitados crean pedido sin cuenta
// GET: solo admins
router.route('/')
  .post(optionalProtect, crearPedido)
  .get(protect, admin, getAllPedidos);

// Webhook de Mercado Pago (sin protección — lo llama MP directamente)
router.post('/webhook', webhookMercadoPago);

// Redirect local para desarrollo con MP
import { successRedirect } from '../controllers/pedidoController.js';
router.get('/redirect/success', successRedirect);

// Ruta para consulta de pedido (Track) - Público
router.post('/track', trackPedido);

router.route('/mis-pedidos').get(protect, getMisPedidos);

router.route('/:id/estado').put(protect, admin, updateEstadoPedido);
// subirComprobante es público: cualquiera que tenga el ID del pedido puede subir el comprobante
router.route('/:id/comprobante').put(subirComprobante);

export default router;
