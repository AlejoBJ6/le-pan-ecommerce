import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Crear un 'transporter' (el servicio que despacha el correo)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Definir las opciones del correo (remitente, destinatario, asunto, texto)
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'Lé Pan'} <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage, // Opcional si mandamos vista bonita
  };

  // 3. Enviar realmente el correo con nodemailer
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
