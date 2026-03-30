import Pedido from '../models/Pedido.js';
import { MercadoPagoConfig, Preference } from 'mercadopago';


// @desc    Crear un nuevo pedido
// @route   POST /api/pedidos
// @access  Privado (Cliente)
export const crearPedido = async (req, res) => {
  try {
    const { items, datosEntrega, totales, metodoPago } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No hay productos en el pedido' });
    }

    // Calcula fechas estimadas
    // Si es CABA/GBA (Provincia Buenos Aires / Capital Federal) -> 2-3 días extra
    // Si es Interior -> 5-7 días extra
    const prov = datosEntrega.provincia.toLowerCase();
    const esAMBA = prov.includes('buenos aires') || prov.includes('capital federal') || prov.includes('caba');
    
    // Hoy
    const minDays = esAMBA ? 2 : 5;
    const maxDays = esAMBA ? 3 : 7;
    
    const fechaMin = new Date();
    fechaMin.setDate(fechaMin.getDate() + minDays);
    const fechaMax = new Date();
    fechaMax.setDate(fechaMax.getDate() + maxDays);

    datosEntrega.fechaEstimadaMin = fechaMin;
    datosEntrega.fechaEstimadaMax = fechaMax;

    // TODO: Aquí podrías validar que los totales que envía el front concuerden con los precios reales de los items en base de datos.
    // Por simplicidad, confiaremos en el payload por ahora asumiendo que el cliente es honesto.
    // El envío es siempre 0.
    totales.envio = 0;

    const pedido = new Pedido({
      user: req.user._id, // Viene del middleware de auth
      pedidosData: items,
      datosEntrega,
      totales,
      metodoPago,
      estadoPago: 'Pendiente', // Asumido pendiente hasta cobrar (o si Mercadopago informa OK)
      estadoEntrega: 'Pendiente'
    });

    const createdPedido = await pedido.save();

    let initPoint = null;

    if (metodoPago === 'mercado_pago') {
       try {
         const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-123' });
         const preference = new Preference(client);
         const body = {
           items: items.map(item => ({
             id: item.productoId ? item.productoId.toString() : 'item',
             title: item.nombre,
             quantity: Number(item.cantidad),
             unit_price: Number(item.precio),
             currency_id: 'ARS'
           })),
           payer: {
             name: datosEntrega.nombre || '',
             surname: datosEntrega.apellido || '',
             email: datosEntrega.email
           },
           back_urls: {
             success: ((process.env.FRONTEND_URL || '').trim() || 'http://localhost:5173') + '/checkout-success',
             failure: ((process.env.FRONTEND_URL || '').trim() || 'http://localhost:5173') + '/checkout-failure',
             pending: ((process.env.FRONTEND_URL || '').trim() || 'http://localhost:5173') + '/checkout-pending'
           },
           auto_return: 'approved',
           external_reference: createdPedido._id.toString()
         };

         console.log('Sending Preference to MP:', JSON.stringify(body, null, 2));

         const response = await preference.create({ body });
         initPoint = response.init_point; // URL para redirigir al usuario a pagar
       } catch (mpError) {
         console.error('Error al generar preferencia Mercado Pago:', mpError);
       }
    }

    const pedidoResponse = createdPedido.toObject();
    if (initPoint) {
      pedidoResponse.init_point = initPoint;
    }

    res.status(201).json(pedidoResponse);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error en el servidor al crear el pedido' });
  }
};

// @desc    Obtener los pedidos del usuario autenticado
// @route   GET /api/pedidos/mis-pedidos
// @access  Privado (Cliente)
export const getMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error('Error fetching mis pedidos:', error);
    res.status(500).json({ message: 'Error obteniendo tus pedidos' });
  }
};

// @desc    Obtener todos los pedidos
// @route   GET /api/pedidos
// @access  Privado (Admin)
export const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({}).populate('user', 'id nombre email').sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error('Error fetching todos los pedidos:', error);
    res.status(500).json({ message: 'Error del servidor obteniendo pedidos' });
  }
};

// @desc    Actualizar estado de entrega del pedido
// @route   PUT /api/pedidos/:id/estado
// @access  Privado (Admin)
export const updateEstadoPedido = async (req, res) => {
  try {
    const { estadoEntrega, estadoPago } = req.body;
    const pedido = await Pedido.findById(req.params.id);

    if (pedido) {
      if (estadoEntrega) pedido.estadoEntrega = estadoEntrega;
      if (estadoPago) pedido.estadoPago = estadoPago;

      const updatedPedido = await pedido.save();
      res.json(updatedPedido);
    } else {
      res.status(404).json({ message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error('Error updating pedido:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar pedido' });
  }
};
