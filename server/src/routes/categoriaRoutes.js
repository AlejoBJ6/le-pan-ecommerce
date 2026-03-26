import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  obtenerCategorias,
  crearCategoria,
  eliminarCategoria,
} from '../controllers/categoriaController.js';

const router = express.Router();

router.route('/').get(obtenerCategorias).post(protect, admin, crearCategoria);
router.route('/:id').delete(protect, admin, eliminarCategoria);

export default router;
