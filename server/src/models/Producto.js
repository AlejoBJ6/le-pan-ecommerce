import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    precioAnterior: {
      type: Number,
      default: 0,
      min: [0, 'El precio anterior no puede ser negativo'],
    },
    comision: {
      type: Number,
      default: 0,
      min: [0, 'La comisión no puede ser negativa'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
    },
    marca: {
      type: String,
      trim: true,
    },
    modelo: {
      type: String,
      trim: true,
    },
    imagenes: {
      type: [String], // Array de URLs de imágenes
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
    },
    productosIncluidos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    }],
    disponible: {
      type: Boolean,
      default: true,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    caracteristicas: [
      {
        nombre: { type: String, trim: true },
        valor: { type: String, trim: true },
      }
    ],
    eliminado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
