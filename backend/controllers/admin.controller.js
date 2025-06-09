const db = require('../db');
const Usuario = require('../models/usuario.model');
const Rutina = require('../models/rutina.model');
const Dieta = require('../models/dieta.model');

// Usuarios
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  Usuario.delete(id, (err) => {
    if (err) return res.status(500).json({ message: 'Error al borrar usuario' });
    res.json({ message: 'Usuario borrado' });
  });
};

exports.getAllUsers = (req, res) => {
  Usuario.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Hubo un problema con la consulta.' });
    res.json(results);
  });
};

// Rutinas
exports.getRutinas = (req, res) => {
  Rutina.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener rutinas' });
    res.json(results);
  });
};

exports.addRutina = (req, res) => {
  const { objetivo, dias_por_semana, tipo_entrenamiento, semana, principios, enfoque } = req.body;
  Rutina.create([objetivo, dias_por_semana, tipo_entrenamiento, semana, principios, enfoque], (err) => {
    if (err) return res.status(500).json({ message: 'Error al agregar rutina' });
    res.json({ message: 'Rutina agregada' });
  });
};

exports.deleteRutina = (req, res) => {
  const { id } = req.params;
  Rutina.delete(id, (err) => {
    if (err) return res.status(500).json({ message: 'Error al borrar rutina' });
    res.json({ message: 'Rutina borrada' });
  });
};

// Dietas
exports.getDietas = (req, res) => {
  Dieta.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener dietas' });
    res.json(results);
  });
};

exports.addDieta = (req, res) => {
  const { nombre, tipo, alergias, descripcion } = req.body;
  Dieta.create([nombre, tipo, alergias, descripcion], (err) => {
    if (err) return res.status(500).json({ message: 'Error al agregar dieta' });
    res.json({ message: 'Dieta agregada' });
  });
};

exports.deleteDieta = (req, res) => {
  const { id } = req.params;
  Dieta.delete(id, (err) => {
    if (err) return res.status(500).json({ message: 'Error al borrar dieta' });
    res.json({ message: 'Dieta borrada' });
  });
};

// Objetivos
exports.getObjetivos = (req, res) => {
  db.query('SELECT * FROM objetivo', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener objetivos' });
    res.json(results);
  });
};
exports.addObjetivo = (req, res) => {
  const { objetivo } = req.body;
  db.query('INSERT INTO objetivo (objetivo) VALUES (?)', [objetivo], (err) => {
    if (err) return res.status(500).json({ message: 'Error al agregar objetivo' });
    res.json({ message: 'Objetivo agregado' });
  });
};

// Alergias
exports.getAlergias = (req, res) => {
  db.query('SELECT * FROM alergias', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener alergias' });
    res.json(results);
  });
};
exports.addAlergia = (req, res) => {
  const { alergia } = req.body;
  db.query('INSERT INTO alergias (alergia) VALUES (?)', [alergia], (err) => {
    if (err) return res.status(500).json({ message: 'Error al agregar alergia' });
    res.json({ message: 'Alergia agregada' });
  });
};

// Tipos de dieta
exports.getTiposDieta = (req, res) => {
  db.query('SELECT * FROM tipos_dieta', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener tipos de dieta' });
    res.json(results);
  });
};
exports.addTipoDieta = (req, res) => {
  const { tipo } = req.body;
  db.query('INSERT INTO tipos_dieta (tipo) VALUES (?)', [tipo], (err) => {
    if (err) return res.status(500).json({ message: 'Error al agregar tipo de dieta' });
    res.json({ message: 'Tipo de dieta agregado' });
  });
};
