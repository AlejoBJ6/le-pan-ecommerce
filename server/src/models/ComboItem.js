import mongoose from 'mongoose';

// ComboItem es un subdocumento que se embebe dentro de Combo.
// Representa cada producto que el usuario elige para armar su combo.
const comboItemSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El producto del item es obligatorio'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
      default: 1,
    },
    precioUnitario: {
      type: Number,
      required: [true, 'El precio unitario al momento de crear el combo es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
  },
  {
    _id: false, // No genera un _id propio por ser subdocumento
  }
);

export default comboItemSchema;
