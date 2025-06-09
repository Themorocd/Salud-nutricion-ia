const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const { enviarCorreoBienvenida, enviarCorreoRecuperacion } = require('../utils/mailer');
const db = require('../db');

exports.register = (req, res) => {
  const { nombre, fecha_nacimiento, edad, sexo, altura, peso_actual, correo, password, foto, objetivo, dieta_id } = req.body;
  if (!nombre || !correo || !password || !objetivo) {
    return res.status(400).json({ message: 'Nombre, correo, contraseña y objetivo son requeridos' });
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error al encriptar la contraseña' });

    // Buscar id_rutina asociado al objetivo
    const rutinaQuery = `SELECT id AS id_rutina FROM rutinas WHERE objetivo = ? LIMIT 1;`;
    db.query(rutinaQuery, [objetivo], (err, rutinaResult) => {
      if (err) return res.status(500).json({ message: 'Error al buscar rutina' });
      if (rutinaResult.length === 0) return res.status(404).json({ message: 'No se encontró una rutina para el objetivo proporcionado' });
      const id_rutina = rutinaResult[0].id_rutina;

      Usuario.create([nombre, fecha_nacimiento, edad, sexo, altura, peso_actual, correo, hashedPassword, foto, objetivo, id_rutina, dieta_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
        enviarCorreoBienvenida(correo, nombre);
        res.status(201).json({ message: 'Usuario registrado correctamente' });
      });
    });
  });
};

exports.login = (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  Usuario.findByCorreo(correo, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener el usuario' });
    if (results.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });
    const user = results[0];
    bcrypt.compare(password, user.contraseña, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error al comparar la contraseña' });
      if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });
      const token = jwt.sign({ userId: user.id_usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        token,
        user: {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol
        },
      });
    });
  });
};

exports.recuperarPassword = (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ message: 'Correo requerido' });
  Usuario.findByCorreo(correo, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (results.length === 0) return res.status(200).json({ message: 'Si el correo existe, recibirás un email.' });
    const token = jwt.sign({ correo }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `http://localhost:4200/restablecer-password?token=${token}`;
    enviarCorreoRecuperacion(correo, link);
    res.json({ message: 'Correo de recuperación enviado' });
  });
};

exports.restablecerPassword = (req, res) => {
  const { token, nuevaPassword } = req.body;
  if (!token || !nuevaPassword) return res.status(400).json({ message: 'Faltan datos.' });
  let correo;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    correo = decoded.correo;
  } catch {
    return res.status(400).json({ message: 'Token inválido o expirado.' });
  }
  bcrypt.hash(nuevaPassword, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Error al encriptar la contraseña.' });
    Usuario.updatePassword(correo, hash, (err) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar la contraseña.' });
      res.json({ message: 'Contraseña actualizada correctamente.' });
    });
  });
};
