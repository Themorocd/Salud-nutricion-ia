const db = require('../db');

const Usuario = {
  findByCorreo: (correo, callback) => {
    db.query('SELECT * FROM usuario WHERE correo = ?', [correo], callback);
  },
  findById: (id, callback) => {
    db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id], callback);
  },
  create: (data, callback) => {
    const query = `INSERT INTO usuario (nombre, fecha_nacimiento, edad, sexo, altura, peso_actual, correo, contraseña, foto, objetivo, id_rutina, dieta_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, data, callback);
  },
  updatePassword: (correo, hash, callback) => {
    db.query('UPDATE usuario SET contraseña = ? WHERE correo = ?', [hash, correo], callback);
  },
  update: (id, data, callback) => {
    const query = `UPDATE usuario SET nombre=?, fecha_nacimiento=?, edad=?, sexo=?, altura=?, peso_actual=?, correo=?, objetivo=?, id_rutina=?, dieta_id=? WHERE id_usuario=?`;
    db.query(query, [...data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM usuario WHERE id_usuario = ?', [id], callback);
  },
  getAll: (callback) => {
    db.query('SELECT * FROM usuario', callback);
  }
};

module.exports = Usuario;
