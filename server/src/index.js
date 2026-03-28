import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Modelos
import './models/Producto.js';
import './models/Combo.js';
import './models/Categoria.js';
import './models/ComboConfig.js';

// Rutas
import productoRoutes from './routes/productoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactoRoutes from './routes/contactoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import comboConfigRoutes from './routes/comboConfigRoutes.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── 1. PROTECCIÓN DE CABECERAS (Helmet) ──────────────────────────────────────
// Oculta tecnologías usadas y agrega cabeceras de seguridad estándar
app.use(helmet());

// ── 2. CORS RESTRICTIVO ───────────────────────────────────────────────────────
// Solo acepta peticiones del dominio real + localhost en desarrollo
const allowedOrigins = [
  'https://www.le-pan.com.ar',
  'https://le-pan.com.ar',
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (ej. Postman, curl) solo en desarrollo
    if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origen no permitido → ${origin}`));
  },
  credentials: true,
}));

// ── 3. RATE LIMITING GENERAL ──────────────────────────────────────────────────
// Máximo 100 peticiones por IP cada 15 minutos (protege toda la API)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas peticiones desde esta IP. Intentá de nuevo en 15 minutos.' },
});
app.use('/api', generalLimiter);

// ── 4. SANITIZACIÓN (compatible con Express 5) ───────────────────────────────
// Elimina claves que empiezan con '$' o contienen '.' del body (NoSQL Injection)
const sanitizeBody = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeBody(obj[key]);
    }
  }
};
// Limpia etiquetas HTML del body para prevenir XSS
const stripHtml = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(/<[^>]*>/g, '');
    } else if (typeof obj[key] === 'object') {
      stripHtml(obj[key]);
    }
  }
};
app.use((req, _res, next) => {
  if (req.body) { sanitizeBody(req.body); stripHtml(req.body); }
  next();
});

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limita el tamaño del body también


// Rutas base
app.get('/', (req, res) => {
  res.send('API de Le Pan funcionando correctamente');
});

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/combo-config', comboConfigRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    // Iniciar servidor solo si la DB conecta
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error.message);
  });
