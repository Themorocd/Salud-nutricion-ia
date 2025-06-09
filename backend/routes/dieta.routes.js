const express = require('express');
const router = express.Router();
const dietaController = require('../controllers/dieta.controller');

router.get('/', dietaController.getAll);
router.post('/guardar', dietaController.guardarDietaIA);
router.get('/ia/:id_usuario', dietaController.getDietaIA);

module.exports = router;
