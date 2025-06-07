// controllers/noteController.js
const Note = require('../models/Note');
const Eleve = require('../models/Eleve');
const Matiere = require('../models/Matiere');

// Créer une nouvelle note
exports.createNote = async (req, res) => {
  try {
    const { eleve, matiere, enseignant, valeur, commentaire, typeEvaluation, periode } = req.body;

    // Validation des champs obligatoires
    if (!eleve || !matiere || !enseignant || valeur === undefined) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être fournis' });
    }

    const nouvelleNote = new Note({
      eleve,
      matiere,
      enseignant,
      valeur: parseFloat(valeur),
      commentaire,
      typeEvaluation: typeEvaluation || 'devoir',
      periode: periode || 'trimestre1'
    });

    await nouvelleNote.save();
    
    // Mettre à jour les références
    await Promise.all([
      Eleve.findByIdAndUpdate(eleve, { $push: { notes: nouvelleNote._id } }),
      Matiere.findByIdAndUpdate(matiere, { $push: { notes: nouvelleNote._id } })
    ]);

    res.status(201).json(nouvelleNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les notes avec filtres
exports.getAllNotes = async (req, res) => {
  try {
    const { eleve, matiere, enseignant, periode, minValue, maxValue } = req.query;
    const filters = {};

    if (eleve) filters.eleve = eleve;
    if (matiere) filters.matiere = matiere;
    if (enseignant) filters.enseignant = enseignant;
    if (periode) filters.periode = periode;
    if (minValue || maxValue) {
      filters.valeur = {};
      if (minValue) filters.valeur.$gte = parseFloat(minValue);
      if (maxValue) filters.valeur.$lte = parseFloat(maxValue);
    }

    const populateOptions = [
      { path: 'eleve', select: 'nom prenom' },
      { path: 'matiere', select: 'nom coefficient' },
      { path: 'enseignant', select: 'nom prenom' }
    ];

    const notes = await Note.find(filters)
      .populate(populateOptions)
      .sort({ dateEvaluation: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une note spécifique
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('eleve', 'nom prenom')
      .populate('matiere', 'nom coefficient')
      .populate('enseignant', 'nom prenom');

    if (!note) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une note
exports.updateNote = async (req, res) => {
  try {
    const { valeur, commentaire, typeEvaluation, periode } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    if (valeur !== undefined) note.valeur = parseFloat(valeur);
    if (commentaire !== undefined) note.commentaire = commentaire;
    if (typeEvaluation) note.typeEvaluation = typeEvaluation;
    if (periode) note.periode = periode;

    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    // Nettoyer les références
    await Promise.all([
      Eleve.findByIdAndUpdate(note.eleve, { $pull: { notes: note._id } }),
      Matiere.findByIdAndUpdate(note.matiere, { $pull: { notes: note._id } })
    ]);

    res.status(200).json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques des notes
exports.getNoteStats = async (req, res) => {
  try {
    const { matiere, periode } = req.query;
    const match = {};
    
    if (matiere) match.matiere = mongoose.Types.ObjectId(matiere);
    if (periode) match.periode = periode;

    const stats = await Note.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$matiere',
          moyenne: { $avg: '$valeur' },
          max: { $max: '$valeur' },
          min: { $min: '$valeur' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'matieres',
          localField: '_id',
          foreignField: '_id',
          as: 'matiere'
        }
      },
      { $unwind: '$matiere' },
      {
        $project: {
          'matiere.nom': 1,
          moyenne: { $round: ['$moyenne', 2] },
          max: 1,
          min: 1,
          count: 1
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};