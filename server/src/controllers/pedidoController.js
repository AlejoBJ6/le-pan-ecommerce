import Pedido from '../models/Pedido.js';
import Producto from '../models/Producto.js';
import Combo from '../models/Combo.js';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import sendEmail from '../utils/sendEmail.js';
import { getTransferenciaEmailHtml, getPagoAprobadoEmailHtml, getEnCaminoEmailHtml } from '../utils/emailTemplates.js';

/**
 * Helper para descontar stock de forma atómica y segura.
 * Se encarga de productos individuales y de desglosar combos.
 */
const descontarStockPedido = async (pedido) => {
  if (pedido.stockDescontado) return;

  // 1. Recolectar todos los productos a descontar (desglosando combos si aplica)
  const aDescontar = [];
  for (const item of pedido.pedidosData) {
    // A. Si es un combo dinámico (tiene productosSeleccionados), los usamos directamente
    if (item.productosSeleccionados && item.productosSeleccionados.length > 0) {
      for (const seleccionado of item.productosSeleccionados) {
        aDescontar.push({
          id: seleccionado.id,
          cantidad: Number(item.cantidad) * (seleccionado.cantidad || 1),
          nombre: seleccionado.nombre
        });
      }
      continue; // Saltamos a la siguiente iteración porque ya procesamos este item
    }

    // B. Si no es dinámico, intentar buscar en Producto (catálogo normal o combo de admin antiguo)
    let prod = await Producto.findById(item.productoId).populate('productosIncluidos');
    
    if (prod) {
      if (prod.categoria === 'Combos' && prod.productosIncluidos?.length > 0) {
        for (const incProd of prod.productosIncluidos) {
          aDescontar.push({
            id: incProd._id,
            cantidad: Number(item.cantidad),
            nombre: incProd.nombre
          });
        }
      } else {
        aDescontar.push({
          id: item.productoId,
          cantidad: Number(item.cantidad),
          nombre: item.nombre
        });
      }
    } else {
      // C. Si no es un producto, buscar en la nueva colección de Combos de admin
      const combo = await Combo.findById(item.productoId).populate('items.producto');
      if (combo && combo.items?.length > 0) {
        for (const comboItem of combo.items) {
          if (comboItem.producto) {
            aDescontar.push({
              id: comboItem.producto._id,
              cantidad: Number(item.cantidad) * comboItem.cantidad,
              nombre: comboItem.producto.nombre
            });
          }
        }
      }
    }
  }

  // 2. Verificar disponibilidad de stock para TODOS antes de empezar a descontar
  for (const item of aDescontar) {
    const p = await Producto.findById(item.id);
    if (!p || p.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para "${item.nombre}". Disponible: ${p?.stock || 0}, Requerido: ${item.cantidad}`);
    }
  }

  // 3. Aplicar descuentos atómicamente ($inc negativo)
  for (const item of aDescontar) {
    const result = await Producto.updateOne(
      { _id: item.id, stock: { $gte: item.cantidad } },
      { $inc: { stock: -item.cantidad } }
    );

    if (result.modifiedCount === 0) {
      throw new Error(`Error de concurrencia al descontar "${item.nombre}". Intente nuevamente.`);
    }

    // Si el stock llega a 0, marcar como no disponible
    const pActualizado = await Producto.findById(item.id);
    if (pActualizado && pActualizado.stock === 0) {
      pActualizado.disponible = false;
      await pActualizado.save();
    }
  }

  // 4. Marcar pedido como stock descontado para evitar duplicados
  pedido.stockDescontado = true;
};

/**
 * Helper para reponer stock de forma atómica y segura.
 * Se invoca cuando un pedido pasa de Aprobado a Pendiente/Rechazado/Cancelado.
 */
const reponerStockPedido = async (pedido) => {
  if (!pedido.stockDescontado) return;

  const aReponer = [];
  for (const item of pedido.pedidosData) {
    // A. Si es un combo dinámico
    if (item.productosSeleccionados && item.productosSeleccionados.length > 0) {
      for (const seleccionado of item.productosSeleccionados) {
        aReponer.push({
          id: seleccionado.id,
          cantidad: Number(item.cantidad) * (seleccionado.cantidad || 1),
          nombre: seleccionado.nombre
        });
      }
      continue;
    }

    let prod = await Producto.findById(item.productoId).populate('productosIncluidos');
    
    if (prod) {
      if (prod.categoria === 'Combos' && prod.productosIncluidos?.length > 0) {
        for (const incProd of prod.productosIncluidos) {
          aReponer.push({
            id: incProd._id,
            cantidad: Number(item.cantidad),
            nombre: incProd.nombre
          });
        }
      } else {
        aReponer.push({
          id: item.productoId,
          cantidad: Number(item.cantidad),
          nombre: item.nombre
        });
      }
    } else {
      const combo = await Combo.findById(item.productoId).populate('items.producto');
      if (combo && combo.items?.length > 0) {
        for (const comboItem of combo.items) {
          if (comboItem.producto) {
            aReponer.push({
              id: comboItem.producto._id,
              cantidad: Number(item.cantidad) * comboItem.cantidad,
              nombre: comboItem.producto.nombre
            });
          }
        }
      }
    }
  }

  for (const item of aReponer) {
    await Producto.updateOne(
      { _id: item.id },
      { $inc: { stock: item.cantidad } }
    );

    const pActualizado = await Producto.findById(item.id);
    if (pActualizado && pActualizado.stock > 0 && !pActualizado.disponible) {
      pActualizado.disponible = true;
      await pActualizado.save();
    }
  }

  pedido.stockDescontado = false;
};


// @desc    Redirigir a frontend (utilizado para engañar regla de localhost de MP)
export const successRedirect = (req, res) => {
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').trim().replace(/\/$/, '');
  const query = new URLSearchParams(req.query).toString();
  res.redirect(`${frontendUrl}/checkout-success?${query}`);
};

// @desc    Crear un nuevo pedido
// @route   POST /api/pedidos
// @access  Privado (Cliente)
export const crearPedido = async (req, res) => {
  try {
    const { items, datosEntrega, totales, metodoPago } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No hay productos en el pedido' });
    }

    // --- VALIDACIÓN PREVENTIVA DE STOCK ---
    // Verificamos stock antes de crear el pedido y generar la preferencia de MP
    for (const item of items) {
      // A. Validar productos seleccionados en combo dinámico
      if (item.productosSeleccionados && item.productosSeleccionados.length > 0) {
        for (const selec of item.productosSeleccionados) {
          const p = await Producto.findById(selec.id);
          if (p && p.stock < (item.cantidad * (selec.cantidad || 1))) {
            return res.status(400).json({ message: `Stock insuficiente para "${p.nombre}" incluido en tu combo personalizado.` });
          }
        }
        continue;
      }

      // B. Validar productos o combos tradicionales
      if (item.productoId) {
        // Buscar producto, combo antiguo o combo nuevo
        const prod = await Producto.findById(item.productoId).populate('productosIncluidos');
        if (prod) {
          // Si es un combo de los viejos, verificar sus hijos
          if (prod.categoria === 'Combos' && prod.productosIncluidos?.length > 0) {
            for (const hijo of prod.productosIncluidos) {
              if (hijo.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para "${hijo.nombre}" dentro del combo.` });
              }
            }
          } else {
            // Producto normal
            if (prod.stock < item.cantidad) {
              return res.status(400).json({ message: `Lo sentimos, el stock de "${prod.nombre}" cambió y ya no hay suficientes unidades.` });
            }
          }
        } else {
          // Buscar combo en la nueva colección
          const combo = await Combo.findById(item.productoId).populate('items.producto');
          if (combo && combo.items?.length > 0) {
            for (const comboItem of combo.items) {
              if (comboItem.producto && comboItem.producto.stock < (item.cantidad * comboItem.cantidad)) {
                return res.status(400).json({ message: `Stock insuficiente para "${comboItem.producto.nombre}" incluido en el combo.` });
              }
            }
          }
        }
      }
    }
    // ---------------------------------------
    const prov = datosEntrega.provincia.toLowerCase();
    const esAMBA = prov.includes('buenos aires') || prov.includes('capital federal') || prov.includes('caba');
    const minDays = esAMBA ? 2 : 5;
    const maxDays = esAMBA ? 3 : 7;
    const fechaMin = new Date(); fechaMin.setDate(fechaMin.getDate() + minDays);
    const fechaMax = new Date(); fechaMax.setDate(fechaMax.getDate() + maxDays);
    datosEntrega.fechaEstimadaMin = fechaMin;
    datosEntrega.fechaEstimadaMax = fechaMax;
    totales.envio = 0;

    const itemsConComision = await Promise.all(items.map(async (item) => {
      let comision = 0;
      if (item.productoId) {
        try {
          const prod = await Producto.findById(item.productoId).populate('productosIncluidos');
          if (prod) {
            if (prod.categoria === 'Combos' && prod.productosIncluidos?.length > 0) {
              comision = prod.productosIncluidos.reduce((acc, hijo) => acc + (hijo.comision || 0), 0);
            } else if (prod.comision) comision = prod.comision;
          } else {
            const combo = await Combo.findById(item.productoId).populate('items.producto');
            if (combo) {
              comision = combo.items.reduce((acc, itemCombo) => acc + ((itemCombo.producto?.comision || 0) * itemCombo.cantidad), 0);
            }
          }
        } catch (err) { console.error(err); }
      }
      return { ...item, comision };
    }));

    const pedido = new Pedido({
      user: req.user ? req.user._id : null, // null para invitados
      pedidosData: itemsConComision,
      datosEntrega, totales, metodoPago,
      estadoPago: 'Pendiente', estadoEntrega: 'Pendiente'
    });

    const createdPedido = await pedido.save();
    let initPoint = null;

    if (metodoPago === 'mercado_pago') {
       try {
         const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-123' });
         const preference = new Preference(client);
         const frontendUrl = (process.env.FRONTEND_URL || '').trim().replace(/\/$/, '');
         const isLocalhost = !frontendUrl || frontendUrl.includes('localhost') || frontendUrl.includes('127.0.0.1');

         const body = {
           items: items.map(item => ({
             id: item.productoId ? item.productoId.toString() : 'item',
             title: item.nombre, quantity: Number(item.cantidad),
             unit_price: Number(item.precio), currency_id: 'ARS'
           })),
           payer: {
             name: datosEntrega.nombre || '', surname: datosEntrega.apellido || '', email: datosEntrega.email
           },
           external_reference: createdPedido._id.toString()
         };

         // TRUCO: Usamos HTTPS Localtunnel para engañar a MP localmente y ganar auto_return
         const successUrl = (isLocalhost && process.env.BACKEND_URL) 
            ? `${process.env.BACKEND_URL}/api/pedidos/redirect/success`
            : `${frontendUrl}/checkout-success`;

         body.back_urls = {
           success: successUrl,
           failure: `${frontendUrl}/checkout-failure`,
           pending: `${frontendUrl}/checkout-pending`
         };
         
         body.auto_return = 'approved';

         if (process.env.BACKEND_URL) {
           body.notification_url = `${process.env.BACKEND_URL}/api/pedidos/webhook`;
         }

         const response = await preference.create({ body });
         initPoint = response.init_point;
       } catch (mpError) { console.error('Error al generar preferencia Mercado Pago:', mpError); }
    }

    const pedidoResponse = createdPedido.toObject();
    if (initPoint) {
      pedidoResponse.init_point = initPoint;
    }

    // --- ENVÍO DE CORREO (Transferencia) ---
    if (metodoPago === 'transferencia' && datosEntrega.email) {
      sendEmail({
        email: datosEntrega.email,
        subject: `Confirmación de Pedido #${createdPedido._id.toString().slice(-6).toUpperCase()} - Lé Pan`,
        message: 'Hemos recibido tu pedido. Por favor realiza la transferencia.',
        htmlMessage: getTransferenciaEmailHtml(pedidoResponse)
      }).catch(err => console.error('Error al enviar correo de transferencia:', err));
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Pedido.countDocuments({ user: req.user._id });
    const pages = Math.ceil(total / limit);

    const pedidos = await Pedido.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      pedidos,
      page,
      pages,
      total
    });
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
      let sendEnviadoEmail = false;
      if (estadoEntrega) {
        if (estadoEntrega === 'Enviado' && !pedido.correoEnvioNotificado) {
          sendEnviadoEmail = true;
          pedido.correoEnvioNotificado = true;
        }
        pedido.estadoEntrega = estadoEntrega;
      }
      
      let sendApprovalEmail = false;
      if (estadoPago) {
        // Si cambia a Aprobado y antes no lo estaba, descontamos stock
        if (estadoPago === 'Aprobado' && pedido.estadoPago !== 'Aprobado') {
          await descontarStockPedido(pedido);
          sendApprovalEmail = true;
        } 
        // Si estaba Aprobado y cambia a otro estado, reponemos stock
        else if (pedido.estadoPago === 'Aprobado' && estadoPago !== 'Aprobado') {
          await reponerStockPedido(pedido);
        }
        
        pedido.estadoPago = estadoPago;
      }

      const updatedPedido = await pedido.save();

      // Enviar correo si se aprobó manualmente
      if (sendApprovalEmail && updatedPedido.datosEntrega?.email) {
        sendEmail({
          email: updatedPedido.datosEntrega.email,
          subject: `Pago Confirmado #${updatedPedido._id.toString().slice(-6).toUpperCase()} - Lé Pan`,
          message: 'Tu pago ha sido aprobado.',
          htmlMessage: getPagoAprobadoEmailHtml(updatedPedido.toObject())
        }).catch(err => console.error('Error al enviar correo de pago aprobado (admin):', err));
      }

      // Enviar correo si el pedido está en camino
      if (sendEnviadoEmail && updatedPedido.datosEntrega?.email) {
        sendEmail({
          email: updatedPedido.datosEntrega.email,
          subject: `Tu pedido #${updatedPedido._id.toString().slice(-6).toUpperCase()} está en camino - Lé Pan`,
          message: 'Tu pedido ya salió de nuestro local y está en viaje.',
          htmlMessage: getEnCaminoEmailHtml(updatedPedido.toObject())
        }).catch(err => console.error('Error al enviar correo de pedido en camino:', err));
      }

      res.json(updatedPedido);
    } else {
      res.status(404).json({ message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error('Error updating pedido:', error);
    // Si es un error de stock o validación controlada, enviamos 400 y el mensaje
    if (error.message.includes('Stock insuficiente') || error.message.includes('concurrencia')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error del servidor al actualizar pedido' });
  }
};

// @desc    Subir comprobante de transferencia (Público: funciona para usuarios y para invitados)
// @route   PUT /api/pedidos/:id/comprobante
// @access  Público
export const subirComprobante = async (req, res) => {
  try {
    const { comprobanteUrl } = req.body;
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    pedido.comprobanteTransferencia = comprobanteUrl;
    const updatedPedido = await pedido.save();
    res.json(updatedPedido);
  } catch (error) {
    console.error('Error uploading comprobante:', error);
    res.status(500).json({ message: 'Error del servidor al adjuntar comprobante' });
  }
};

// @desc    Webhook para recibir validación de pagos asincrónica de Mercado Pago
// @route   POST /api/pedidos/webhook
// @access  Público
export const webhookMercadoPago = async (req, res) => {
  try {
    // 1. Devolver 200 OK inmediatamente para evitar que MP nos marque como fallidos
    res.status(200).send('OK');

    // 2. Extraer el Payment ID de la notificación (Maneja tanto IPN como Webhooks)
    const paymentId = req.query['data.id'] || req.query.id || req.body?.data?.id;
    const type = req.query.type || req.query.topic || req.body?.type;

    if (type === 'payment' && paymentId) {
      console.log('Webhook MP recibido para paymentId:', paymentId);
      
      const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-123' });
      const paymentConfig = new Payment(client);
      
      // 3. Consultar la API de MP para ver el estado *real* del pago (por seguridad)
      const paymentInfo = await paymentConfig.get({ id: paymentId });
      
      if (paymentInfo.external_reference) {
        // 4. Buscar el pedido original en nuestra base de datos
        const pedido = await Pedido.findById(paymentInfo.external_reference);
        
        if (pedido) {
          // 5. Actualizar el estado de pago del Pedido
          let sendApprovalEmail = false;
          if (paymentInfo.status === 'approved') {
            const eraAprobado = pedido.estadoPago === 'Aprobado';
            if (!eraAprobado) sendApprovalEmail = true;
            pedido.estadoPago = 'Aprobado';
            
            // 6. Descontar stock usando el helper (maneja duplicados con stockDescontado)
            await descontarStockPedido(pedido);
          } else if (paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled') {
            if (pedido.estadoPago === 'Aprobado') await reponerStockPedido(pedido);
            pedido.estadoPago = 'Rechazado';
          } else if (paymentInfo.status === 'in_process' || paymentInfo.status === 'pending') {
            if (pedido.estadoPago === 'Aprobado') await reponerStockPedido(pedido);
            pedido.estadoPago = 'Pendiente';
          }
          await pedido.save();
          
          if (sendApprovalEmail && pedido.datosEntrega?.email) {
            sendEmail({
              email: pedido.datosEntrega.email,
              subject: `Pago Confirmado #${pedido._id.toString().slice(-6).toUpperCase()} - Lé Pan`,
              message: 'Tu pago por Mercado Pago ha sido aprobado.',
              htmlMessage: getPagoAprobadoEmailHtml(pedido.toObject())
            }).catch(err => console.error('Error al enviar correo de pago aprobado (webhook):', err));
          }

          console.log(`[MP] Pedido ${pedido._id} actualizado automáticamente a estado: ${pedido.estadoPago}`);
        }
      }
    }
  } catch (error) {
    console.error('[MP] Error crítico procesando Webhook:', error);
  }
};

// @desc    Consultar estado de un pedido por ID corto y email (para invitados)
// @route   POST /api/pedidos/track
// @access  Público
export const trackPedido = async (req, res) => {
  try {
    const { orderIdShort, email } = req.body;

    if (!orderIdShort || !email) {
      return res.status(400).json({ message: 'Se requiere el número de pedido y el email' });
    }

    // Buscamos pedidos por email (que es más específico)
    // Luego filtramos por el ID corto en JS para mayor simplicidad
    const pedidos = await Pedido.find({ 'datosEntrega.email': email.toLowerCase() }).sort({ createdAt: -1 });

    const pedido = pedidos.find(p => p._id.toString().slice(-6).toUpperCase() === orderIdShort.toUpperCase());

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado. Verifica los datos ingresados.' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('Error tracking pedido:', error);
    res.status(500).json({ message: 'Error del servidor al consultar el pedido' });
  }
};

// @desc    Validar si un pedido cumple con el plazo de 10 días para arrepentimiento
// @route   POST /api/pedidos/validar-arrepentimiento
// @access  Público
export const validarArrepentimiento = async (req, res) => {
  try {
    const { orderIdShort, email } = req.body;

    if (!orderIdShort || !email) {
      return res.status(400).json({ message: 'Se requiere el número de pedido y el email' });
    }

    // Buscar pedidos por email y filtrar por ID corto
    const pedidos = await Pedido.find({ 'datosEntrega.email': email.toLowerCase() }).sort({ createdAt: -1 });
    const pedido = pedidos.find(p => p._id.toString().slice(-6).toUpperCase() === orderIdShort.toUpperCase());

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado. Verifica los datos ingresados.' });
    }

    // Calcular la fecha límite de arrepentimiento
    // Usamos fechaEstimadaMax + 10 días corridos
    let fechaReferencia = pedido.datosEntrega?.fechaEstimadaMax || pedido.createdAt;
    
    const fechaLimite = new Date(fechaReferencia);
    fechaLimite.setDate(fechaLimite.getDate() + 10);
    
    const ahora = new Date();

    if (ahora > fechaLimite) {
      return res.status(400).json({ 
        message: 'El plazo legal de 10 días corridos para devoluciones ha vencido para este pedido.',
        fechaLimite: fechaLimite
      });
    }

    res.status(200).json({ message: 'Validación exitosa, pedido dentro del plazo legal.' });
  } catch (error) {
    console.error('Error validando arrepentimiento:', error);
    res.status(500).json({ message: 'Error del servidor al validar el pedido' });
  }
};

