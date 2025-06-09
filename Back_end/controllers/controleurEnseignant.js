// controllers/enseignantController.js
const Enseignant = require("../models/Enseignant");
const Matiere = require('../models/Matiere');
const Utilisateur = require('../models/Utilisateur');
// Dans votre fichier de contrôleur (enseignantController.js)
const bcrypt = require('bcryptjs');
// Fonction pour générer un mot de passe aléatoire
const genererMotDePasse = () => {
  const longueur = 10;
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultat = '';
  for (let i = 0; i < longueur; i++) {
    resultat += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultat;
};

// Fonction pour générer un nom d'utilisateur unique
const genererNomUtilisateurUnique = async (prenom, nom) => {
  let baseNomUtilisateur = `${prenom.toLowerCase()}.${nom.toLowerCase()}`;
  let nomUtilisateur = baseNomUtilisateur;
  let compteur = 1;
  
  // Vérifier si le nom d'utilisateur existe déjà
  while (await Utilisateur.findOne({ nomUtilisateur })) {
    nomUtilisateur = `${baseNomUtilisateur}${compteur}`;
    compteur++;
  }
  
  return nomUtilisateur;
};

exports.createEnseignant = async (req, res) => {
  const { nom, prenom, email, matieres, telephone } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const emailExiste = await Utilisateur.findOne({ email });
    if (emailExiste) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // 1. Créer l'enseignant
    const enseignant = new Enseignant({ nom, prenom, email, matieres, telephone });
    const enseignantCree = await enseignant.save();

    // 2. Générer un nom d'utilisateur unique et mot de passe
    const nomUtilisateur = await genererNomUtilisateurUnique(prenom, nom);
    const motDePasse = genererMotDePasse();

    // 3. Créer l'utilisateur associé
    const nouvelUtilisateur = new Utilisateur({
      nomUtilisateur,
      email,
      motDePasse: await bcrypt.hash(motDePasse, 10),
      cin: `GP${Date.now()}`,
      role: 'professeur',
      enseignantId: enseignantCree._id
    });

    await nouvelUtilisateur.save();

    // 4. Envoyer les identifiants par email (simulé ici)
    console.log(`Identifiants créés pour ${prenom} ${nom}:`);
    console.log(`Nom d'utilisateur: ${nomUtilisateur}`);
    console.log(`Mot de passe: ${motDePasse}`);

    res.status(201).json({
      enseignant: enseignantCree,
      message: 'Enseignant et compte utilisateur créés avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Erreur serveur lors de la création' 
    });
  }
};

// Dans votre contrôleur enseignants
exports.getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await Enseignant.find().populate({
      path: 'matiere',
      select: 'nom coefficient',
      options: { lean: true }
    });
    
    res.status(200).json({
      success: true,
      count: enseignants.length,
      data: enseignants
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

// Récupérer un enseignant par ID
exports.getEnseignantById = async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) return res.status(404).json({ message: "Enseignant introuvable" });
    res.status(200).json(enseignant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un enseignant
exports.updateEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!enseignant) return res.status(404).json({ message: "Enseignant introuvable" });
    res.status(200).json(enseignant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un enseignant
exports.deleteEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.findByIdAndDelete(req.params.id);
    if (!enseignant) return res.status(404).json({ message: "Enseignant introuvable" });
    res.status(200).json({ message: "Enseignant supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
