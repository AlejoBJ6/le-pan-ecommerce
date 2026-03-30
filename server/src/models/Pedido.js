import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pedidosData: [ // Renamed from items to pedidosData or just items. Let's stick to items.
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Puede ser Producto o Combo
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true },
      esCombo: { type: Boolean, default: false },
      imagen: { type: String }
    }
  ],
  datosEntrega: {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    provincia: { type: String, required: true },
    ciudad: { type: String, required: true },
    direccion: { type: String, required: true },
    piso: { type: String, default: '' },
    cp: { type: String, required: true },
    notas: { type: String, default: '' },
    fechaEstimadaMin: { type: Date },
    fechaEstimadaMax: { type: Date }
  },
  totales: {
    subtotal: { type: Number, required: true },
    envio: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'transferencia', 'cuotas', 'mercado_pago'],
    required: true
  },
  estadoPago: {
    type: String,
    enum: ['Pendiente', 'Aprobado', 'Rechazado'],
    default: 'Pendiente'
  },
  estadoEntrega: {
    type: String,
    enum: ['Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'],
    default: 'Pendiente'
  }
}, {
  timestamps: true
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
export default Pedido;
