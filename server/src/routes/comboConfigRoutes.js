import express from 'express';
import { obtenerConfig, actualizarConfig } from '../controllers/comboConfigController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', obtenerConfig);
router.put('/', protect, admin, actualizarConfig);

export default router;
