import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── RATE LIMITER ESTRICTO PARA AUTENTICACIÓN ──────────────────────────────────
// Máximo 10 intentos de login/registro por IP por hora
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Tu acceso está temporalmente bloqueado. Volvé a intentar en 1 hora.' },
  skipSuccessfulRequests: true, // No cuenta los intentos exitosos, solo los fallidos
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
