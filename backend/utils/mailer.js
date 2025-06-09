const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.enviarCorreoBienvenida = (correo, nombre) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: '¡Bienvenido a Salud y Nutrición IA!',
    text: `Hola ${nombre},\n\n¡Gracias por registrarte en nuestra plataforma!`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Error enviando correo:', error);
    else console.log('Correo de bienvenida enviado:', info.response);
  });
};

exports.enviarCorreoRecuperacion = (correo, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña:\n${link}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Error enviando correo de recuperación:', error);
    else console.log('Correo de recuperación enviado:', info.response);
  });
};
