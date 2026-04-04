import Producto from '../models/Producto.js';

// @desc    Obtener todos los productos
// @route   GET /api/productos
// @access  Public
export const obtenerProductos = async (req, res) => {
  try {
    const { nombre, categoria, destacado, limit, eliminados } = req.query;
    
    // Construir objeto de consulta
    let query = {};
    
    if (eliminados === 'true') {
      query.eliminado = true;
    } else {
      query.eliminado = { $ne: true };
    }
    
    // Si no se pide explícitamente desde el panel admin, ocultamos los que no están disponibles
    if (req.query.admin !== 'true') {
      query.disponible = { $ne: false }; 
    }
    
    if (nombre) {
      // Búsqueda parcial insensible a mayúsculas
      query.nombre = { $regex: nombre, $options: 'i' };
    }
    
    if (categoria && categoria !== 'Todas') {
      query.categoria = categoria;
    }
    
    if (destacado) {
      query.destacado = destacado === 'true';
    }
    
    // Ejecutar consulta Mongoose
    let dbQuery = Producto.find(query).populate('productosIncluidos', 'stock disponible eliminado nombre caracteristicas imagenes');
    
    if (limit) {
      dbQuery = dbQuery.limit(Number(limit));
    }
    
    let productos = await dbQuery;

    // Calculo dinámico de stock para combos
    const productosProcesados = productos.map(p => {
      let prodData = p.toObject();
      if (p.categoria === 'Combos' && p.productosIncluidos?.length > 0) {
        const algunNoDisponible = p.productosIncluidos.some(inc => !inc.disponible || inc.eliminado || inc.stock <= 0);
        if (algunNoDisponible) {
          prodData.stock = 0;
          prodData.disponible = false;
        } else {
          prodData.stock = Math.min(...p.productosIncluidos.map(inc => inc.stock));
        }
      }
      return prodData;
    });

    res.json(productosProcesados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// @desc    Obtener un solo producto por ID
// @route   GET /api/productos/:id
// @access  Public
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('productosIncluidos', 'stock disponible eliminado nombre caracteristicas imagenes');

    if (producto) {
      let prodData = producto.toObject();
      if (producto.categoria === 'Combos' && producto.productosIncluidos?.length > 0) {
        const algunNoDisponible = producto.productosIncluidos.some(inc => !inc.disponible || inc.eliminado || inc.stock <= 0);
        if (algunNoDisponible) {
          prodData.stock = 0;
          prodData.disponible = false;
        } else {
          prodData.stock = Math.min(...producto.productosIncluidos.map(inc => inc.stock));
        }
      }
      res.json(prodData);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/productos
// @access  Private/Admin
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      categoria,
      marca,
      modelo,
      imagenes,
      stock,
      disponible,
      destacado,
      productosIncluidos,
      caracteristicas,
      comision,
    } = req.body;

    const producto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      marca,
      modelo,
      imagenes,
      stock,
      disponible,
      destacado,
      productosIncluidos,
      caracteristicas: caracteristicas || [],
      comision: comision || 0,
    });

    const productoCreado = await producto.save();
    res.status(201).json(productoCreado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/productos/:id
// @access  Private/Admin
export const actualizarProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      categoria,
      marca,
      modelo,
      imagenes,
      stock,
      disponible,
      destacado,
      eliminado,
      productosIncluidos,
      caracteristicas,
      comision,
    } = req.body;

    const producto = await Producto.findById(req.params.id);

    if (producto) {
      producto.nombre = nombre || producto.nombre;
      producto.descripcion = descripcion || producto.descripcion;
      producto.precio = precio || producto.precio;
      producto.categoria = categoria || producto.categoria;
      producto.marca = marca || producto.marca;
      producto.modelo = modelo || producto.modelo;
      producto.imagenes = imagenes || producto.imagenes;
      producto.stock = stock !== undefined ? stock : producto.stock;
      producto.disponible = disponible !== undefined ? disponible : producto.disponible;
      producto.destacado = destacado !== undefined ? destacado : producto.destacado;
      producto.eliminado = eliminado !== undefined ? eliminado : producto.eliminado;
      producto.productosIncluidos = productosIncluidos !== undefined ? productosIncluidos : producto.productosIncluidos;
      producto.caracteristicas = caracteristicas !== undefined ? caracteristicas : producto.caracteristicas;
      producto.comision = comision !== undefined ? comision : producto.comision;

      const productoActualizado = await producto.save();
      res.json(productoActualizado);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/productos/:id
// @access  Private/Admin
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (producto) {
      producto.eliminado = true;
      producto.disponible = false; // Se inhabilita como doble seguridad
      await producto.save();
      res.json({ message: 'Producto enviado a la papelera (borrado lógico)' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};
