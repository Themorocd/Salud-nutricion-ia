const db = require('../db');

const Dieta = {
  getAll: (callback) => {
    db.query('SELECT * FROM dietas', callback);
  },
  create: (data, callback) => {
    const query = `INSERT INTO dietas (nombre, tipo, alergias, descripcion) VALUES (?, ?, ?, ?)`;
    db.query(query, data, callback);
  },
  update: (id, data, callback) => {
    const query = `UPDATE dietas SET nombre=?, tipo=?, alergias=?, descripcion=? WHERE id=?`;
    db.query(query, [...data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM dietas WHERE id = ?', [id], callback);
  }
};

module.exports = Dieta;
