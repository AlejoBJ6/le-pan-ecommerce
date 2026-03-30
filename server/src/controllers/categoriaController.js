import Categoria from '../models/Categoria.js';
import Producto from '../models/Producto.js';

// @desc  Obtener todas las categorías
// @route GET /api/categorias
// @access Public
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};

// @desc  Crear una categoría
// @route POST /api/categorias
// @access Admin
export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const existe = await Categoria.findOne({ nombre: nombre.trim() });
    if (existe) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }

    const categoria = await Categoria.create({ nombre: nombre.trim() });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría' });
  }
};

// @desc  Eliminar una categoría
// @route DELETE /api/categorias/:id
// @access Admin
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    const nombreCategoria = categoria.nombre;
    
    await categoria.deleteOne();
    
    // Actualizamos todos los productos pertenecientes a esa categoría para que no queden huérfanos
    await Producto.updateMany(
      { categoria: nombreCategoria },
      { $set: { categoria: 'Sin categoría' } }
    );
    
    res.json({ message: 'Categoría eliminada y productos actualizados a "Sin categoría"' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
};
