const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Middleware para verificar admin
function verificarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'admin') return res.status(403).json({ message: 'Solo para administradores' });
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Usuarios
router.delete('/users/:id', verificarAdmin, adminController.deleteUser);
router.get('/users', verificarAdmin, adminController.getAllUsers);

// Rutinas
router.get('/rutinas', verificarAdmin, adminController.getRutinas);
router.post('/rutinas', verificarAdmin, adminController.addRutina);
router.delete('/rutinas/:id', verificarAdmin, adminController.deleteRutina);

// Dietas
router.get('/dietas', verificarAdmin, adminController.getDietas);
router.post('/dietas', verificarAdmin, adminController.addDieta);
router.delete('/dietas/:id', verificarAdmin, adminController.deleteDieta);


// Objetivos
router.get('/objetivos', verificarAdmin, adminController.getObjetivos);
router.post('/objetivos', verificarAdmin, adminController.addObjetivo);

// Alergias
router.get('/alergias', verificarAdmin, adminController.getAlergias);
router.post('/alergias', verificarAdmin, adminController.addAlergia);

// Tipos de dieta
router.get('/tipos-dieta', verificarAdmin, adminController.getTiposDieta);
router.post('/tipos-dieta', verificarAdmin, adminController.addTipoDieta);

module.exports = router;
