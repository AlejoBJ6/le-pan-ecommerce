import express from 'express';
import {
  crearPedido,
  getMisPedidos,
  getAllPedidos,
  updateEstadoPedido,
  webhookMercadoPago,
  subirComprobante
} from '../controllers/pedidoController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Asumo que existe el middleware de Auth.

const router = express.Router();

// Ruta Base: /api/pedidos
router.route('/')
  .post(protect, crearPedido)
  .get(protect, admin, getAllPedidos);

// Esta ruta va sin proteger porque Mercado Pago la llama por detrás
router.post('/webhook', webhookMercadoPago);

router.route('/mis-pedidos').get(protect, getMisPedidos);

router.route('/:id/estado').put(protect, admin, updateEstadoPedido);
router.route('/:id/comprobante').put(protect, subirComprobante);

export default router;
