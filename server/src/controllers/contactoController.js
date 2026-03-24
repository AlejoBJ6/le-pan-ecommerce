import Mensaje from '../models/Mensaje.js';

// @desc    Crear un nuevo mensaje de contacto
// @route   POST /api/contacto
// @access  Public
export const crearMensaje = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
    }

    const nuevoMensaje = new Mensaje({
      nombre,
      email,
      mensaje
    });

    const mensajeGuardado = await nuevoMensaje.save();
    res.status(201).json(mensajeGuardado);
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el mensaje', error: error.message });
  }
};

// @desc    Obtener todos los mensajes
// @route   GET /api/contacto
// @access  Private/Admin
export const obtenerMensajes = async (req, res) => {
  try {
    // Ordenamos por fecha de creación descendente (los más nuevos primero)
    const mensajes = await Mensaje.find({}).sort({ createdAt: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes', error: error.message });
  }
};

// @desc    Marcar un mensaje como leído/no leído
// @route   PUT /api/contacto/:id/leido
// @access  Private/Admin
export const marcarComoLeido = async (req, res) => {
  try {
    const mensaje = await Mensaje.findById(req.params.id);
    
    if (mensaje) {
      mensaje.leido = !mensaje.leido;
      const mensajeActualizado = await mensaje.save();
      res.json(mensajeActualizado);
    } else {
      res.status(404).json({ message: 'Mensaje no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el mensaje', error: error.message });
  }
};

// @desc    Eliminar un mensaje
// @route   DELETE /api/contacto/:id
// @access  Private/Admin
export const eliminarMensaje = async (req, res) => {
  try {
    const mensaje = await Mensaje.findById(req.params.id);
    if (mensaje) {
      await mensaje.deleteOne();
      res.json({ message: 'Mensaje eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Mensaje no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mensaje', error: error.message });
  }
};
