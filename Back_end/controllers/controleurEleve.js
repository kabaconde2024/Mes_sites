const Eleve = require('../models/Eleve');
const verifierRole  = require('../middleware/verifierRole');
const  verifierToken = require('../middleware/verifierToken');
const Classe = require('../models/Classe');
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcryptjs'); // Au lieu de 'bcrypt'
const genererMotDePasse = () => {
  const longueur = 12;
  const majuscules = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minuscules = 'abcdefghijklmnopqrstuvwxyz';
  const chiffres = '0123456789';
  const speciaux = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let motDePasse = [
    majuscules.charAt(Math.floor(Math.random() * majuscules.length)),
    minuscules.charAt(Math.floor(Math.random() * minuscules.length)),
    chiffres.charAt(Math.floor(Math.random() * chiffres.length)),
    speciaux.charAt(Math.floor(Math.random() * speciaux.length))
  ].join('');

  const tousCaracteres = majuscules + minuscules + chiffres + speciaux;
  for (let i = 4; i < longueur; i++) {
    motDePasse += tousCaracteres.charAt(Math.floor(Math.random() * tousCaracteres.length));
  }

  return motDePasse.split('').sort(() => 0.5 - Math.random()).join('');
};

exports.ajouterEleve = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, classe, statut, dateNaissance, adresse } = req.body;

    // Validation
    if (!nom || !prenom || !email || !classe) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    // Vérification classe
    const classeExistante = await Classe.findById(classe);
    if (!classeExistante) {
      return res.status(400).json({ message: "Classe invalide" });
    }

    // Création élève
    const nouvelEleve = new Eleve({
      nom, prenom, email, telephone, classe,
      statut: statut || 'actif', dateNaissance, adresse
    });
    const eleveCree = await nouvelEleve.save();

    // Génération identifiants
    const nomUtilisateur = `${prenom.toLowerCase()}.${nom.toLowerCase()}`;
    const motDePasse = genererMotDePasse();
    const cin = `EL${Date.now().toString().slice(-6)}`; // CIN auto-généré

    // Création utilisateur
    const nouvelUtilisateur = new Utilisateur({
      nomUtilisateur,
      email,
      motDePasse: await bcrypt.hash(motDePasse, 10),
      cin, // CIN fourni
      role: 'eleve',
      eleveId: eleveCree._id,
      statut: 'actif'
    });

    await nouvelUtilisateur.save();

    // Réponse (sans mot de passe en production)
    res.status(201).json({
      success: true,
      message: "Comptes créés avec succès",
      eleve: {
        id: eleveCree._id,
        nom,
        prenom
      },
      utilisateur: {
        nomUtilisateur,
        cin
      }
    });

  } catch (err) {
    console.error("Erreur création:", err);

    // Gestion des erreurs
    let message = "Erreur serveur";
    if (err.name === 'ValidationError') {
      message = "Données invalides: " + Object.values(err.errors).map(e => e.message).join(', ');
    } 
    res.status(500).json({ 
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

 exports.obtenirTousLesEleves = async (req, res) => {
  try {
    // 1. Construction de la requête de base
    let query = Eleve.find()
      .populate({
        path: 'classe',
        select: 'nom niveau', // Seulement les champs nécessaires
        options: { lean: true } // Optimisation des performances
      })
      .lean(); // Conversion en objets JavaScript simples pour meilleure performance

    // 2. Option pour peupler les utilisateurs associés (si nécessaire)
    if (req.query.populateUtilisateur === 'true') {
      query = query.populate({
        path: 'utilisateurId',
        select: 'nomUtilisateur statut',
        match: { statut: 'actif' } // Seulement les utilisateurs actifs
      });
    }

    // 3. Exécution de la requête
    const eleves = await query.exec();

    // 4. Formatage des données avant envoi
    const elevesFormates = eleves.map(eleve => ({
      ...eleve,
      // Ajout d'un champ calculé pour le nom complet
      nomComplet: `${eleve.prenom} ${eleve.nom}`.trim(),
      // Gestion propre des classes non attribuées
      classe: eleve.classe || { nom: 'Non attribué', niveau: '' }
    }));

    // 5. Envoi de la réponse
    res.json({
      success: true,
      count: elevesFormates.length,
      data: elevesFormates
    });

  } catch (err) {
    console.error('Erreur lors de la récupération des élèves:', err);
    
    // Gestion plus fine des erreurs
    let statusCode = 500;
    let message = "Erreur serveur lors de la récupération des élèves";
    
    if (err.name === 'CastError') {
      statusCode = 400;
      message = "Format de requête invalide";
    }

    res.status(statusCode).json({ 
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
  // Obtenir un élève par ID
  exports.obtenirEleveParId = async (req, res) => {
    try {
      const eleve = await Eleve.findById(req.params.id).populate('classe'); // Inclure la classe référencée
      if (!eleve) return res.status(404).json({ message: "Élève non trouvé." });
      res.json(eleve);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'élève.", error: err });
    }
  };
  
  // Mettre à jour les informations d'un élève
  exports.mettreAJourEleve = async (req, res) => {
    const {
      nom, prenom, dateNaissance, adresse, email, telephone, classe, statut
    } = req.body;
  
    try {
      const eleveMisAJour = await Eleve.findByIdAndUpdate(
        req.params.id,
        {
          nom,
          prenom,
          dateNaissance,
          adresse,
          email,
          telephone,
          classe,
          statut,
        },
        { new: true }
      ).populate('classe'); // Inclure la classe référencée après la mise à jour
      res.json(eleveMisAJour);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'élève.", error: err });
    }
  };
  
  
  // Supprimer un élève
  exports.supprimerEleve = async (req, res) => {
    try {
      await Eleve.findByIdAndDelete(req.params.id);
      res.json({ message: "Élève supprimé avec succès." });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'élève.", error: err });
    }
  };