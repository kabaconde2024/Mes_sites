const express = require('express');  
const router = express.Router();  
const verifierToken = require('../middleware/verifierToken'); // Import du middleware verifierToken
const verifierRole = require('../middleware/verifierRole') ;// Import du middleware verifierRole  
const controleurEleve = require('../controllers/controleurEleve'); 

// Appliquer le middleware verifierToken avant verifierRole
router.post('/ajout', verifierToken, verifierRole(['admin']), controleurEleve.ajouterEleve);
router.get('/', verifierToken, verifierRole(['admin']), controleurEleve.obtenirTousLesEleves);  
router.get('/:id', verifierToken, verifierRole(['admin']), controleurEleve.obtenirEleveParId);  
router.put('/:id', verifierToken, verifierRole(['admin']), controleurEleve.mettreAJourEleve);  
router.delete('/:id', verifierToken, verifierRole(['admin']), controleurEleve.supprimerEleve);  
module.exports = router;