const mongoose = require('mongoose');

// Modèle de l'élève
const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  adresse: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
classe: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe'
  }],  inscriptionDate: { type: Date, default: Date.now },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' }, // Statut de l'élève
}, {
  timestamps: true
});

// Création du modèle
module.exports = mongoose.model('Eleve', eleveSchema);
