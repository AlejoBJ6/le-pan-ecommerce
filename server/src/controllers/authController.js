import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

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
    const { nombre, apellido, email, telefono, password } = req.body;

    // Verificar que llenaron todos los campos
    if (!nombre || !apellido || !email || !telefono || !password) {
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
      apellido,
      email,
      telefono,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
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
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
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

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error del servidor al obtener el perfil' });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.nombre = req.body.nombre || user.nombre;
      user.apellido = req.body.apellido || user.apellido;
      user.telefono = req.body.telefono || user.telefono;
      user.email = req.body.email || user.email;

      // Si viene una contraseña nueva la seteamos (el hook pre-save se encarga del hashing)
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        rol: updatedUser.rol,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar el perfil' });
  }
};

// @desc    Olvidé mi contraseña
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'No existe un usuario con este correo' });
    }

    // Obtener el token de rescate en texto plano
    const resetToken = user.getResetPasswordToken();

    // Guardar usuario para almacenar en la BD el token en formato hash
    await user.save({ validateBeforeSave: false });

    // Construir la URL del frontend (Asumiendo que corre en puerto 5173 / localhost)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `Recibiste este correo porque pediste restablecer la contraseña de tu cuenta.\n\nPor favor, dirígete al siguiente enlace para crear una contraseña nueva:\n\n${resetUrl}\n\nSi tú no solicitaste esto, puedes ignorar el correo de manera segura.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Lé Pan - Restablecimiento de Contraseña',
        message
      });

      res.status(200).json({ message: 'Correo de recuperación enviado exitosamente' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      console.error(err);
      res.status(500).json({ message: 'No se pudo enviar el correo de recuperación' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Restablecer contraseña
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // Reconstruir el hash 
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Comprobar que no haya expirado
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de recuperación inválido o expirado' });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'Debe proveer una contraseña nueva' });
    }

    // Sobreescribir contraseña (el pre-save hook se encarga del hash para bcrypt)
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
