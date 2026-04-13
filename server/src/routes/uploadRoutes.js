import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage para imágenes de productos (admin)
const storage = new CloudinaryStorage({
  cloudinary,
  params: { 
    folder: 'le-pan-ecommerce', 
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp', 'mp4', 'webm', 'mov'],
    resource_type: 'auto'
  },
});

// Storage para comprobantes de pago (invitados y usuarios)
const storageComprobantes = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'le-pan-comprobantes', allowedFormats: ['jpeg', 'png', 'jpg', 'webp', 'pdf'] },
});

const upload = multer({ storage });
const uploadComprobante = multer({ storage: storageComprobantes });
const router = express.Router();

// Ruta protegida: solo admins suben imágenes o videos de productos
router.post('/', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Error al procesar subida:", err);
      if (err.message && err.message.toLowerCase().includes('size')) {
        return res.status(400).send({ message: 'El archivo es demasiado pesado. Intenta comprimirlo o elegir uno más corto.' });
      }
      return res.status(400).send({ message: `No se pudo subir: formato no soportado o archivo dañado (${err.message}).` });
    }
    if (!req.file) return res.status(400).send({ message: 'No se procesó ningún archivo multimedia.' });
    res.status(200).send({ message: 'Archivo multimedia subido exitosamente', imageUrl: req.file.path });
  });
});

// Ruta pública: cualquiera (incluidos invitados) puede subir un comprobante de pago
router.post('/guest', uploadComprobante.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'No se procesó el archivo' });
  res.status(200).send({ message: 'Comprobante subido exitosamente', imageUrl: req.file.path });
});

export default router;
