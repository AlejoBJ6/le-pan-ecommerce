import mongoose from 'mongoose';

const comboConfigSchema = new mongoose.Schema({
  maxPrincipal: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  maxComplemento: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  descuento: {
    type: Number,
    default: 10,
    min: 0,
    max: 100,
  },
}, { timestamps: true });

// Singleton pattern: only one config document ever exists
export default mongoose.model('ComboConfig', comboConfigSchema);
