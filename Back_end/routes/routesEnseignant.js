const express = require("express");  
const router = express.Router();  
const verifierRole = require('../middleware/verifierRole'); // Import du middleware de vérification de rôle  
const verifierToken = require('../middleware/verifierToken'); // Import du middleware de vérification du token
const enseignantController = require("../controllers/controleurEnseignant");  

// Routes pour la gestion des enseignants - protégées par le rôle 'admin' et le token
router.post("/ajout", verifierToken, verifierRole(['admin']), enseignantController.createEnseignant);  
router.get("/listes", verifierToken, verifierRole(['admin']), enseignantController.getAllEnseignants);  
router.get("/:id", verifierToken, verifierRole(['admin']), enseignantController.getEnseignantById);  
router.put("/:id", verifierToken, verifierRole(['admin']), enseignantController.updateEnseignant);  
router.delete("/:id", verifierToken, verifierRole(['admin']), enseignantController.deleteEnseignant);  

module.exports = router;  
