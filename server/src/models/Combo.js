import mongoose from 'mongoose';
import comboItemSchema from './ComboItem.js';

const comboSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del combo es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    items: {
      type: [comboItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'El combo debe tener al menos un producto',
      },
    },
    // Precio final del combo (puede tener descuento sobre la suma de items)
    precioFinal: {
      type: Number,
      required: [true, 'El precio final del combo es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    descuento: {
      type: Number,
      default: 0,
      min: [0, 'El descuento no puede ser negativo'],
      max: [100, 'El descuento no puede superar el 100%'],
    },
    imagenes: {
      type: [String],
      default: [],
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: precio total sin descuento (suma de items)
comboSchema.virtual('precioSinDescuento').get(function () {
  return this.items.reduce((total, item) => {
    return total + item.precioUnitario * item.cantidad;
  }, 0);
});

const Combo = mongoose.model('Combo', comboSchema);

export default Combo;
