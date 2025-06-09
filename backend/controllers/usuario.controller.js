const db = require('../db');

exports.getPerfil = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener el usuario' });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

exports.asignarDieta = (req, res) => {
  const { id_usuario, tipo, alergias } = req.body;
  if (!id_usuario || !tipo) {
    return res.status(400).json({ message: 'El ID del usuario y el tipo de dieta son obligatorios.' });
  }
  let buscarDietaQuery = `SELECT id FROM dietas WHERE tipo = ?`;
  let params = [tipo];
  if (alergias && alergias.length > 0) {
    const alergiasArray = typeof alergias === 'string' ? alergias.split(',') : alergias;
    alergiasArray.forEach(alergia => {
      buscarDietaQuery += ` AND (alergias IS NULL OR alergias NOT LIKE ?)`;
      params.push(`%${alergia}%`);
    });
  }
  buscarDietaQuery += ` LIMIT 1`;
  db.query(buscarDietaQuery, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al buscar la dieta.' });
    if (results.length === 0) return res.status(404).json({ message: 'No se encontró una dieta para los criterios seleccionados.' });
    const id_dieta = results[0].id;
    db.query(`UPDATE usuario SET dieta_id = ? WHERE id_usuario = ?`, [id_dieta, id_usuario], (err) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar el usuario.' });
      res.status(200).json({ message: 'Dieta asignada correctamente.', dieta_id: id_dieta });
    });
  });
};

exports.getDietaAsignada = (req, res) => {
  const { id_usuario } = req.params;
  const query = `
    SELECT d.nombre, d.tipo, d.alergias, d.descripcion
    FROM dietas d
    JOIN usuario u ON u.dieta_id = d.id
    WHERE u.id_usuario = ?
  `;
  db.query(query, [id_usuario], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener la dieta asignada.' });
    if (results.length === 0) return res.status(404).json({ message: 'No se encontró una dieta asignada para este usuario.' });
    res.status(200).json(results[0]);
  });
};

exports.actualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_nacimiento, edad, sexo, altura, peso_actual, correo, objetivo, id_rutina, dieta_id } = req.body;
  const query = `
    UPDATE usuario
    SET nombre = ?, fecha_nacimiento = ?, edad = ?, sexo = ?, altura = ?, peso_actual = ?, correo = ?, objetivo = ?, id_rutina = ?, dieta_id = ?
    WHERE id_usuario = ?
  `;
  db.query(query, [nombre, fecha_nacimiento, edad, sexo, altura, peso_actual, correo, objetivo, id_rutina, dieta_id, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al actualizar el usuario' });
    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  });
};

exports.actualizarFoto = (req, res) => {
  const { id } = req.params;
  const { foto } = req.body;
  if (!foto) return res.status(400).json({ message: 'Falta la foto.' });
  db.query('UPDATE usuario SET foto = ? WHERE id_usuario = ?', [foto, id], (err) => {
    if (err) return res.status(500).json({ message: 'Error al actualizar la foto.' });
    res.json({ message: 'Foto actualizada correctamente.' });
  });
};

exports.getAlergias = (req, res) => {
  db.query('SELECT * FROM alergias', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener alergias' });
    res.json(results);
  });
};

exports.getTiposDieta = (req, res) => {
  db.query('SELECT * FROM tipos_dieta', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener tipos de dieta' });
    res.json(results);
  });
};

exports.getObjetivos = (req, res) => {
  db.query('SELECT * FROM objetivo', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener objetivos' });
    res.json(results);
  });
};
