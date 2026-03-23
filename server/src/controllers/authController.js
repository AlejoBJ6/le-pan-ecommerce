import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper para generar el Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar que llenaron todos los campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Por favor, llena todos los campos' });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe con ese email' });
    }

    // Crear el usuario
    const user = await User.create({
      nombre,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error del servidor al registrar usuario' });
  }
};

// @desc    Autenticar al usuario & obtener token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona email y contraseña' });
    }

    // Buscar el usuario por email e incluir el password (que está como select: false)
    const user = await User.findOne({ email }).select('+password');

    // Comprobar coincidencia del usuario y password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error del servidor al iniciar sesión' });
  }
};
