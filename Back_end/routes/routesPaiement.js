const express = require("express");  
const router = express.Router();  
const verifierToken = require('../middleware/verifierToken'); // Import du middleware pour vérifier le token
const verifierRole = require('../middleware/verifierRole'); // Import du middleware pour vérifier le rôle
const paiementController = require("../controllers/controleurPaiement");  

// Routes pour la gestion des paiements - protégées par le rôle 'admin'  
router.post("/ajout", verifierToken, verifierRole(['admin']), paiementController.ajouterPaiement);  
router.get("/", verifierToken, verifierRole(['admin']), paiementController.obtenirTousLesPaiements);  
router.get("/eleve/:eleveId", verifierToken, verifierRole(['admin']), paiementController.obtenirPaiementsParEleve);  
router.put("/:id", verifierToken, verifierRole(['admin']), paiementController.mettreAJourPaiement);  
router.delete("/:id", verifierToken, verifierRole(['admin']), paiementController.supprimerPaiement);  

module.exports = router;  
