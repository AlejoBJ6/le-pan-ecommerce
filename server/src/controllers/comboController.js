import Combo from '../models/Combo.js';

// @desc    Obtener todos los combos
// @route   GET /api/combos
// @access  Public
export const obtenerCombos = async (req, res) => {
  try {
    const { destacado, disponible } = req.query;
    
    let query = {};
    if (disponible === 'true' || req.query.admin !== 'true') {
      query.disponible = true;
    }
    if (destacado === 'true') {
      query.destacado = true;
    }

    const combos = await Combo.find(query).populate('items.producto', 'nombre imagenes precio categoria stock disponible eliminado');
    
    // Calcular stock dinámico para cada combo
    const combosProcesados = combos.map(c => {
      let comboData = c.toObject();
      if (c.items && c.items.length > 0) {
        // El stock del combo es el mínimo de (stock_hijo / cantidad_necesaria)
        const stocks = c.items.map(item => {
          if (!item.producto || !item.producto.disponible || item.producto.eliminado) return 0;
          return Math.floor(item.producto.stock / item.cantidad);
        });
        comboData.stock = Math.min(...stocks);
        if (comboData.stock <= 0) comboData.disponible = false;
      } else {
        comboData.stock = 0;
        comboData.disponible = false;
      }
      return comboData;
    });

    res.json(combosProcesados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los combos', error: error.message });
  }
};

// @desc    Obtener un combo por ID
// @route   GET /api/combos/:id
// @access  Public
export const obtenerComboPorId = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate('items.producto');
    if (combo) {
      let comboData = combo.toObject();
      if (combo.items && combo.items.length > 0) {
        const stocks = combo.items.map(item => {
          if (!item.producto || !item.producto.disponible || item.producto.eliminado) return 0;
          return Math.floor(item.producto.stock / item.cantidad);
        });
        comboData.stock = Math.min(...stocks);
        if (comboData.stock <= 0) comboData.disponible = false;
      }
      res.json(comboData);
    } else {
      res.status(404).json({ message: 'Combo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el combo', error: error.message });
  }
};

// @desc    Crear un nuevo combo
// @route   POST /api/combos
// @access  Private/Admin
export const crearCombo = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      items,
      precioFinal,
      descuento,
      imagenes,
      disponible,
      destacado
    } = req.body;

    const combo = new Combo({
      nombre,
      descripcion,
      items,
      precioFinal,
      descuento,
      imagenes,
      disponible,
      destacado
    });

    const comboCreado = await combo.save();
    res.status(201).json(comboCreado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el combo', error: error.message });
  }
};

// @desc    Actualizar un combo
// @route   PUT /api/combos/:id
// @access  Private/Admin
export const actualizarCombo = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      items,
      precioFinal,
      descuento,
      imagenes,
      disponible,
      destacado
    } = req.body;

    const combo = await Combo.findById(req.params.id);

    if (combo) {
      combo.nombre = nombre || combo.nombre;
      combo.descripcion = descripcion || combo.descripcion;
      combo.items = items || combo.items;
      combo.precioFinal = precioFinal !== undefined ? precioFinal : combo.precioFinal;
      combo.descuento = descuento !== undefined ? descuento : combo.descuento;
      combo.imagenes = imagenes || combo.imagenes;
      combo.disponible = disponible !== undefined ? disponible : combo.disponible;
      combo.destacado = destacado !== undefined ? destacado : combo.destacado;

      const comboActualizado = await combo.save();
      res.json(comboActualizado);
    } else {
      res.status(404).json({ message: 'Combo no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el combo', error: error.message });
  }
};

// @desc    Eliminar un combo (borrado lógico)
// @route   DELETE /api/combos/:id
// @access  Private/Admin
export const eliminarCombo = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id);

    if (combo) {
      combo.disponible = false;
      await combo.save();
      res.json({ message: 'Combo inhabilitado (oculto del catálogo)' });
    } else {
      res.status(404).json({ message: 'Combo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el combo', error: error.message });
  }
};
