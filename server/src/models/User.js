import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor añade un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No devolver el password por defecto en las consultas
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function() {
  // Solo encriptar si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    return;
  }

  // Generar salt y hacer hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar si la contraseña ingresada coincide con la hasheada
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generar y setear token para recuperar contraseña
userSchema.methods.getResetPasswordToken = function() {
  // Generar token aleatorio
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hashear el token y setearlo en el campo para la base de datos
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expiración: 10 minutos
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Se devuelve el token plano para el email
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
