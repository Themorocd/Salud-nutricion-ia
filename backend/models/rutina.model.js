const db = require('../db');

const Rutina = {
  getAll: (callback) => {
    db.query('SELECT * FROM rutinas', callback);
  },
  create: (data, callback) => {
    const query = `INSERT INTO rutinas (objetivo, dias_por_semana, tipo_entrenamiento, semana, principios, enfoque)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, data, callback);
  },
  update: (id, data, callback) => {
    const query = `UPDATE rutinas SET objetivo=?, dias_por_semana=?, tipo_entrenamiento=?, semana=?, principios=?, enfoque=? WHERE id=?`;
    db.query(query, [...data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM rutinas WHERE id = ?', [id], callback);
  }
};

module.exports = Rutina;
