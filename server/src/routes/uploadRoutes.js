import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de Multer Storage hacia Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'le-pan-ecommerce', // Nombre de la carpeta en Cloudinary
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// Ruta de subida. Solo administradores pueden subir fotos.
// Espera un campo de formulario que se llame 'image'
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No se procesó ninguna imagen' });
  }

  // req.file.path contiene la URL pública asignada por Cloudinary
  res.status(200).send({
    message: 'Imagen subida exitosamente',
    imageUrl: req.file.path,
  });
});

export default router;
