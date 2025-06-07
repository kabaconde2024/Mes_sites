// routes/emploiDuTempsRoutes.js
const express = require("express");
const router = express.Router();
const emploiDuTempsController = require("../controllers/controleurEmploi");

// Créer un emploi du temps
router.post("/creer", emploiDuTempsController.createEmploiDuTemps);

// Récupérer tous les emplois du temps
router.get("/listes", emploiDuTempsController.getAllEmploiDuTemps);

// Récupérer un emploi du temps par ID

// Mettre à jour un emploi du temps
router.put("/:id/modifier", emploiDuTempsController.updateEmploiDuTemps);

// Supprimer un emploi du temps
router.delete("/:id/supprimer", emploiDuTempsController.deleteEmploiDuTemps);

module.exports = router;
