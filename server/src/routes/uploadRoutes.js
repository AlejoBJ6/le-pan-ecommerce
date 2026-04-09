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
  params: { folder: 'le-pan-ecommerce', allowedFormats: ['jpeg', 'png', 'jpg', 'webp'] },
});

// Storage para comprobantes de pago (invitados y usuarios)
const storageComprobantes = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'le-pan-comprobantes', allowedFormats: ['jpeg', 'png', 'jpg', 'webp', 'pdf'] },
});

const upload = multer({ storage });
const uploadComprobante = multer({ storage: storageComprobantes });
const router = express.Router();

// Ruta protegida: solo admins suben imágenes de productos
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'No se procesó ninguna imagen' });
  res.status(200).send({ message: 'Imagen subida exitosamente', imageUrl: req.file.path });
});

// Ruta pública: cualquiera (incluidos invitados) puede subir un comprobante de pago
router.post('/guest', uploadComprobante.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'No se procesó el archivo' });
  res.status(200).send({ message: 'Comprobante subido exitosamente', imageUrl: req.file.path });
});

export default router;
