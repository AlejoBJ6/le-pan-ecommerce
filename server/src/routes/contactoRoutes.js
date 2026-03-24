import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  crearMensaje,
  obtenerMensajes,
  marcarComoLeido,
  eliminarMensaje
} from '../controllers/contactoController.js';

const router = express.Router();

// Ruta pública para enviar los mensajes desde el formulario del cliente
router.post('/', crearMensaje);

// Rutas privadas para el admin
router.get('/', protect, admin, obtenerMensajes);
router.put('/:id/leido', protect, admin, marcarComoLeido);
router.delete('/:id', protect, admin, eliminarMensaje);

export default router;
