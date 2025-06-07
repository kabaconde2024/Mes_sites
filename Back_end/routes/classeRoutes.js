const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');
const verifierToken = require('../middleware/verifierToken'); // Import du middleware verifierToken
const verifierRole = require('../middleware/verifierRole') ;
// CRUD de base
router.post('/', verifierToken, verifierRole(['admin']), classeController.createClasse);          // CREATE - Créer une nouvelle classe
router.get('/',  verifierToken, verifierRole(['admin']),classeController.getAllClasses);         // READ - Récupérer toutes les classes
router.get('/:id', verifierToken, verifierRole(['admin']), classeController.getClasseById);      // READ - Récupérer une classe spécifique
router.put('/:id',  verifierToken, verifierRole(['admin']),classeController.updateClasse);       // UPDATE - Mettre à jour une classe
router.delete('/:id', verifierToken, verifierRole(['admin']), classeController.deleteClasse);    // DELETE - Supprimer une classe

module.exports = router;