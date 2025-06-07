const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nomUtilisateur: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true }, // Plus optionnel
  cin: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['admin', 'eleve', 'professeur', 'adminGPA'], 
    required: true
  },
  // Ajouter des références selon le rôle
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' },
  enseignantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' }
}, {
  timestamps: true
});
module.exports = mongoose.model('Utilisateur', utilisateurSchema);