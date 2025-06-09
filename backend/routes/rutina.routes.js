const express = require('express');
const router = express.Router();
const rutinaController = require('../controllers/rutina.controller');

router.get('/', rutinaController.getAll);
router.get('/:objetivo', rutinaController.getByObjetivo);
router.post('/guardar', rutinaController.guardarRutinaIA);
router.get('/ia/:id_usuario', rutinaController.getRutinaIA);

module.exports = router;
