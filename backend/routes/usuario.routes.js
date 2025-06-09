const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/perfil/:id', usuarioController.getPerfil);
router.post('/dietas/asignar', usuarioController.asignarDieta);
router.get('/dietas/asignada/:id_usuario', usuarioController.getDietaAsignada);
router.put('/users/:id', usuarioController.actualizarUsuario);
router.put('/users/:id/foto', usuarioController.actualizarFoto);
router.get('/alergias-public', usuarioController.getAlergias);
router.get('/tipos-dieta-public', usuarioController.getTiposDieta);
router.get('/objetivos-public', usuarioController.getObjetivos);

module.exports = router;
