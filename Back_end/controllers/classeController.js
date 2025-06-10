const Classe = require('../models/Classe');
const Eleve = require('../models/Eleve');
const Enseignant = require('../models/Enseignant');
const Matiere = require('../models/Matiere');

exports.createClasse = async (req, res) => {
  try {
    const { nom, niveau, matieres } = req.body;

    // Validation des champs obligatoires
    if (!nom || !niveau) {
      return res.status(400).json({ message: 'Le nom et le niveau sont obligatoires' });
    }

    // Vérifier l'unicité du nom
    const classeExistante = await Classe.findOne({ nom });
    if (classeExistante) {
      return res.status(400).json({ message: 'Une classe avec ce nom existe déjà' });
    }

    // Vérifier les matières
    if (matieres && matieres.length > 0) {
      for (const matiere of matieres) {
        const matiereExistante = await Matiere.findById(matiere.matiere);
        
        if (!matiereExistante || !enseignantExist) {
          return res.status(404).json({ 
            message: 'Matière ou enseignant non trouvé' 
          });
        }
      }
    }

    const nouvelleClasse = new Classe({
      nom,
      niveau,
      matieres: matieres || []
    });

    await nouvelleClasse.save();
    res.status(201).json(nouvelleClasse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les classes avec options de population
exports.getAllClasses = async (req, res) => {
    try {
      // Options de population configurables via query params
      const populateOptions = [];
      
      if (req.query.populateEleves === 'true') {
        populateOptions.push({ path: 'eleves', select: 'nom prenom email' });
      }
      
      if (req.query.populateMatieres === 'true') {
        populateOptions.push({ 
          path: 'matieres.matiere', 
          select: 'nom coefficient description' 
        });
        populateOptions.push({
          path: 'matieres.enseignant',
          select: 'nom prenom email'
        });
      }
  
      let query = Classe.find();
      
      // Appliquer les populations
      populateOptions.forEach(option => {
        query = query.populate(option);
      });
  
      // Exécuter la requête
      const classes = await query.exec();
  
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des classes',
        error: error.message 
      });
    }
  };
  
  // Récupérer une classe spécifique par ID avec options de population
  exports.getClasseById = async (req, res) => {
    try {
      const { id } = req.params;
      
      let query = Classe.findById(id);
      
      // Population conditionnelle
      if (req.query.populate === 'true') {
        query = query
          .populate('eleves', 'nom prenom email')
          .populate('matieres.matiere', 'nom coefficient description')
          .populate('matieres.enseignant', 'nom prenom email');
      }
  
      const classe = await query.exec();
  
      if (!classe) {
        return res.status(404).json({ message: 'Classe non trouvée' });
      }
  
      res.status(200).json(classe);
    } catch (error) {
      res.status(500).json({ 
        message: 'Erreur lors de la récupération de la classe',
        error: error.message 
      });
    }
  };
  
// Mettre à jour les informations de base d'une classe
exports.updateClasse = async (req, res) => {
  try {
    const { nom, niveau } = req.body;
    const classe = await Classe.findById(req.params.id);

    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    if (nom && nom !== classe.nom) {
      const existingClasse = await Classe.findOne({ nom });
      if (existingClasse) {
        return res.status(400).json({ message: 'Ce nom de classe est déjà utilisé' });
      }
      classe.nom = nom;
    }

    if (niveau) classe.niveau = niveau;

    await classe.save();
    res.status(200).json(classe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une classe
exports.deleteClasse = async (req, res) => {
  try {
    const classe = await Classe.findByIdAndDelete(req.params.id);

    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    // Nettoyer les références dans les élèves
    await Eleve.updateMany(
      { _id: { $in: classe.eleves } },
      { $unset: { classe: "" } }
    );

    res.status(200).json({ message: 'Classe supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};