const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
const Enseignant = require("../models/Enseignant");
const Eleve = require('../models/Eleve');
const crypto = require('crypto'); // Module natif Node.js

// Fonction de hachage alternative
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Inscription d'un utilisateur
exports.inscription = async (req, res) => {
  const { nomUtilisateur, email, motDePasse, cin } = req.body;

  try {
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) return res.status(400).json({ message: "L'utilisateur existe déjà." });

    let role = 'admin';
    if (cin.startsWith('GP')) role = 'professeur';
    else if (cin.startsWith('GE')) role = 'eleve';
    else if (cin.startsWith('GPA')) role = 'adminGPA';

    const motDePasseHache = hashPassword(motDePasse);

    const utilisateur = new Utilisateur({ 
      nomUtilisateur, 
      email, 
      motDePasse: motDePasseHache, 
      role, 
      cin 
    });
    await utilisateur.save();

    const token = jwt.sign(
      { id: utilisateur._id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "Utilisateur inscrit avec succès.",
      user: { id: utilisateur._id, nomUtilisateur: utilisateur.nomUtilisateur, role: utilisateur.role },
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'inscription.", error: err });
  }
};

// Connexion d'un utilisateur
exports.connexion = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(400).json({ message: "Identifiants incorrects" });

    const motDePasseHache = hashPassword(motDePasse);
    if (motDePasseHache !== utilisateur.motDePasse) {
      return res.status(400).json({ message: "Identifiants incorrects" });
    }

    let userData = { 
      id: utilisateur._id, 
      nomUtilisateur: utilisateur.nomUtilisateur, 
      role: utilisateur.role 
    };

    if (utilisateur.role === 'eleve' && utilisateur.eleveId) {
      const eleve = await Eleve.findById(utilisateur.eleveId).populate('classe');
      userData = { ...userData, ...eleve.toObject() };
    } else if (utilisateur.role === 'professeur' && utilisateur.enseignantId) {
      const enseignant = await Enseignant.findById(utilisateur.enseignantId).populate('matieres');
      userData = { ...userData, ...enseignant.toObject() };
    }

    const token = jwt.sign(
      { id: utilisateur._id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Connexion réussie",
      user: userData,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: err });
  }
};

// Déconnexion
exports.deconnexion = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
    res.clearCookie('connect.sid');
    res.json({ message: "Déconnexion réussie." });
  });
};

// Récupération des utilisateurs
exports.getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    const repartitionUtilisateurs = [
      { name: 'Administrateurs', value: utilisateurs.filter(u => u.role === 'administrateur').length, fill: '#8884d8' },
      { name: 'Enseignants', value: utilisateurs.filter(u => u.role === 'enseignant').length, fill: '#82ca9d' },
      { name: 'Étudiants', value: utilisateurs.filter(u => u.role === 'etudiant').length, fill: '#ffc658' },
    ];

    res.status(200).json({
      utilisateurs: utilisateurs.length,
      repartitionUtilisateurs,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs.", error: err });
  }
};