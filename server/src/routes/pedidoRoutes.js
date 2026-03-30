import express from 'express';
import {
  crearPedido,
  getMisPedidos,
  getAllPedidos,
  updateEstadoPedido
} from '../controllers/pedidoController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Asumo que existe el middleware de Auth.

const router = express.Router();

// Ruta Base: /api/pedidos
router.route('/')
  .post(protect, crearPedido)
  .get(protect, admin, getAllPedidos);

router.route('/mis-pedidos').get(protect, getMisPedidos);

router.route('/:id/estado').put(protect, admin, updateEstadoPedido);

export default router;
