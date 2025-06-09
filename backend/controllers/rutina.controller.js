const db = require('../db');

exports.getAll = (req, res) => {
  db.query('SELECT * FROM rutinas', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener rutinas' });
    res.json(results);
  });
};

exports.guardarRutinaIA = (req, res) => {
  const { id_usuario, rutina } = req.body;
  if (!id_usuario || !rutina) {
    return res.status(400).json({ message: 'Faltan datos para guardar la rutina.' });
  }
  const query = 'INSERT INTO rutinas_ia (id_usuario, rutina_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE rutina_json = ?';
  db.query(query, [id_usuario, JSON.stringify(rutina), JSON.stringify(rutina)], (err) => {
    if (err) return res.status(500).json({ message: 'Error al guardar la rutina.' });
    res.status(200).json({ message: 'Rutina guardada correctamente.' });
  });
};

exports.getRutinaIA = (req, res) => {
  const { id_usuario } = req.params;
  const query = 'SELECT rutina_json FROM rutinas_ia WHERE id_usuario = ?';
  db.query(query, [id_usuario], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener la rutina IA.' });
    if (results.length === 0) return res.status(404).json({ message: 'No hay rutina IA guardada.' });
    res.status(200).json({ rutina: JSON.parse(results[0].rutina_json) });
  });
};

exports.getByObjetivo = (req, res) => {
  const objetivo = decodeURIComponent(req.params.objetivo);
  const db = require('../db');
  db.query('SELECT * FROM rutinas WHERE objetivo = ?', [objetivo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener la rutina por objetivo' });
    res.json(results);
  });
};
