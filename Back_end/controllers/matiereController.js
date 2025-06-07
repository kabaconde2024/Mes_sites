const Matiere = require('../models/Matiere');
const Enseignant = require('../models/Enseignant');
const Classe = require('../models/Classe');

// Créer une matière avec association à une classe
exports.createMatiere = async (req, res) => {
  try {
    const { nom, description, coefficient, enseignants } = req.body;

    // Validation des champs obligatoires
    if (!nom || !coefficient ) {
      return res.status(400).json({ 
        message: 'Le nom, le coefficient et la classe sont obligatoires' 
      });
    }

    // Vérifier l'unicité du nom
    const existingMatiere = await Matiere.findOne({ nom });
    if (existingMatiere) {
      return res.status(400).json({ message: 'Une matière avec ce nom existe déjà' });
    }

    // Vérifier le coefficient
    if (coefficient < 1 || coefficient > 10) {
      return res.status(400).json({ message: 'Le coefficient doit être entre 1 et 10' });
    }

   
    // Vérifier les enseignants
    if (enseignants && enseignants.length > 0) {
      for (const enseignantId of enseignants) {
        const enseignant = await Enseignant.findById(enseignantId);
        if (!enseignant) {
          return res.status(404).json({ 
            message: `Enseignant ${enseignantId} non trouvé` 
          });
        }
      }
    }

    // Créer la matière
    const matiere = new Matiere({
      nom,
      description,
      coefficient,
      enseignants: enseignants || [],
    });

    // Sauvegarder la matière
    await matiere.save();

  

    // Mettre à jour les enseignants avec la nouvelle matière
    if (enseignants && enseignants.length > 0) {
      await Enseignant.updateMany(
        { _id: { $in: enseignants } },
        { $push: { matieres: matiere._id } }
      );
    }

    res.status(201).json(matiere);
  } catch (error) {
    console.error('Erreur création matière:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la création de la matière' 
    });
  }
};


// Récupérer toutes les matières
exports.getAllMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.find().populate('enseignants', 'nom prenom');
    res.status(200).json(matieres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une matière par ID
exports.getMatiereById = async (req, res) => {
  try {
    const matiere = await Matiere.findById(req.params.id).populate('enseignants');
    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }
    res.status(200).json(matiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une matière
exports.updateMatiere = async (req, res) => {
  try {
    const { nom, description, coefficient, enseignants } = req.body;
    const matiere = await Matiere.findById(req.params.id);

    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }

    // Vérifier l'unicité du nom si modifié
    if (nom && nom !== matiere.nom) {
      const existingMatiere = await Matiere.findOne({ nom });
      if (existingMatiere) {
        return res.status(400).json({ message: 'Ce nom est déjà utilisé' });
      }
      matiere.nom = nom;
    }

    if (description !== undefined) matiere.description = description;
    
    if (coefficient !== undefined) {
      if (coefficient < 1 || coefficient > 10) {
        return res.status(400).json({ message: 'Le coefficient doit être entre 1 et 10' });
      }
      matiere.coefficient = coefficient;
    }

    // Mettre à jour les enseignants
    if (enseignants !== undefined) {
      for (const enseignantId of enseignants) {
        const enseignant = await Enseignant.findById(enseignantId);
        if (!enseignant) {
          return res.status(404).json({ message: `Enseignant ${enseignantId} non trouvé` });
        }
      }
      matiere.enseignants = enseignants;
    }

    await matiere.save();
    res.status(200).json(matiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une matière
exports.deleteMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndDelete(req.params.id);
    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }

    // Nettoyer les références dans les enseignants
    await Enseignant.updateMany(
      { _id: { $in: matiere.enseignants } },
      { $pull: { matieres: matiere._id } }
    );

    res.status(200).json({ message: 'Matière supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Méthodes supplémentaires pour gérer les enseignants
exports.addEnseignant = async (req, res) => {
  try {
    const { enseignantId } = req.body;
    const matiere = await Matiere.findById(req.params.id);

    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }

    const enseignant = await Enseignant.findById(enseignantId);
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant non trouvé' });
    }

    // Vérifier si l'enseignant est déjà associé
    if (matiere.enseignants.includes(enseignantId)) {
      return res.status(400).json({ message: 'Cet enseignant est déjà associé à cette matière' });
    }

    matiere.enseignants.push(enseignantId);
    await matiere.save();

    // Ajouter la matière à l'enseignant
    if (!enseignant.matiere.includes(matiere._id)) {
      enseignant.matiere.push(matiere._id);
      await enseignant.save();
    }

    res.status(200).json(matiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeEnseignant = async (req, res) => {
  try {
    const { enseignantId } = req.body;
    const matiere = await Matiere.findById(req.params.id);

    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }

    const enseignant = await Enseignant.findById(enseignantId);
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant non trouvé' });
    }

    // Retirer l'enseignant de la matière
    matiere.enseignants = matiere.enseignants.filter(id => id.toString() !== enseignantId);
    await matiere.save();

    // Retirer la matière de l'enseignant
    enseignant.matiere = enseignant.matiere.filter(id => id.toString() !== matiere._id.toString());
    await enseignant.save();

    res.status(200).json(matiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};