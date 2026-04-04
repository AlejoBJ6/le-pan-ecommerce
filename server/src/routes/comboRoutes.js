import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  obtenerCombos,
  obtenerComboPorId,
  crearCombo,
  actualizarCombo,
  eliminarCombo,
} from '../controllers/comboController.js';

const router = express.Router();

router.route('/')
  .get(obtenerCombos)
  .post(protect, admin, crearCombo);

router.route('/:id')
  .get(obtenerComboPorId)
  .put(protect, admin, actualizarCombo)
  .delete(protect, admin, eliminarCombo);

export default router;
