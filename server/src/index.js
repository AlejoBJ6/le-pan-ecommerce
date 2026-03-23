import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Modelos
import './models/Producto.js';
import './models/Combo.js';

// Rutas
import productoRoutes from './routes/productoRoutes.js';
import authRoutes from './routes/authRoutes.js';


// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

// Rutas base
app.get('/', (req, res) => {
  res.send('API de Le Pan funcionando correctamente');
});

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);

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
