const express = require('express');
const router = express.Router();
const iaController = require('../controllers/ia.controller');

router.post('/entrenador_ia', iaController.entrenadorIA);

module.exports = router;
