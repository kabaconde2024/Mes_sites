const express = require('express');
const router = express.Router();
const matiereController = require('../controllers/matiereController');
const verifierToken = require('../middleware/verifierToken'); // Import du middleware verifierToken
const verifierRole = require('../middleware/verifierRole') ;
// CRUD de base
router.post('/', verifierToken, verifierRole(['admin']), matiereController.createMatiere);
router.get('/',  verifierToken, verifierRole(['admin']),matiereController.getAllMatieres);
router.get('/:id', verifierToken, verifierRole(['admin']), matiereController.getMatiereById);
router.put('/:id', verifierToken, verifierRole(['admin']), matiereController.updateMatiere);
router.delete('/:id', verifierToken, verifierRole(['admin']), matiereController.deleteMatiere);

module.exports = router;