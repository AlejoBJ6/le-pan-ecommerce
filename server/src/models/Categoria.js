import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
