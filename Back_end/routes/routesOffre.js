const express = require('express');  
const router = express.Router();  
const verifierToken = require('../middleware/verifierToken');  
const verifierRole = require('../middleware/verifierRole');  
const controleurOffre = require('../controllers/controleurOffre');  

// Routes pour les offres  
router.post('/ajout', verifierToken, verifierRole(['admin']), controleurOffre.ajouterOffre);  
router.get('/recuperer', verifierToken, verifierRole(['eleve','professeur']), controleurOffre.obtenirToutesLesOffres);  
router.delete('/:id', verifierToken, verifierRole(['admin']), controleurOffre.supprimerOffre);  

module.exports = router;