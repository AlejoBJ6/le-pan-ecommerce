import Producto from '../models/Producto.js';

// @desc    Obtener todos los productos
// @route   GET /api/productos
// @access  Public
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find({});
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// @desc    Obtener un solo producto por ID
// @route   GET /api/productos/:id
// @access  Public
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (producto) {
      res.json(producto);
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
      await Producto.deleteOne({ _id: producto._id });
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};
