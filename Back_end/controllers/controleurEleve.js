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
      const eleves = await Eleve.find().populate('classe'); // Inclure la classe référencée
      res.json(eleves);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des élèves.", error: err });
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