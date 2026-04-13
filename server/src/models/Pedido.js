import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null   // null para pedidos de invitados
  },
  pedidosData: [ // Renamed from items to pedidosData or just items. Let's stick to items.
    {
      productoId: { type: mongoose.Schema.Types.Mixed }, // Mixed: acepta ObjectId o string (ej: combos dinámicos)
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true },
      comision: { type: Number, default: 0 },
      esCombo: { type: Boolean, default: false },
      imagen: { type: String },
      // Para combos dinámicos, guardamos los productos elegidos
      productosSeleccionados: [
        {
          id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
          cantidad: { type: Number, default: 1 },
          nombre: { type: String }
        }
      ]
    }
  ],
  datosEntrega: {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    telefonoAlternativo: { type: String, default: '' },
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
  },
  stockDescontado: {
    type: Boolean,
    default: false
  },
  comprobanteTransferencia: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
export default Pedido;
