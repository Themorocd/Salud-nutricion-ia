const db = require('../db');

exports.getAll = (req, res) => {
  db.query('SELECT * FROM dietas', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener dietas' });
    res.json(results);
  });
};

exports.guardarDietaIA = (req, res) => {
  const { id_usuario, dieta } = req.body;
  if (!id_usuario || !dieta) {
    return res.status(400).json({ message: 'Faltan datos para guardar la dieta.' });
  }
  const query = 'INSERT INTO dietas_ia (id_usuario, dieta_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE dieta_json = ?';
  db.query(query, [id_usuario, JSON.stringify(dieta), JSON.stringify(dieta)], (err) => {
    if (err) return res.status(500).json({ message: 'Error al guardar la dieta.' });
    res.status(200).json({ message: 'Dieta guardada correctamente.' });
  });
};

exports.getDietaIA = (req, res) => {
  const { id_usuario } = req.params;
  const query = 'SELECT dieta_json FROM dietas_ia WHERE id_usuario = ?';
  db.query(query, [id_usuario], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener la dieta IA.' });
    if (results.length === 0) return res.status(404).json({ message: 'No hay dieta IA guardada.' });
    res.status(200).json({ dieta: JSON.parse(results[0].dieta_json) });
  });
};
