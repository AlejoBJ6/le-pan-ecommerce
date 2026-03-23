import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/productoController.js';

const router = express.Router();

router.route('/').get(obtenerProductos).post(protect, admin, crearProducto);
router
  .route('/:id')
  .get(obtenerProductoPorId)
  .put(protect, admin, actualizarProducto)
  .delete(protect, admin, eliminarProducto);

export default router;
