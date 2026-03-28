import mongoose from 'mongoose';

const comboConfigSchema = new mongoose.Schema({
  maxPrincipal: {
    type: Number,
    default: 1,
    min: 1,
  },
  maxComplemento: {
    type: Number,
    default: 1,
    min: 1,
  },
  tipoDescuento: {
    type: String,
    enum: ['porcentaje', 'fijo'],
    default: 'porcentaje'
  },
  descuento: {
    type: Number,
    default: 10,
    min: 0,
  },
  categoriasPrincipal: {
    type: [String],
    default: []
  },
  categoriasComplemento: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// Singleton pattern: only one config document ever exists
export default mongoose.model('ComboConfig', comboConfigSchema);
