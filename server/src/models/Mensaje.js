import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  leido: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true // Esto automáticamente maneja createdAt y updatedAt
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

export default Mensaje;
