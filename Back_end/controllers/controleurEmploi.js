// controllers/EmploiDuTempsController.js
const EmploiDuTemps = require('../models/Emploi');
const Enseignant = require("../models/Enseignant");


exports.createEmploiDuTemps = async (req, res) => {
  console.log("Données reçues:", req.body); // Pour le débogage
  
  const { jour, horaire_debut, horaire_fin, matiere, enseignantId } = req.body;

  if (!jour || !horaire_debut || !horaire_fin || !matiere || !enseignantId) {
    console.log("Champs manquants:", req.body);
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const enseignant = await Enseignant.findById(enseignantId);
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant non trouvé' });
    }

    const emploiDuTemps = new EmploiDuTemps({
      jour,
      horaire_debut,
      horaire_fin,
      matiere,
      enseignant: enseignantId
    });

    await emploiDuTemps.save();
    const result = await EmploiDuTemps.findById(emploiDuTemps._id).populate('enseignant');
    
    res.status(201).json({ 
      message: 'Emploi du temps créé avec succès', 
      emploiDuTemps: result 
    });
  } catch (error) {
    console.error("Erreur de création:", error);
    res.status(500).json({ 
      message: 'Erreur lors de la création',
      error: error.message 
    });
  }
};
// Modifiez aussi getAllEmploiDuTemps pour peupler les enseignants
exports.getAllEmploiDuTemps = async (req, res) => {
  try {
    const emploisDuTemps = await EmploiDuTemps.find().populate('enseignant');
    res.status(200).json(emploisDuTemps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Mettre à jour un emploi du temps
exports.updateEmploiDuTemps = async (req, res) => {
  const { id } = req.params;
  const { jour, horaire_debut, horaire_fin, matiere, enseignant } = req.body;

  try {
    const emploiDuTemps = await EmploiDuTemps.findById(id);
    if (!emploiDuTemps) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    }

    emploiDuTemps.jour = jour || emploiDuTemps.jour;
    emploiDuTemps.horaire_debut = horaire_debut || emploiDuTemps.horaire_debut;
    emploiDuTemps.horaire_fin = horaire_fin || emploiDuTemps.horaire_fin;
    emploiDuTemps.matiere = matiere || emploiDuTemps.matiere;
    emploiDuTemps.enseignant = enseignant || emploiDuTemps.enseignant;
    emploiDuTemps.updatedAt = Date.now();

    await emploiDuTemps.save();
    res.status(200).json({ message: 'Emploi du temps mis à jour avec succès', emploiDuTemps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un emploi du temps
exports.deleteEmploiDuTemps = async (req, res) => {
  const { id } = req.params;

  try {
    const emploiDuTemps = await EmploiDuTemps.findByIdAndDelete(id);
    if (!emploiDuTemps) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    }

    res.status(200).json({ message: 'Emploi du temps supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
